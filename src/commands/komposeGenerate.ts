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

const SELECT_CURRENT_DIR = "Select Current Directory";
const CHOOSE_DIFF_DIR = "Choose Different Directory";
const NO_WORKSPACE_MSG = "No workspace is currently opened.";
const NO_OUTPUT_LOC_MSG = "No output location chosen!";

export async function komposeGenerate(): Promise<{
  outputPath: string | null;
  selectedOptions: string[] | null;
}> {
  const outputLocation = await getOutputLocation();

  if (!outputLocation) {
    throw new Error(NO_OUTPUT_LOC_MSG);
  }

  const selectedKomposeOptions = null; // as this part was commented out previously

  if (!selectedKomposeOptions) {
    return { outputPath: outputLocation, selectedOptions: null };
  }

  return {
    outputPath: outputLocation,
    selectedOptions: selectedKomposeOptions,
  };
}

async function getOutputLocation(): Promise<string | null> {
  const selectOption = await vscode.window.showQuickPick(
    [SELECT_CURRENT_DIR, CHOOSE_DIFF_DIR],
    {
      placeHolder: "Choose an output location",
    }
  );

  if (selectOption === SELECT_CURRENT_DIR) {
    return getCurrentDirectory();
  } else if (selectOption === CHOOSE_DIFF_DIR) {
    return await chooseDifferentDirectory();
  }

  return null;
}

function getCurrentDirectory(): string | null {
  if (vscode.workspace.workspaceFolders) {
    return vscode.workspace.workspaceFolders[0].uri.fsPath;
  }

  throw new Error(NO_WORKSPACE_MSG);
}

async function chooseDifferentDirectory(): Promise<string | null> {
  const pickedUriArray = await vscode.window.showOpenDialog({
    canSelectMany: false,
    canSelectFolders: true,
    canSelectFiles: false,
    openLabel: "Select Output Location",
  });

  if (!pickedUriArray?.length) {
    throw new Error(NO_OUTPUT_LOC_MSG);
  }

  return pickedUriArray[0].fsPath;
}
