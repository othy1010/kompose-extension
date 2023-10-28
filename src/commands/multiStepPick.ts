import * as vscode from "vscode";

export const KOMPOSE_CONVERT_OPTIONS_KEYS = [
  "chart",
  "controller",
  "serviceGroupMode",
  "serviceGroupName",
  "buildBranch",
  "buildRepo",
  "insecureRepository",
  "build",
  "buildCommand",
  "generateNetworkPolicies",
  "indent",
  "json",
  "namespace",
  "out",
  "profile",
  "pushCommand",
  "pushImage",
  "pushImageRegistry",
  "pvcRequestSize",
  "replicas",
  "secretsAsFiles",
  "stdout",
  "volumes",
  "withKomposeAnnotation",
  "errorOnWarning",
  "file",
  "provider",
  "suppressWarnings",
  "verbose",
] as const;

export async function multiStepQuickPick(): Promise<{
  outputPath: string | null;
  selectedOptions: string[] | null;
}> {
  // First step: Ask for the output location
  const selectOption = await vscode.window.showQuickPick(
    ["Select Current Directory", "Choose Different Directory"],
    {
      placeHolder: "Choose an output location",
    }
  );
  if (!selectOption) {
    return { outputPath: null, selectedOptions: null }; // User cancelled
  }

  let outputLocation: string | undefined;

  if (selectOption === "Select Current Directory") {
    // Use the current workspace directory
    if (vscode.workspace.workspaceFolders) {
      outputLocation = vscode.workspace.workspaceFolders[0].uri.fsPath;
    } else {
      vscode.window.showInformationMessage("No workspace is currently opened.");
      return { outputPath: null, selectedOptions: null };
    }
  } else if (selectOption === "Choose Different Directory") {
    const pickedUriArray = await vscode.window.showOpenDialog({
      canSelectMany: false,
      canSelectFolders: true,
      canSelectFiles: false,
      openLabel: "Select Output Location",
    });
    if (!pickedUriArray || pickedUriArray.length === 0) {
      vscode.window.showInformationMessage("No output location chosen!");
      return { outputPath: null, selectedOptions: null }; // User cancelled
    }

    outputLocation = pickedUriArray[0].fsPath;
  }

  if (!outputLocation) {
    vscode.window.showInformationMessage("No output location chosen!");
    return { outputPath: null, selectedOptions: null }; // User cancelled
  }

  // Second step: Offer multiselect of the KomposeConvert options

  const optionsFromType = KOMPOSE_CONVERT_OPTIONS_KEYS;

  // const selectedKomposeOptions = await vscode.window.showQuickPick(
  //   optionsFromType,
  //   {
  //     placeHolder: "Choose KomposeConvert options",
  //     canPickMany: true,
  //   }
  // );
  const selectedKomposeOptions = null;
  if (!selectedKomposeOptions) {
    vscode.window.showInformationMessage(
      `You chose the output location: ${outputLocation} but didn't select any options.`
    );
    return { outputPath: outputLocation, selectedOptions: null }; // User cancelled options picking or selected none
  }
  return {
    outputPath: outputLocation,
    selectedOptions: selectedKomposeOptions,
  };
}
