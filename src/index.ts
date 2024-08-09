#!/usr/bin/env node

import os from "os";
import path from "path";
import { defineCommand, runMain, showUsage } from "citty";
import {
  copyCommand,
  createShortcut,
  makeDirIfNotExists,
  startAutoCADCommand,
} from "./utils";
import fs from "fs";
import packageJson from "../package.json" assert { type: "json" };

const main = defineCommand({
  meta: {
    name: "mkscr",
    description:
      "A CLI tool that generates a batch file to open AutoCAD and automatically load a specified DLL",
    version: packageJson.version,
  },
  args: {
    lib: {
      type: "string",
      alias: "l",
      description: "The DLL file to load",
      required: false,
    },
    drawing: {
      type: "string",
      alias: "d",
      description: "Drawing file that will be loaded on startup",
      required: false,
    },
    copy: {
      type: "boolean",
      alias: "c",
      description:
        "Copies everything in DLL's folder before starting AutoCAD and loads the copied DLL",
      required: false,
    },
    name: {
      type: "positional",
      description: "The name of the generated script",
      required: true,
    },
  },
  run({ args }) {
    createScript(args);
  },
});

type CreateScriptArgs = {
  name: string;
  lib?: string;
  drawing?: string;
  copy?: boolean;
};

function createScript({ name, lib, drawing, copy = false }: CreateScriptArgs) {
  const desktop = path.join(os.homedir(), "Desktop");
  const scriptsDir = path.join(desktop, name);

  const hasLib = lib !== undefined;
  const shouldCopyLib = hasLib && copy;

  const drawingPath = drawing ? path.resolve(drawing) : undefined;
  const libPath = hasLib ? path.resolve(lib!) : undefined;
  const libDir = hasLib ? path.dirname(libPath!) : undefined;
  const libName = hasLib ? path.basename(libPath!) : undefined;
  const libDest = path.join(scriptsDir, "lib");
  const newLibPath = hasLib ? path.join(libDest, libName!) : undefined;
  const loadLibPath = shouldCopyLib ? newLibPath : libPath;

  makeDirIfNotExists(shouldCopyLib ? libDest : scriptsDir);

  const scriptFile = path.join(scriptsDir, `startup.scr`);
  const scriptContent = hasLib ? `netload ${loadLibPath}\n` : "";
  fs.writeFileSync(scriptFile, scriptContent);

  const batchFile = path.join(scriptsDir, `open-acad.bat`);
  let batchContent = "";
  if (shouldCopyLib) {
    batchContent += copyCommand(`${libDir}\\*`, `${libDest}\\`) + "\n";
  }
  batchContent += startAutoCADCommand({
    script: scriptFile,
    drawing: drawingPath,
  });
  fs.writeFileSync(batchFile, batchContent);

  const shortcutFile = path.join(desktop, `${name}.lnk`);
  createShortcut(batchFile, shortcutFile);
}

if (process.argv.length < 3) {
  showUsage(main);
} else {
  runMain(main);
}
