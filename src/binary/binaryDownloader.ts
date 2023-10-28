import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export async function downloadBinary(
  binaryPath: string,
  version: string
): Promise<void> {
  let platform = os.platform();
  let arch = os.arch();

  let downloadUrl: string;

  if (platform === "linux") {
    if (arch === "arm64") {
      downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-linux-arm64`;
    } else if (arch === "x64") {
      downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-linux-amd64`;
    } else {
      throw new Error(`Unsupported architecture for Linux: ${arch}`);
    }
  } else if (platform === "darwin") {
    if (arch === "arm64") {
      downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-darwin-arm64`;
    } else if (arch === "x64") {
      downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-darwin-amd64`;
    } else {
      throw new Error(`Unsupported architecture for macOS: ${arch}`);
    }
  } else if (platform === "win32") {
    downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-windows-amd64.exe`;
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }

  const response = await axios({
    method: "get",
    url: downloadUrl,
    responseType: "stream",
  });

  const writeStream = fs.createWriteStream(binaryPath);
  response.data.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}
