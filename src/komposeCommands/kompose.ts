import { exec } from "child_process";
import * as vscode from "vscode";

type KomposeConvertOptions = {
  chart?: boolean;
  controller?: string;
  serviceGroupMode?: string;
  serviceGroupName?: string;
  buildBranch?: string;
  buildRepo?: string;
  insecureRepository?: boolean;
  build?: string;
  buildCommand?: string;
  generateNetworkPolicies?: boolean;
  indent?: number;
  json?: boolean;
  namespace?: string;
  out?: string;
  profile?: string[];
  pushCommand?: string;
  pushImage?: boolean;
  pushImageRegistry?: string;
  pvcRequestSize?: string;
  replicas?: number;
  secretsAsFiles?: boolean;
  stdout?: boolean;
  volumes?: string;
  withKomposeAnnotation?: boolean;
  errorOnWarning?: boolean;
  file?: string[];
  provider?: string;
  suppressWarnings?: boolean;
  verbose?: boolean;
};

function buildOptionCommand(optionName: string, value?: any): string {
  if (typeof value === "boolean" && value) {
    return `--${optionName}`;
  } else if (typeof value === "string" || typeof value === "number") {
    return `--${optionName}=${value}`;
  }
  return "";
}

function buildArrayOptionCommand(
  optionName: string,
  values?: string[]
): string {
  return values?.map((value) => `--${optionName}=${value}`).join(" ") || "";
}

export function executeKomposeConvert(
  context: vscode.ExtensionContext,
  options: KomposeConvertOptions,
  callback: (error: Error | null, stdout?: string, stderr?: string) => void
): void {
  const binaryName = process.platform === "win32" ? "kompose.exe" : "kompose";
  const binaryUri = vscode.Uri.joinPath(context.globalStorageUri, binaryName);
  const binaryPath = binaryUri.fsPath;

  const commandParts = [
    binaryPath,
    "convert",
    buildOptionCommand("chart", options.chart),
    buildOptionCommand("controller", options.controller),
    buildOptionCommand("service-group-mode", options.serviceGroupMode),
    buildOptionCommand("service-group-name", options.serviceGroupName),
    buildOptionCommand("build-branch", options.buildBranch),
    buildOptionCommand("build-repo", options.buildRepo),
    buildOptionCommand("insecure-repository", options.insecureRepository),
    buildOptionCommand("build", options.build),
    buildOptionCommand("build-command", options.buildCommand),
    buildOptionCommand(
      "generate-network-policies",
      options.generateNetworkPolicies
    ),
    buildOptionCommand("indent", options.indent),
    buildOptionCommand("json", options.json),
    buildOptionCommand("namespace", options.namespace),
    buildOptionCommand("out", options.out),
    buildOptionCommand("push-command", options.pushCommand),
    buildOptionCommand("push-image", options.pushImage),
    buildOptionCommand("push-image-registry", options.pushImageRegistry),
    buildOptionCommand("pvc-request-size", options.pvcRequestSize),
    buildOptionCommand("replicas", options.replicas),
    buildOptionCommand("secrets-as-files", options.secretsAsFiles),
    buildOptionCommand("stdout", options.stdout),
    buildOptionCommand("volumes", options.volumes),
    buildOptionCommand(
      "with-kompose-annotation",
      options.withKomposeAnnotation
    ),
    buildOptionCommand("error-on-warning", options.errorOnWarning),
    buildOptionCommand("provider", options.provider),
    buildOptionCommand("suppress-warnings", options.suppressWarnings),
    buildOptionCommand("verbose", options.verbose),
    buildArrayOptionCommand("file", options.file),
    buildArrayOptionCommand("profile", options.profile),
  ];

  const command = commandParts.filter((part) => part).join(" ");

  console.log(command);

  exec(command, (error, stdout, stderr) => {
    callback(error, stdout, stderr);
  });
}
