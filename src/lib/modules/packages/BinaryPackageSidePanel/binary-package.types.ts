export type BinaryPackageArtifact = {
  id: string;
  architecture: string;
  fileName: string;
  size: number;
  url: string;
};

export type BinaryPackageDetails = {
  summary?: string;
  artifacts: BinaryPackageArtifact[];
  description?: string;
  downloadUrl?: string;
};
