import { Readable } from "node:stream";
import { ReadableStream as NodeReadableStream } from "node:stream/web";
import { ZipFile } from "yazl";
import type { StoredZipEntry, StoredZipResult } from "./types.js";

export function storedZip(
  entries: ReadonlyArray<StoredZipEntry>,
): StoredZipResult {
  const zipfile = new ZipFile();
  const output = zipfile.outputStream as Readable;
  let current: Readable | undefined;
  let length = -1;
  for (const { name, size, open } of entries) {
    zipfile.addReadStreamLazy(name, { compress: false, size }, (callback) =>
      open().then(
        (stream) => {
          current = Readable.fromWeb(stream as NodeReadableStream<Uint8Array>);
          callback(null, current);
        },
        (reason) => output.destroy(reason),
      ),
    );
  }
  zipfile.on("error", (error: Error) => output.destroy(error));
  output.on("close", () => current?.destroy());
  zipfile.end({ forceZip64Format: false, comment: "" }, ((
    calculatedTotalSize: number,
  ) => {
    length = calculatedTotalSize;
  }) as () => void);
  return {
    body: NodeReadableStream.from(output) as ReadableStream<Uint8Array>,
    length,
  };
}
