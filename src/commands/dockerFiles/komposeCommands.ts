import * as vscode from "vscode";
import { komposeGenerate } from "../komposeGenerate";
import { executeKomposeConvert } from "../../komposeCommands/kompose";
import composeFileManager from "../../tree/datastore";

function handleKomposeConvertCallback(
  error: Error | null,
  stdout?: string,
  stderr?: string
): void {
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

export function registerKomposeCommands(context: vscode.ExtensionContext) {
  let generateSingleDisposable = vscode.commands.registerCommand(
    "kompose.generate",
    async () => {
      const { outputPath, selectedOptions } = await komposeGenerate();

      // Ensure outputPath is valid
      if (!outputPath) {
        console.error("Output path is not defined");
        return;
      }

      const activeFile = vscode.window.activeTextEditor?.document.fileName;
      console.log(outputPath, selectedOptions, activeFile);

      if (activeFile) {
        executeKomposeConvert(
          context,
          {
            out: outputPath,
            file: [activeFile],
          },
          handleKomposeConvertCallback
        );
      }
    }
  );

  let generateMultipleDisposable = vscode.commands.registerCommand(
    "kompose.generateMultiple",
    async () => {
      const { outputPath, selectedOptions } = await komposeGenerate();

      // Ensure outputPath is valid
      if (!outputPath) {
        console.error("Output path is not defined");
        return;
      }

      const filesToGenerate = composeFileManager.getAllComposeFiles();
      console.log(outputPath, selectedOptions, filesToGenerate);

      executeKomposeConvert(
        context,
        {
          out: outputPath,
          file: filesToGenerate,
        },
        handleKomposeConvertCallback
      );
    }
  );

  // Adding the commands to the extension's subscriptions
  context.subscriptions.push(
    generateSingleDisposable,
    generateMultipleDisposable
  );
}
