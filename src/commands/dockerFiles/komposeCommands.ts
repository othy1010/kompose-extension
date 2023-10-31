import * as vscode from "vscode";
import { komposeGenerate } from "../komposeGenerate";
import { executeKomposeConvert } from "../../komposeCommands/kompose";
import { getAllComposeFiles } from "../../tree/datastore";

export function registerKomposeCommands(context: vscode.ExtensionContext) {
  let generateSingleDisposable = vscode.commands.registerCommand(
    "kompose.generate",
    async () => {
      const { outputPath, selectedOptions } = await komposeGenerate();
      const activeFile = vscode.window.activeTextEditor?.document.fileName;
      console.log(outputPath, selectedOptions, activeFile);
      if (activeFile) {
        executeKomposeConvert(
          context,
          {
            out: outputPath!,
            file: [activeFile],
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
    }
  );

  let generateMultipleDisposable = vscode.commands.registerCommand(
    "kompose.generateMultiple",
    async () => {
      const { outputPath, selectedOptions } = await komposeGenerate();
      const filesToGenerate = getAllComposeFiles();
      console.log(outputPath, selectedOptions, filesToGenerate);
      executeKomposeConvert(
        context,
        {
          out: outputPath!,
          file: filesToGenerate,
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

  context.subscriptions.push(generateSingleDisposable);
  context.subscriptions.push(generateMultipleDisposable);
}
