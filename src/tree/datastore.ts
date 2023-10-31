import * as fs from "fs";
import * as path from "path";
import * as vscode from "vscode";
import {
  DockerComposeFile,
  dockerComposeProvider,
} from "./komposeDataProvider";

const DOCKER_COMPOSE_REGEX = /^docker-compose(.*\.y(a)?ml)?$/;

class ComposeFileManager {
  private _allComposeFiles: Set<string> = new Set();

  constructor() {
    this.initializeComposeFiles();
  }

  scanWorkspaceForComposeFiles(workspaceRoot: string) {
    try {
      const files = fs.readdirSync(workspaceRoot);
      for (const file of files) {
        if (DOCKER_COMPOSE_REGEX.test(file)) {
          this._allComposeFiles.add(path.join(workspaceRoot, file));
        }
      }
    } catch (error) {
      console.error("Error reading workspace directory:", error);
      // Consider re-throwing or handling the error differently based on your needs
    }
  }

  initializeComposeFiles() {
    const workspaceFolders = vscode.workspace.workspaceFolders;

    if (workspaceFolders) {
      workspaceFolders.forEach((folder) => {
        this.scanWorkspaceForComposeFiles(folder.uri.fsPath);
      });
    }
  }

  addFile(filePath: string) {
    this._allComposeFiles.add(filePath);
    dockerComposeProvider.refresh();
  }

  deleteFile(filePath: DockerComposeFile) {
    if (filePath?.command?.arguments?.[0]) {
      this._allComposeFiles.delete(filePath.command.arguments[0]);
      dockerComposeProvider.refresh();
    }
  }

  getAllComposeFiles(): string[] {
    return [...this._allComposeFiles];
  }
}

const composeFileManager = new ComposeFileManager();
export default composeFileManager;
