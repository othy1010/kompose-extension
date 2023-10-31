import * as vscode from "vscode";
import { dockerComposeProvider } from "../tree/komposeDataProvider";

// A list to hold paths of external docker-compose files.
let externalComposeFiles: string[] = [];

export async function addDockerCompose() {
  const files = await vscode.window.showOpenDialog({
    canSelectMany: false,
    openLabel: "Select docker-compose file",
    filters: {
      composeFiles: ["yml", "yaml"],
    },
  });

  if (files && files.length > 0) {
    externalComposeFiles.push(files[0].fsPath);
    // Refresh the tree view after adding a file.
    dockerComposeProvider.refresh();
  }
}

export function getExternalComposeFiles(): string[] {
  return externalComposeFiles;
}
