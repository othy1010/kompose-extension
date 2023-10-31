import * as vscode from "vscode";
import composeFileManager from "../../tree/datastore";

const COMPOSE_FILE_DIALOG_OPTIONS: vscode.OpenDialogOptions = {
  canSelectMany: false,
  openLabel: "Select docker-compose file",
  filters: {
    composeFiles: ["yml", "yaml"],
  },
};

export async function addDockerCompose(): Promise<void> {
  try {
    const selectedFiles = await vscode.window.showOpenDialog(
      COMPOSE_FILE_DIALOG_OPTIONS
    );

    if (selectedFiles && selectedFiles.length > 0) {
      composeFileManager.addFile(selectedFiles[0].fsPath);
    } else {
      console.log("No file selected.");
    }
  } catch (error: any) {
    console.error(`Error when adding docker-compose file: ${error}`);
    vscode.window.showErrorMessage(
      `Failed to add docker-compose file: ${error.message}`
    );
  }
}
