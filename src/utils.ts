import { spawnSync } from "node:child_process";
import fs from "fs";
import path from "path";

export function getAutoCADPath(): string {
  const autodeskFolder = "C:\\Program Files\\Autodesk";
  if (!fs.existsSync(autodeskFolder)) {
    throw new Error("AutoDesk folder not found");
  }

  const folderReg = /^AutoCAD 20\d{2}$/;
  const autoCadFolder = fs
    .readdirSync(autodeskFolder)
    .find((file) => folderReg.test(file));

  if (!autoCadFolder) {
    throw new Error("AutoCAD folder not found");
  }

  return path.join(autodeskFolder, autoCadFolder, "acad.exe");
}

type StartAutoCADArgs = {
  script?: string;
  drawing?: string;
};

export function startAutoCADCommand({
  script,
  drawing,
}: StartAutoCADArgs): string {
  const autoCADPath = getAutoCADPath();
  let args = [`"${autoCADPath}"`, "/nologo"];

  if (script) {
    args.push("/b", `"${script}"`);
  }

  if (drawing) {
    args.push(`"${drawing}"`);
  }

  return args.join(" ");
}

export function copyCommand(src: string, dest: string): string {
  return `copy "${src}" "${dest}"`;
}

export function makeDirIfNotExists(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function createShortcut(targetFilePath: string, shortcutPath: string) {
  const script = `
      $TargetFilePath = "${targetFilePath}"
      $ShortcutFilePath = "${shortcutPath}"

      $WshShell = New-Object -comObject WScript.Shell
      $Shortcut = $WshShell.CreateShortcut($ShortcutFilePath)
      $Shortcut.TargetPath = $TargetFilePath
      $Shortcut.WindowStyle = 7  # Minimized
      $Shortcut.Save()
      `;

  const out = spawnSync("powershell", ["-NoProfile", "-Command", script]);

  if (out.stderr.length > 0) {
    console.error(out.stderr.toString());
    throw new Error("Failed to create shortcut");
  }
}
