import { buffer } from "node:stream/consumers";
import { promisify } from "node:util";
import { fromBuffer } from "yauzl";
import type { Entry, ZipFile } from "yauzl";

export type StoredZipRecord = {
  name: string;
  compressionMethod: number;
  data: Uint8Array;
};

const openZip = promisify<Buffer, { lazyEntries: boolean }, ZipFile>(
  fromBuffer,
);

export async function archiveOf(
  body: ReadableStream<Uint8Array> | Response,
): Promise<{ bytes: Uint8Array; entries: StoredZipRecord[] }> {
  const response = body instanceof Response ? body : new Response(body);
  const bytes = Buffer.from(await response.arrayBuffer());
  return { bytes, entries: await readEntries(bytes) };
}

async function readEntries(bytes: Buffer): Promise<StoredZipRecord[]> {
  const zipfile = await openZip(bytes, { lazyEntries: true });
  const openReadStream = promisify(zipfile.openReadStream.bind(zipfile));
  return new Promise((resolve, reject) => {
    const entries: StoredZipRecord[] = [];
    zipfile.on("error", reject);
    zipfile.on("end", () => resolve(entries));
    zipfile.on("entry", (entry: Entry) => {
      openReadStream(entry)
        .then(buffer)
        .then((data) => {
          entries.push({
            name: entry.fileName,
            compressionMethod: entry.compressionMethod,
            data: new Uint8Array(data),
          });
          zipfile.readEntry();
        }, reject);
    });
    zipfile.readEntry();
  });
}
