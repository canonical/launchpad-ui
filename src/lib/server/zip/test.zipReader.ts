import { crc32 } from "node:zlib";

type CentralHeader = {
  name: string;
  crc: number;
  flags: number;
  versionNeeded: number;
  dosTime: number;
  dosDate: number;
  size: number;
  localHeaderOffset: number;
};

export type StoredZipRecord = CentralHeader & {
  data: Uint8Array;
  zip64: boolean;
};

export type StoredZipArchive = { entries: StoredZipRecord[]; zip64: boolean };

const LOCAL_FILE_HEADER_SIGNATURE = 0x04034b50;
const DATA_DESCRIPTOR_SIGNATURE = 0x08074b50;
const CENTRAL_DIRECTORY_SIGNATURE = 0x02014b50;
const ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06064b50;
const ZIP64_LOCATOR_SIGNATURE = 0x07064b50;
const END_OF_CENTRAL_DIRECTORY_SIGNATURE = 0x06054b50;
const ZIP64_EXTRA_FIELD_ID = 0x0001;
const MAX_U16 = 0xffff;
const MAX_U32 = 0xffffffff;

export async function archiveOf(
  body: ReadableStream<Uint8Array> | Response,
): Promise<{ bytes: Uint8Array; archive: StoredZipArchive }> {
  const response = body instanceof Response ? body : new Response(body);
  const bytes = new Uint8Array(await response.arrayBuffer());
  return { bytes, archive: readStoredZip(bytes) };
}

export function readStoredZip(bytes: Uint8Array): StoredZipArchive {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const eocd = bytes.byteLength - 22;
  expectSignature(view, eocd, END_OF_CENTRAL_DIRECTORY_SIGNATURE);
  let count = view.getUint16(eocd + 10, true);
  let centralDirectorySize = view.getUint32(eocd + 12, true);
  let centralDirectoryOffset = view.getUint32(eocd + 16, true);
  const zip64 =
    count === MAX_U16 ||
    centralDirectorySize === MAX_U32 ||
    centralDirectoryOffset === MAX_U32;
  if (zip64) {
    const locator = eocd - 20;
    expectSignature(view, locator, ZIP64_LOCATOR_SIGNATURE);
    const zip64Eocd = Number(view.getBigUint64(locator + 8, true));
    expectSignature(view, zip64Eocd, ZIP64_END_OF_CENTRAL_DIRECTORY_SIGNATURE);
    count = Number(view.getBigUint64(zip64Eocd + 32, true));
    centralDirectorySize = Number(view.getBigUint64(zip64Eocd + 40, true));
    centralDirectoryOffset = Number(view.getBigUint64(zip64Eocd + 48, true));
    if (zip64Eocd !== centralDirectoryOffset + centralDirectorySize) {
      throw new Error("The zip64 end record does not follow the directory");
    }
  }
  const expectedEnd = zip64 ? eocd - 76 : eocd;
  if (centralDirectoryOffset + centralDirectorySize !== expectedEnd) {
    throw new Error(
      `The central directory ends at ${centralDirectoryOffset + centralDirectorySize} instead of ${expectedEnd}`,
    );
  }
  const headers: CentralHeader[] = [];
  let position = centralDirectoryOffset;
  for (let index = 0; index < count; index++) {
    const header = readCentralHeader(view, bytes, position);
    headers.push(header.record);
    position = header.next;
  }
  if (position !== centralDirectoryOffset + centralDirectorySize) {
    throw new Error("The central directory size does not match its entries");
  }
  return {
    zip64,
    entries: headers.map((header) => readLocalEntry(view, bytes, header)),
  };
}

function readCentralHeader(
  view: DataView,
  bytes: Uint8Array,
  start: number,
): { record: CentralHeader; next: number } {
  expectSignature(view, start, CENTRAL_DIRECTORY_SIGNATURE);
  const versionNeeded = view.getUint16(start + 6, true);
  const flags = view.getUint16(start + 8, true);
  const method = view.getUint16(start + 10, true);
  const dosTime = view.getUint16(start + 12, true);
  const dosDate = view.getUint16(start + 14, true);
  const crc = view.getUint32(start + 16, true);
  let compressedSize = view.getUint32(start + 20, true);
  let size = view.getUint32(start + 24, true);
  const nameLength = view.getUint16(start + 28, true);
  const extraLength = view.getUint16(start + 30, true);
  let localHeaderOffset = view.getUint32(start + 42, true);
  const nameStart = start + 46;
  const name = new TextDecoder().decode(
    bytes.subarray(nameStart, nameStart + nameLength),
  );
  if (
    size === MAX_U32 ||
    compressedSize === MAX_U32 ||
    localHeaderOffset === MAX_U32
  ) {
    const extra = nameStart + nameLength;
    if (view.getUint16(extra, true) !== ZIP64_EXTRA_FIELD_ID) {
      throw new Error(`Entry ${name} lacks a zip64 extra field`);
    }
    size = Number(view.getBigUint64(extra + 4, true));
    compressedSize = Number(view.getBigUint64(extra + 12, true));
    localHeaderOffset = Number(view.getBigUint64(extra + 20, true));
  }
  if (method !== 0) {
    throw new Error(`Entry ${name} uses compression method ${method}`);
  }
  if (compressedSize !== size) {
    throw new Error(`Entry ${name} has mismatching sizes`);
  }
  return {
    record: {
      name,
      crc,
      flags,
      versionNeeded,
      dosTime,
      dosDate,
      size,
      localHeaderOffset,
    },
    next: nameStart + nameLength + extraLength,
  };
}

function readLocalEntry(
  view: DataView,
  bytes: Uint8Array,
  header: CentralHeader,
): StoredZipRecord {
  const start = header.localHeaderOffset;
  expectSignature(view, start, LOCAL_FILE_HEADER_SIGNATURE);
  const flags = view.getUint16(start + 6, true);
  if (flags !== header.flags) {
    throw new Error(`Entry ${header.name} has inconsistent flags`);
  }
  const nameLength = view.getUint16(start + 26, true);
  const extraLength = view.getUint16(start + 28, true);
  const nameStart = start + 30;
  const name = new TextDecoder().decode(
    bytes.subarray(nameStart, nameStart + nameLength),
  );
  if (name !== header.name) {
    throw new Error(`Local entry ${name} does not match ${header.name}`);
  }
  const zip64 =
    extraLength > 0 &&
    view.getUint16(nameStart + nameLength, true) === ZIP64_EXTRA_FIELD_ID;
  const dataStart = nameStart + nameLength + extraLength;
  const data = bytes.subarray(dataStart, dataStart + header.size);
  const descriptor = dataStart + header.size;
  expectSignature(view, descriptor, DATA_DESCRIPTOR_SIGNATURE);
  const descriptorCrc = view.getUint32(descriptor + 4, true);
  const descriptorCompressedSize = zip64
    ? Number(view.getBigUint64(descriptor + 8, true))
    : view.getUint32(descriptor + 8, true);
  const descriptorSize = zip64
    ? Number(view.getBigUint64(descriptor + 16, true))
    : view.getUint32(descriptor + 12, true);
  if (descriptorCrc !== header.crc || crc32(data) !== header.crc) {
    throw new Error(`Entry ${name} has a CRC mismatch`);
  }
  if (
    descriptorSize !== header.size ||
    descriptorCompressedSize !== header.size
  ) {
    throw new Error(`Entry ${name} has a data descriptor size mismatch`);
  }
  return { ...header, data, zip64 };
}

function expectSignature(view: DataView, offset: number, signature: number) {
  if (
    offset < 0 ||
    offset + 4 > view.byteLength ||
    view.getUint32(offset, true) !== signature
  ) {
    throw new Error(
      `Expected signature 0x${signature.toString(16)} at offset ${offset}`,
    );
  }
}
