// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";
import * as childProcess from "child_process";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "Azure Policy Validator" is now active!'
  );

  const disposableMenu = vscode.commands.registerCommand(
    "extension.customMenu",
    (uri) => {
      if (uri && uri.fsPath.endsWith(".json")) {
        fs.readFile(uri.fsPath, "utf8", function (err, data) {
          if (err) {
            vscode.window.showInformationMessage(`Error reading file: ${err}`);
            return;
          }
          const jsonData = JSON.parse(data);
          if (
            jsonData.properties &&
            jsonData.properties.policyType.toLowerCase() === "custom"
          ) {
            const randomId = `azure-policy-validator-${Math.random()
              .toString(36)
              .substring(2)}`;
            const parameters = JSON.stringify(
              jsonData.properties.parameters
            ).replace(/"/g, '\\"');
            const policyRule = JSON.stringify(
              jsonData.properties.policyRule
            ).replace(/"/g, '\\"');
            const azCliCommandCreate = `az policy definition create --rules "${policyRule}" --params "${parameters}" --name ${randomId}`;
            const azCliCommandDelete = `az policy definition delete --name ${randomId}`;

            childProcess.exec(azCliCommandCreate, (error, stdout, stderr) => {
              if (error) {
                vscode.window.showErrorMessage(`${stderr}`);
              } else {
                childProcess.exec(
                  azCliCommandDelete,
                  (error, stdout, stderr) => {
                    if (error) {
                      vscode.window.showErrorMessage(
                        `Error deleting policy definition ${randomId}: ${stderr}`
                      );
                    } else {
                      vscode.window.showInformationMessage(
                        `Policy definition is valid.`
                      );
                    }
                  }
                );
              }
            });
          } else {
            vscode.window.showErrorMessage(
              `Built-in policy found. Please select a custom policy.`
            );
          }
        });
      } else {
        vscode.window.showErrorMessage(
          `Please select a JSON file containing a Azure Policy to validate.`
        );
      }
    }
  );
  context.subscriptions.push(disposableMenu);
}

export function deactivate() {}
