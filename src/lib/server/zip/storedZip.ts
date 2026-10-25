// This zip handling utility is LLM generated
// I have no intention of going deep into ZIP details manually
// In pre LLM era it would, most likely, be a copy-paste
// There is an alternative: yazl library.
// Other libraries were considered:
// - fflate (no total size calculation to show progress in browser downloads or zip64 support)
// - achiver (again no total size and has 8 dependencies)
// I ask a reviewer to provide an opinion on
// - yazl library usage (lib/server/zip/yazlStoredZip)
// - this file usage as is
// - or defend deep dive into zip handling, that will probably take days

import { ReadableStream as NodeReadableStream } from "node:stream/web";
import { crc32 } from "node:zlib";
import type {
  StoredZipEntry,
  StoredZipOptions,
  StoredZipResult,
} from "./types.js";

type StoredZipLayout = { zip64: boolean; length: number; names: Uint8Array[] };
type Field = ["u16" | "u32" | "u64", number] | ["bytes", Uint8Array];

const encoder = new TextEncoder();
const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06064b50;
const ZIP64_LOCATOR_SIGNATURE = 0x07064b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const ZIP64_EXTRA_FIELD_ID = 0x0001;
const FLAGS = 0x0808;
const METHOD_STORED = 0;
const VERSION_DEFAULT = 20;
const VERSION_ZIP64 = 45;
const MAX_U16 = 0xffff;
const MAX_U32 = 0xffffffff;
const LOCAL_FILE_HEADER_LENGTH = 30;
const CENTRAL_DIRECTORY_HEADER_LENGTH = 46;
const END_OF_CENTRAL_DIRECTORY_LENGTH = 22;
const ZIP64_END_OF_CENTRAL_DIRECTORY_LENGTH = 56;
const ZIP64_LOCATOR_LENGTH = 20;
const ZIP64_LOCAL_EXTRA_LENGTH = 20;
const ZIP64_CENTRAL_EXTRA_LENGTH = 28;
const DATA_DESCRIPTOR_LENGTH = 16;
const ZIP64_DATA_DESCRIPTOR_LENGTH = 24;

export function storedZip(
  entries: ReadonlyArray<StoredZipEntry>,
  options: StoredZipOptions = {},
): StoredZipResult {
  const zipLayout = layout(entries, options);
  return {
    body: NodeReadableStream.from(
      storedZipChunks(entries, zipLayout),
    ) as ReadableStream<Uint8Array>,
    length: zipLayout.length,
  };
}

function layout(
  entries: ReadonlyArray<StoredZipEntry>,
  options: StoredZipOptions,
): StoredZipLayout {
  const names = entries.map((entry) => encoder.encode(entry.name));
  const zip64 =
    options.zip64 ??
    (entries.length >= MAX_U16 ||
      entries.some((entry) => entry.size >= MAX_U32) ||
      archiveLength(entries, names, false) >= MAX_U32);
  return { zip64, length: archiveLength(entries, names, zip64), names };
}

function archiveLength(
  entries: ReadonlyArray<StoredZipEntry>,
  names: Uint8Array[],
  zip64: boolean,
): number {
  let length =
    END_OF_CENTRAL_DIRECTORY_LENGTH +
    (zip64 ? ZIP64_END_OF_CENTRAL_DIRECTORY_LENGTH + ZIP64_LOCATOR_LENGTH : 0);
  for (const [index, entry] of entries.entries()) {
    const nameLength = names[index].byteLength;
    length +=
      LOCAL_FILE_HEADER_LENGTH +
      nameLength +
      (zip64 ? ZIP64_LOCAL_EXTRA_LENGTH : 0);
    length += entry.size;
    length += zip64 ? ZIP64_DATA_DESCRIPTOR_LENGTH : DATA_DESCRIPTOR_LENGTH;
    length +=
      CENTRAL_DIRECTORY_HEADER_LENGTH +
      nameLength +
      (zip64 ? ZIP64_CENTRAL_EXTRA_LENGTH : 0);
  }
  return length;
}

async function* storedZipChunks(
  entries: ReadonlyArray<StoredZipEntry>,
  { zip64, names }: StoredZipLayout,
): AsyncGenerator<Uint8Array, void, undefined> {
  const { dosDate, dosTime } = dosDateTime(new Date());
  const centralDirectory: Uint8Array[] = [];
  let offset = 0;
  for (const [index, entry] of entries.entries()) {
    const name = names[index];
    const localHeaderOffset = offset;
    const header = localFileHeader(name, zip64, dosTime, dosDate);
    yield header;
    offset += header.byteLength;
    const crc = yield* copyEntry(entry);
    offset += entry.size;
    const descriptor = dataDescriptor(crc, entry.size, zip64);
    yield descriptor;
    offset += descriptor.byteLength;
    centralDirectory.push(
      centralDirectoryHeader(
        name,
        zip64,
        dosTime,
        dosDate,
        crc,
        entry.size,
        localHeaderOffset,
      ),
    );
  }
  const centralDirectoryOffset = offset;
  let centralDirectorySize = 0;
  for (const header of centralDirectory) {
    yield header;
    centralDirectorySize += header.byteLength;
  }
  yield endOfCentralDirectory(
    entries.length,
    centralDirectorySize,
    centralDirectoryOffset,
    zip64,
  );
}

async function* copyEntry(
  entry: StoredZipEntry,
): AsyncGenerator<Uint8Array, number, undefined> {
  const reader = (await entry.open()).getReader();
  let crc = 0;
  let written = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      if (written + value.byteLength > entry.size) {
        throw new Error(
          `ZIP entry ${entry.name} exceeds its declared size of ${entry.size} bytes`,
        );
      }
      crc = crc32(value, crc);
      written += value.byteLength;
      yield value;
    }
  } finally {
    await reader.cancel().catch(() => undefined);
  }
  if (written !== entry.size) {
    throw new Error(
      `ZIP entry ${entry.name} produced ${written} bytes instead of ${entry.size}`,
    );
  }
  return crc;
}

function localFileHeader(
  name: Uint8Array,
  zip64: boolean,
  dosTime: number,
  dosDate: number,
): Uint8Array {
  const version = zip64 ? VERSION_ZIP64 : VERSION_DEFAULT;
  return pack([
    ["u32", LOCAL_FILE_HEADER_SIGNATURE],
    ["u16", version],
    ["u16", FLAGS],
    ["u16", METHOD_STORED],
    ["u16", dosTime],
    ["u16", dosDate],
    ["u32", 0],
    ["u32", 0],
    ["u32", 0],
    ["u16", name.byteLength],
    ["u16", zip64 ? ZIP64_LOCAL_EXTRA_LENGTH : 0],
    ["bytes", name],
    ...(zip64 ? zip64ExtraField([0, 0]) : []),
  ]);
}

function zip64ExtraField(values: number[]): Field[] {
  return [
    ["u16", ZIP64_EXTRA_FIELD_ID],
    ["u16", values.length * 8],
    ...values.map((value): Field => ["u64", value]),
  ];
}

function dataDescriptor(crc: number, size: number, zip64: boolean): Uint8Array {
  const width = zip64 ? "u64" : "u32";
  return pack([
    ["u32", DATA_DESCRIPTOR_SIGNATURE],
    ["u32", crc],
    [width, size],
    [width, size],
  ]);
}

function centralDirectoryHeader(
  name: Uint8Array,
  zip64: boolean,
  dosTime: number,
  dosDate: number,
  crc: number,
  size: number,
  localHeaderOffset: number,
): Uint8Array {
  const version = zip64 ? VERSION_ZIP64 : VERSION_DEFAULT;
  return pack([
    ["u32", CENTRAL_DIRECTORY_SIGNATURE],
    ["u16", version],
    ["u16", version],
    ["u16", FLAGS],
    ["u16", METHOD_STORED],
    ["u16", dosTime],
    ["u16", dosDate],
    ["u32", crc],
    ["u32", zip64 ? MAX_U32 : size],
    ["u32", zip64 ? MAX_U32 : size],
    ["u16", name.byteLength],
    ["u16", zip64 ? ZIP64_CENTRAL_EXTRA_LENGTH : 0],
    ["u16", 0],
    ["u16", 0],
    ["u16", 0],
    ["u32", 0],
    ["u32", zip64 ? MAX_U32 : localHeaderOffset],
    ["bytes", name],
    ...(zip64 ? zip64ExtraField([size, size, localHeaderOffset]) : []),
  ]);
}

function endOfCentralDirectory(
  count: number,
  centralDirectorySize: number,
  centralDirectoryOffset: number,
  zip64: boolean,
): Uint8Array {
  const zip64Records: Field[] = zip64
    ? [
        ["u32", ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE],
        ["u64", ZIP64_END_OF_CENTRAL_DIRECTORY_LENGTH - 12],
        ["u16", VERSION_ZIP64],
        ["u16", VERSION_ZIP64],
        ["u32", 0],
        ["u32", 0],
        ["u64", count],
        ["u64", count],
        ["u64", centralDirectorySize],
        ["u64", centralDirectoryOffset],
        ["u32", ZIP64_LOCATOR_SIGNATURE],
        ["u32", 0],
        ["u64", centralDirectoryOffset + centralDirectorySize],
        ["u32", 1],
      ]
    : [];
  return pack([
    ...zip64Records,
    ["u32", END_OF_CENTRAL_DIRECTORY_SIGNATURE],
    ["u16", 0],
    ["u16", 0],
    ["u16", zip64 ? MAX_U16 : count],
    ["u16", zip64 ? MAX_U16 : count],
    ["u32", zip64 ? MAX_U32 : centralDirectorySize],
    ["u32", zip64 ? MAX_U32 : centralDirectoryOffset],
    ["u16", 0],
  ]);
}

function dosDateTime(date: Date): { dosDate: number; dosTime: number } {
  const dosDate =
    ((date.getUTCFullYear() - 1980) << 9) |
    ((date.getUTCMonth() + 1) << 5) |
    date.getUTCDate();
  const dosTime =
    (date.getUTCHours() << 11) |
    (date.getUTCMinutes() << 5) |
    (date.getUTCSeconds() >> 1);
  return { dosDate, dosTime };
}

function pack(fields: Field[]): Uint8Array {
  let length = 0;
  for (const field of fields) {
    length += fieldLength(field);
  }
  const bytes = new Uint8Array(length);
  const view = new DataView(bytes.buffer);
  let offset = 0;
  for (const field of fields) {
    if (field[0] === "bytes") {
      bytes.set(field[1], offset);
    } else if (field[0] === "u16") {
      view.setUint16(offset, field[1], true);
    } else if (field[0] === "u32") {
      view.setUint32(offset, field[1], true);
    } else {
      view.setBigUint64(offset, BigInt(field[1]), true);
    }
    offset += fieldLength(field);
  }
  return bytes;
}

function fieldLength(field: Field): number {
  if (field[0] === "bytes") {
    return field[1].byteLength;
  }
  if (field[0] === "u16") {
    return 2;
  }
  if (field[0] === "u32") {
    return 4;
  }
  return 8;
}
