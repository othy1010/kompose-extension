import * as fs from "fs";

export function fileExists(path: string): boolean {
  return fs.existsSync(path);
}
