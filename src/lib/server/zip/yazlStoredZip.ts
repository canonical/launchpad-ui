import { Readable } from "node:stream";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import { ZipFile } from "yazl";
import type {
  StoredZipEntry,
  StoredZipOptions,
  StoredZipResult,
} from "./types.js";

export function yazlStoredZip(
  entries: ReadonlyArray<StoredZipEntry>,
  options: StoredZipOptions = {},
): StoredZipResult {
  const zipfile = new ZipFile();
  const output = zipfile.outputStream as Readable;
  let current: Readable | undefined;
  let length = -1;
  for (const { name, size, open } of entries) {
    zipfile.addReadStreamLazy(
      name,
      { compress: false, size, forceZip64Format: options.zip64 },
      (callback) =>
        open().then(
          (stream) => {
            current = Readable.fromWeb(
              stream as NodeReadableStream<Uint8Array>,
            );
            callback(null, current);
          },
          (reason) => output.destroy(reason),
        ),
    );
  }
  zipfile.on("error", (error: Error) => output.destroy(error));
  output.on("close", () => current?.destroy());
  zipfile.end({ forceZip64Format: options.zip64 ?? false, comment: "" }, ((
    calculatedTotalSize: number,
  ) => {
    length = calculatedTotalSize;
  }) as () => void);
  return {
    body: Readable.toWeb(output) as ReadableStream<Uint8Array>,
    length,
  };
}
