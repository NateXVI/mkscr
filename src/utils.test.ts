import { test, expect } from "bun:test";
import { getAutoCADPath } from "./utils";

test("getAutoCADPath", () => {
  const path = getAutoCADPath();
  expect(path).toMatch(
    /^C:\\Program Files\\Autodesk\\AutoCAD 20\d{2}\\acad.exe$/
  );
});
