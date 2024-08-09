# mkscr

## Usage

To see the help:

```bash
npx mkscr --help
```

To create a script:

```bash
npx mkscr -l lib.dll -d drawing.dwg -c my-script
```

> Note: `lib.dll` and `drawing.dwg` should be replaced with the actual paths to your DLL and drawing file. The program doesn't check if the files exist or if they are valid, but it will resolve relative paths.

The `-l` flag specifies the DLL file to load on startup.

The `-d` flag specifies the drawing file that will be loaded on startup.

The `-c` flag tells it to copy everything in the DLL's folder before starting AutoCAD and load the copied DLL.

`my-script` is the name of the generated script.

This will create the folder `~/Desktop/mkscr/my-script` with the following contents:

- `startup.scr`: The AutoCAD script that will load the DLL file. This runs when AutoCAD starts.

- `open-acad.bat`: Batch file that will start AutoCAD, specifying the drawing to open and the script to run.

- `lib`: The folder that will store the DLL file and its dependencies. This is only present if the `-c` flag is specified.

- `command.txt`: This stores the command that was used to create the scripts. It's not the exact same, but should have the same result.

Running the command will also create a shortcut named `my-script.lnk` in your Desktop. This shortcut runs `open-acad.bat` without showing the terminal window.

## Development

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

To test:

```bash
bun run utils.test.ts
```

To build:

```bash
bun run build
```
