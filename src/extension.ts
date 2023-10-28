import * as vscode from "vscode";
import { setupBinary as setupKomposeBinary } from "./binary/binaryManager";
import { multiStepQuickPick } from "./commands/multiStepPick";
import { executeKomposeConvert } from "./komposeCommands/kompose";

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

  context.subscriptions.push(disposable);
}

export function deactivate() {}
