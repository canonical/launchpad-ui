export type StoredZipEntry = {
  name: string;
  size: number;
  open: () => Promise<ReadableStream<Uint8Array>>;
};

export type StoredZipOptions = {
  zip64?: boolean;
};

export type StoredZipResult = {
  body: ReadableStream<Uint8Array>;
  length: number;
};
