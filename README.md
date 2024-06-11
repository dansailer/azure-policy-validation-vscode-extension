# Azure Policy Validator README

This is the README for the Azure Policy Validator extension. This extension provides a set of commands to interact with Azure Policy, including validation and login.

## Features

Azure Policy Validator extension provides the following features:

- **Validate**: This command allows you to validate a Azure polcy file (single JSON). It can be accessed from the command palette or the context menu in the editor when a JSON file is open. The policy must be of the policyType "Custom". As Azure CLI is being used, the Azure CLI must be installed and accessible via `az` command. To be able to successfully write a policy the user needs to have `Security Writer` role or similar permissions. The command will write a policy definition with a random name prefixed with `azure-policy-validator-` and if successful, will delete the definition straight away.

- **Login**: This command allows you to login to your Azure account with `az login`. If you have elevated your rights to Security Writer via PIM, you will need to login again to update the tokens. It can be accessed from the command palette or the context menu in the editor when a JSON file is open.

## Requirements

This extension requires the Azure CLI to be installed on your machine. You can download it from [here](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli).

## Extension Settings

This extension contributes the following settings:

- `azurePolicyValidator.subscription`: Set this to your Azure Subscription ID to use for validation.

## Known Issues

Please report any issues on the [GitHub repository](https://github.com/yourusername/azurepolicyvalidator).

## Release Notes

### 1.0.0

Initial release of Azure Policy Validator.
