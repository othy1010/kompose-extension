import {
  TreeItem,
  TreeItemCollapsibleState,
  EventEmitter,
  Event,
  Command,
  workspace,
  window,
  ThemeIcon,
  TreeDataProvider,
} from "vscode";
import { basename } from "path";
import composeFileManager from "./datastore";

enum NodeType {
  file,
  category,
}

enum CategoryLabels {
  files = "Files",
  options = "OPTIONS",
}

export class DockerComposeFile extends TreeItem {
  type: NodeType;

  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
    public readonly command?: Command,
    type: NodeType = NodeType.file
  ) {
    super(label, collapsibleState);
    this.type = type;
    this.iconPath = new ThemeIcon("circuit-board");
  }
}

export class DockerComposeProvider
  implements TreeDataProvider<DockerComposeFile>
{
  private _onDidChangeTreeData: EventEmitter<
    DockerComposeFile | undefined | null | void
  > = new EventEmitter<DockerComposeFile | undefined | null | void>();
  readonly onDidChangeTreeData: Event<
    DockerComposeFile | undefined | null | void
  > = this._onDidChangeTreeData.event;

  constructor(private workspaceRoot: string) {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: DockerComposeFile): TreeItem {
    switch (element.type) {
      case NodeType.category:
        element.contextValue = element.label.toLowerCase();
        break;
      case NodeType.file:
        element.contextValue = "dockerComposeFile";
        break;
    }
    return element;
  }

  async getChildren(element?: DockerComposeFile): Promise<DockerComposeFile[]> {
    if (!element) {
      return [
        new DockerComposeFile(
          CategoryLabels.files,
          TreeItemCollapsibleState.Collapsed,
          undefined,
          NodeType.category
        ),
      ];
    }

    if (element.label === CategoryLabels.files) {
      const composeFiles = this.getDockerComposeFiles();
      if (!composeFiles.length) {
        window.showInformationMessage(
          "No docker-compose files in workspace or externally selected."
        );
      }
      return composeFiles;
    }

    return [];
  }

  private getDockerComposeFiles(): DockerComposeFile[] {
    return composeFileManager.getAllComposeFiles().map((file) => {
      return new DockerComposeFile(
        basename(file),
        TreeItemCollapsibleState.None,
        {
          command: "kompose.deleteDockerCompose",
          title: "Delete",
          arguments: [file],
        },
        NodeType.file
      );
    });
  }
}

const workspaceRoot = workspace.rootPath || "";
export const dockerComposeProvider = new DockerComposeProvider(workspaceRoot);
