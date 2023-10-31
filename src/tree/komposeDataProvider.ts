import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { getAllComposeFiles } from "./datastore";
enum NodeType {
  file,
  category,
}

export class DockerComposeFile extends vscode.TreeItem {
  type: NodeType;

  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    type: NodeType = NodeType.file
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.iconPath = new vscode.ThemeIcon("circuit-board");
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
    if (element.type === NodeType.category) {
      if (element.label === "Files") {
        element.contextValue = "files";
      } else if (element.label === "OPTIONS") {
        element.contextValue = "options";
      }
    } else if (element.type === NodeType.file) {
      element.contextValue = "dockerComposeFile";
    }
    return element;
  }

  getChildren(element?: DockerComposeFile): Thenable<DockerComposeFile[]> {
    if (!element) {
      // This is the top-level
      return Promise.resolve([
        new DockerComposeFile(
          "Files",
          vscode.TreeItemCollapsibleState.Collapsed,
          undefined,
          NodeType.category
        ),
        // new DockerComposeFile(
        //   "OPTIONS",
        //   vscode.TreeItemCollapsibleState.None,
        //   undefined,
        //   NodeType.category
        // ),
      ]);
    }

    if (element.label === "Files") {
      const composeFiles: DockerComposeFile[] = [];
      const allFiles = getAllComposeFiles();

      for (const file of allFiles) {
        composeFiles.push(
          new DockerComposeFile(
            path.basename(file),
            vscode.TreeItemCollapsibleState.None,
            {
              command: "kompose.deleteDockerCompose",
              title: "Delete",
              arguments: [file], // Passing the file path as an argument to your delete command
            },
            NodeType.file
          )
        );
      }

      if (composeFiles.length === 0) {
        vscode.window.showInformationMessage(
          "No docker-compose files in workspace or externally selected."
        );
      }

      return Promise.resolve(composeFiles);
    }

    return Promise.resolve([]); // Return empty array for OPTIONS for now
  }
}

const workspaceRoot = vscode.workspace.rootPath;
export const dockerComposeProvider = new DockerComposeProvider(
  workspaceRoot || ""
);
