import axios from "axios";
import * as fs from "fs";
import * as os from "os";

type DownloadMapping = {
  [platform: string]: {
    [arch: string]: string;
  };
};

const downloadMappings: DownloadMapping = {
  linux: {
    arm64: "kompose-linux-arm64",
    x64: "kompose-linux-amd64",
  },
  darwin: {
    arm64: "kompose-darwin-arm64",
    x64: "kompose-darwin-amd64",
  },
  win32: {
    x64: "kompose-windows-amd64.exe",
  },
};

function getDownloadURL(
  platform: string,
  arch: string,
  version: string
): string {
  if (!downloadMappings[platform] || !downloadMappings[platform][arch]) {
    throw new Error(
      `Unsupported platform or architecture: ${platform}-${arch}`
    );
  }

  return `https://github.com/kubernetes/kompose/releases/download/v${version}/${downloadMappings[platform][arch]}`;
}

export async function downloadKomposeBinary(
  binaryPath: string,
  version: string
): Promise<void> {
  const platform = os.platform();
  const arch = os.arch();

  const downloadUrl = getDownloadURL(platform, arch, version);

  const response = await axios.get(downloadUrl, { responseType: "stream" });

  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(binaryPath);

    writeStream.on("finish", resolve);
    writeStream.on("error", reject);

    response.data.pipe(writeStream);
    response.data.on("error", reject); // Handle axios stream errors
  });
}
