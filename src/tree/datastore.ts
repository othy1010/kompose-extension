import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  DockerComposeFile,
  dockerComposeProvider,
} from "./komposeDataProvider";

// A list to hold paths of all docker-compose files (both external and internal).
let allComposeFiles: Set<string> = new Set();

// Function to scan the workspace for docker-compose files
function scanWorkspaceForComposeFiles(workspaceRoot: string) {
  const dockerComposeRegex = /^docker-compose(.*\.y(a)?ml)?$/;
  try {
    const files = fs.readdirSync(workspaceRoot);
    for (const file of files) {
      if (dockerComposeRegex.test(file)) {
        const absoluteFilePath = path.join(workspaceRoot, file);
        allComposeFiles.add(absoluteFilePath); // Use add method of Set
      }
    }
  } catch (error) {
    console.error("Error reading workspace directory:", error);
  }
}

export function addFile(filePath: string) {
  allComposeFiles.add(filePath); // Using the add method of Set ensures uniqueness

  dockerComposeProvider.refresh();
}

export function deleteFile(filePath: DockerComposeFile) {
  if (filePath && filePath.command && filePath.command.arguments) {
    allComposeFiles.delete(filePath.command.arguments[0]); // Use delete method of Set
    dockerComposeProvider.refresh();
  }
}

export function getAllComposeFiles(): string[] {
  return [...allComposeFiles];
}

// Initialize the allComposeFiles with the existing files in the workspace
const workspaceRoot = vscode.workspace.rootPath;
if (workspaceRoot) {
  scanWorkspaceForComposeFiles(workspaceRoot);
}
