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

const main = defineCommand({
  meta: {
    name: "mkscr",
    description:
      "A CLI tool that generates a batch file to open AutoCAD and automatically load a specified DLL",
    version: "0.1.0",
  },
  args: {
    lib: {
      type: "string",
      alias: "l",
      description: "The DLL file to load",
    },
    drawing: {
      type: "string",
      alias: "d",
      description: "Drawing file that will be loaded on startup",
    },
    copy: {
      type: "boolean",
      alias: "c",
      description:
        "Copies everything in DLL's folder before starting AutoCAD and loads the copied DLL",
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
  lib: string;
  drawing?: string;
  copy?: boolean;
};

function createScript({ name, lib, drawing, copy = false }: CreateScriptArgs) {
  const desktop = path.join(os.homedir(), "Desktop");
  const scriptsDir = path.join(desktop, name);

  const drawingPath = drawing ? path.resolve(drawing) : undefined;
  const libPath = path.resolve(lib);
  const libDir = path.dirname(libPath);
  const libName = path.basename(libPath);
  const libDest = path.join(scriptsDir, "lib");
  const newLibPath = path.join(libDest, libName);
  const loadLibPath = copy ? newLibPath : libPath;

  makeDirIfNotExists(copy ? libDest : scriptsDir);

  const scriptFile = path.join(scriptsDir, `startup.scr`);
  const scriptContent = `netload ${loadLibPath}\n`;
  fs.writeFileSync(scriptFile, scriptContent);

  const batchFile = path.join(scriptsDir, `open-acad.bat`);
  let batchContent = "";
  if (copy) {
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
