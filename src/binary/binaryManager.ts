import * as vscode from "vscode";
import * as fs from "fs";
import { downloadBinary } from "./binaryDownloader";

export async function setupBinary(
  context: vscode.ExtensionContext
): Promise<void> {
  const binaryUri = vscode.Uri.joinPath(context.globalStorageUri, "kompose");
  const binaryPath = binaryUri.fsPath;
  console.log(`Binary path: ${binaryPath}`);
  // Ensure the global storage directory exists
  vscode.workspace.fs.createDirectory(context.globalStorageUri).then(
    async () => {
      // Check if the binary exists
      if (await checkBinary(binaryUri)) {
        console.log("Binary already exists. Skipping download.");

        // Ensure the binary has execute permissions
        await setPermissions(binaryPath);
      } else {
        // If binary does not exist, proceed with the download

        vscode.window.withProgress(
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

            const version = "1.31.2";

            try {
              await downloadBinary(binaryPath, version);

              // Ensure the binary has execute permissions after downloading
              await setPermissions(binaryPath);

              console.log("binary downloaded and permissions set.");
            } catch (error) {
              if (error instanceof Error) {
                vscode.window.showErrorMessage(
                  `Error downloading kompose: ${error.message}`
                );
              } else {
                vscode.window.showErrorMessage(
                  `Error downloading kompose: ${error}`
                );
              }
            }
          }
        );
      }
    },
    (error) => {
      vscode.window.showErrorMessage(
        `Error creating storage directory: ${error.message}`
      );
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
