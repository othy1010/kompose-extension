// deleteDockerCompose.ts

import * as vscode from "vscode";
import {
  DockerComposeFile,
  dockerComposeProvider,
} from "../../tree/komposeDataProvider";
import composeFileManager from "../../tree/datastore";

export function deleteDockerCompose(filePath: DockerComposeFile) {
  composeFileManager.deleteFile(filePath);
}
