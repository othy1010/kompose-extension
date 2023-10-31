import * as vscode from "vscode";
import { setupBinary as setupKomposeBinary } from "./binary/binaryManager";
import { addDockerCompose } from "./commands/dockerFiles/komposeAddExternalDockerCompose";
import { deleteDockerCompose } from "./commands/dockerFiles/komposeDeleteDockerCompose";
import { registerKomposeCommands } from "./commands/dockerFiles/komposeCommands";
import { dockerComposeProvider } from "./tree/komposeDataProvider";

// Constants
const DOCKER_COMPOSE_PATTERN = "**/docker-compose*.y*ml";
const KOMPOSE_VIEW = "komposeView";
const DELETE_DOCKER_COMPOSE_COMMAND = "kompose.deleteDockerCompose";
const ADD_DOCKER_COMPOSE_COMMAND = "kompose.addDockerCompose";

export function activate(context: vscode.ExtensionContext) {
  // Setup Kompose binary
  setupKomposeBinary(context);

  console.log('Your extension "kompose" is now active!');

  // Register Kompose commands
  registerKomposeCommands(context);

  // Register tree data provider
  vscode.window.registerTreeDataProvider(KOMPOSE_VIEW, dockerComposeProvider);

  // Register deleteDockerCompose command
  vscode.commands.registerCommand(
    DELETE_DOCKER_COMPOSE_COMMAND,
    deleteDockerCompose
  );

  // Setup Docker Compose watcher
  setupDockerComposeWatcher(context);

  // Register additional commands
  const addDockerComposeDisposable = vscode.commands.registerCommand(
    ADD_DOCKER_COMPOSE_COMMAND,
    addDockerCompose
  );
  context.subscriptions.push(addDockerComposeDisposable);
}

/**
 * Sets up a watcher for Docker Compose files and refreshes the provider on any change.
 * @param context The extension context.
 */
function setupDockerComposeWatcher(context: vscode.ExtensionContext) {
  const dockerComposeWatcher = vscode.workspace.createFileSystemWatcher(
    DOCKER_COMPOSE_PATTERN
  );

  dockerComposeWatcher.onDidChange(() => dockerComposeProvider.refresh());
  dockerComposeWatcher.onDidCreate(() => dockerComposeProvider.refresh());
  dockerComposeWatcher.onDidDelete(() => dockerComposeProvider.refresh());

  context.subscriptions.push(dockerComposeWatcher);
}

export function deactivate() {}
