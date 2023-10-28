import * as vscode from "vscode";
import { exec } from "child_process";
import { checkBinary } from "../binary/binaryManager";

export function helloWorldCommand(binaryPath: string): void {
  if (!checkBinary(vscode.Uri.file(binaryPath))) {
    vscode.window.showErrorMessage(
      "Kompose binary does not exist. Please wait for the installation to be completed and try again."
    );
    return;
  }
  exec(`sh -c "${binaryPath}"`, (error, stdout, stderr) => {
    if (error) {
      vscode.window.showErrorMessage(
        `Error executing kompose: ${error.message}`
      );
      return;
    }

    if (stderr) {
      vscode.window.showErrorMessage(`Kompose error output: ${stderr}`);
      return;
    }

    vscode.window.showInformationMessage(stdout);
  });
}
