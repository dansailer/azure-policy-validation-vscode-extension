import * as assert from "assert";
import path from "path";
import * as vscode from "vscode";
//import * as myExtension from '../extension';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

suite("Extension Test Suite", () => {
  if (vscode.window) {
    vscode.window.showInformationMessage("Start all tests.");
  }

  test("Validate Policy command is registered", async () => {
    const uri = vscode.Uri.file(
      path.join(__dirname + "/../../../src/test/data/test.json")
    );
    const document = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(document);
    await sleep(500);
    const commands = await vscode.commands.getCommands(true);
    const validateCommand = commands.includes("extension.validate");
    assert.strictEqual(
      validateCommand,
      true,
      'Command "extension.validate" is not registered'
    );
  });
});
