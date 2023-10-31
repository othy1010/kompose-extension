import * as vscode from "vscode";
import { setupBinary as setupKomposeBinary } from "./binary/binaryManager";
import { komposeGenerate } from "./commands/komposeGenerate";
import { executeKomposeConvert } from "./komposeCommands/kompose";
import {
  DockerComposeProvider,
  dockerComposeProvider,
} from "./tree/komposeDataProvider";
import { addDockerCompose } from "./commands/dockerFiles/komposeAddExternalDockerCompose";
import { deleteDockerCompose } from "./commands/dockerFiles/komposeDeleteDockerCompose";
import { registerKomposeCommands } from "./commands/dockerFiles/komposeCommands";

export function activate(context: vscode.ExtensionContext) {
  setupKomposeBinary(context);

  console.log('Your extension "kompose" is now active!');

  registerKomposeCommands(context);
  // get the docker compose icon from the active icon theme

  vscode.window.registerTreeDataProvider("komposeView", dockerComposeProvider);
  vscode.commands.registerCommand(
    "kompose.deleteDockerCompose",
    deleteDockerCompose
  );

  const dockerComposeWatcher = vscode.workspace.createFileSystemWatcher(
    "**/docker-compose*.y*ml"
  );

  dockerComposeWatcher.onDidChange(() => dockerComposeProvider.refresh());
  dockerComposeWatcher.onDidCreate(() => dockerComposeProvider.refresh());
  dockerComposeWatcher.onDidDelete(() => dockerComposeProvider.refresh());

  let addDockerComposeDisposable = vscode.commands.registerCommand(
    "kompose.addDockerCompose",
    addDockerCompose
  );

  context.subscriptions.push(addDockerComposeDisposable);
  context.subscriptions.push(dockerComposeWatcher);
}

export function deactivate() {}
