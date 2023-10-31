import * as vscode from "vscode";
import * as fs from "fs";
import { downloadKomposeBinary } from "./binaryDownloader";

const KOMPOSE_VERSION = "1.31.2"; // Consider putting version numbers in a constants/config file

export async function setupBinary(
  context: vscode.ExtensionContext
): Promise<void> {
  const binaryName = process.platform === "win32" ? "kompose.exe" : "kompose";
  const binaryUri = vscode.Uri.joinPath(context.globalStorageUri, binaryName);
  const binaryPath = binaryUri.fsPath;

  console.log(`Binary path: ${binaryPath}`);

  try {
    await ensureGlobalStorageDirectory(context.globalStorageUri);

    if (await checkBinary(binaryUri)) {
      console.log("Binary already exists. Skipping download.");
      await setPermissions(binaryPath);
    } else {
      await downloadBinaryWithProgress(binaryPath);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      vscode.window.showErrorMessage(`Error: ${error.message}`);
    } else {
      vscode.window.showErrorMessage(`Unknown error occurred: ${error}`);
    }
  }
}

async function ensureGlobalStorageDirectory(uri: vscode.Uri): Promise<void> {
  try {
    await vscode.workspace.fs.createDirectory(uri);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Error creating storage directory: ${error.message}`);
    } else {
      throw new Error(`Unknown error occurred: ${error}`);
    }
  }
}

async function downloadBinaryWithProgress(binaryPath: string): Promise<void> {
  return vscode.window.withProgress(
    {
      location: vscode.ProgressLocation.Notification,
      title: "Downloading kompose binary...",
      cancellable: true,
    },
    async (progress, token) => {
      token.onCancellationRequested(() => {
        console.log("User canceled the download.");
      });

      progress.report({ message: "Starting download..." });

      try {
        await downloadKomposeBinary(binaryPath, KOMPOSE_VERSION);
        await setPermissions(binaryPath);
        console.log("Binary downloaded and permissions set.");
      } catch (error: unknown) {
        throw new Error(
          `Error downloading kompose: ${(error as Error).message}`
        );
      }
    }
  );
}

export async function checkBinary(binaryUri: vscode.Uri): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(binaryUri);
    return true;
  } catch {
    return false;
  }
}

export async function setPermissions(binaryPath: string): Promise<void> {
  try {
    fs.accessSync(binaryPath, fs.constants.X_OK);
  } catch (err) {
    await fs.promises.chmod(binaryPath, "755");
  }
}
