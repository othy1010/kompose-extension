import * as vscode from "vscode";
import { setupBinary as setupKomposeBinary } from "./binary/binaryManager";
import { multiStepQuickPick } from "./commands/multiStepPick";
import { executeKomposeConvert } from "./komposeCommands/kompose";
import {
  DockerComposeProvider,
  dockerComposeProvider,
} from "./tree/komposeDataProvider";
import { addDockerCompose } from "./commands/addDockerCompose";

export function activate(context: vscode.ExtensionContext) {
  setupKomposeBinary(context);

  console.log('Your extension "kompose" is now active!');

  let disposable = vscode.commands.registerCommand(
    "kompose.multiStep",
    async () => {
      const { outputPath, selectedOptions } = await multiStepQuickPick();

      console.log(outputPath, selectedOptions);

      executeKomposeConvert(
        context,
        {
          out: outputPath!,
          file: [vscode.window.activeTextEditor?.document.fileName!],
        },
        (error, stdout, stderr) => {
          if (error) {
            console.error(error);
            return;
          }
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.error(stderr);
          }
        }
      );
    }
  );
  // get the docker compose icon from the active icon theme

  context.subscriptions.push(
    vscode.commands.registerCommand("kompose.enterDetails", async () => {
      const userInput = await vscode.window.showInputBox({
        placeHolder: "Enter your detail here...",
      });

      if (userInput) {
        // Do something with the user input
        console.log(userInput);
      }
    })
  );

  vscode.window.registerTreeDataProvider("komposeView", dockerComposeProvider);

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
  context.subscriptions.push(disposable);
}

export function deactivate() {}
