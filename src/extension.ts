// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";
import * as childProcess from "child_process";

export function activate(context: vscode.ExtensionContext) {
  const disposableValidate = vscode.commands.registerCommand(
    "extension.validate",
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
            const config = vscode.workspace.getConfiguration(
              "azurePolicyValidator"
            );
            const subscription = config.get("subscription");
            let azCliCommandCreate = `az policy definition create --rules "${policyRule}" --params "${parameters}" --name ${randomId}`;
            let azCliCommandDelete = `az policy definition delete --name ${randomId}`;
            if (subscription && subscription !== "") {
              azCliCommandCreate += ` --subscription ${subscription}`;
              azCliCommandDelete += ` --subscription ${subscription}`;
            }
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

  const disposableLogin = vscode.commands.registerCommand(
    "extension.login",
    () => {
      childProcess.exec("az login", (error, stdout) => {
        if (error) {
          vscode.window.showErrorMessage(
            `Executing az login resulted in: ${error}`
          );
          return;
        }
        vscode.window.showInformationMessage(
          `Successfully logged in: ${stdout}`
        );
      });
    }
  );

  context.subscriptions.push(disposableValidate);
  context.subscriptions.push(disposableLogin);
}

export function deactivate() {}
