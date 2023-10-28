import * as vscode from "vscode";
import axios from "axios";
import * as fs from "fs";

export async function downloadBinary(
  binaryPath: string,
  version: string
): Promise<void> {
  const downloadUrl = `https://github.com/kubernetes/kompose/releases/download/v${version}/kompose-linux-amd64`; // Adjust this URL for the correct platform.

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
