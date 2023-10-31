import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getExternalComposeFiles } from "../commands/addDockerCompose";
class DockerComposeFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.iconPath = new vscode.ThemeIcon("octoface");
    // No iconPath is set here. VS Code's theme will handle it based on the file extension.
  }
}

export class DockerComposeProvider
  implements vscode.TreeDataProvider<DockerComposeFile>
{
  private _onDidChangeTreeData: vscode.EventEmitter<
    DockerComposeFile | undefined | null | void
  > = new vscode.EventEmitter<DockerComposeFile | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<
    DockerComposeFile | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DockerComposeFile): vscode.TreeItem {
    return element;
  }
  getChildren(element?: DockerComposeFile): Thenable<DockerComposeFile[]> {
    if (!this.workspaceRoot) {
      vscode.window.showInformationMessage("No workspace detected.");
      return Promise.resolve([]);
    }

    const composeFiles: DockerComposeFile[] = [];
    const dockerComposeRegex = /^docker-compose(.*\.y(a)?ml)?$/;

    // ----
    const externalFiles = getExternalComposeFiles();
    for (const file of externalFiles) {
      composeFiles.push(
        new DockerComposeFile(
          path.basename(file),
          vscode.TreeItemCollapsibleState.None
        )
      );
    }
    // ----

    try {
      const files = fs.readdirSync(this.workspaceRoot);
      for (const file of files) {
        if (dockerComposeRegex.test(file)) {
          composeFiles.push(
            new DockerComposeFile(file, vscode.TreeItemCollapsibleState.None)
          );
        }
      }
    } catch (error) {
      console.error("Error reading workspace directory:", error);
    }

    if (composeFiles.length === 0) {
      vscode.window.showInformationMessage(
        "No docker-compose files in workspace"
      );
    }

    return Promise.resolve(composeFiles);
  }
}
const workspaceRoot = vscode.workspace.rootPath;
export const dockerComposeProvider = new DockerComposeProvider(
  workspaceRoot || ""
);
