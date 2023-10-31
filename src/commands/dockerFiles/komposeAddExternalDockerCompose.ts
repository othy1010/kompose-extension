import * as vscode from "vscode";
import { addFile, deleteFile, getAllComposeFiles } from "../../tree/datastore";
import { dockerComposeProvider } from "../../tree/komposeDataProvider";

export async function addDockerCompose() {
  const files = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: "Select docker-compose file",
    filters: {
      composeFiles: ["yml", "yaml"],
    },
  });

  if (files && files.length > 0) {
    addFile(files[0].fsPath);
    // Refresh the tree view after adding a file.
  }
}
