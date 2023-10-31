// deleteDockerCompose.ts

import * as vscode from "vscode";
import {
  DockerComposeFile,
  dockerComposeProvider,
} from "../../tree/komposeDataProvider";
import { deleteFile } from "../../tree/datastore";

export function deleteDockerCompose(filePath: DockerComposeFile) {
  deleteFile(filePath);
}
