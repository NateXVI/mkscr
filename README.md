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

The `-l` flag specifies the DLL file to load on startup.

The `-d` flag specifies the drawing file that will be loaded on startup.

The `-c` flag tells it to copy everything in the DLL's folder before starting AutoCAD and load the copied DLL.

`my-script` is the name of the generated script.

This will create a folder named `my-script` in your Desktop. Inside that folder, you will find a file named `startup.scr`, a file named `open-acad.bat`, and a folder named `lib`.

`startup.scr` is an AutoCAD script that will load the DLL file.

`open-acad.bat` is a batch file that will start AutoCAD and load the DLL file.

The `lib` folder is where the DLL file will be copied to before starting AutoCAD. The files are copied when you run `open-acad.bat`, if the `-c` flag is specified.

This will also create a shortcut named `my-script.lnk` in your Desktop. This shortcut runs `open-acad.bat` without showing the terminal window.

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
