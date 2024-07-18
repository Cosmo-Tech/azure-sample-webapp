# patch_webapp_server

This script is a python executable, whose goal is to patch a **Cosmo Tech webapp** package (e.g. a "build" folder) by
applying changes to the webapp configuration, based on **configuration files**.

## Usage

### Parameters

```
usage: main.py [-h] [-n] [-e ENV_FILE] -i INPUT_FOLDER [-o OUTPUT_FOLDER]
                              [--csp CSP [CSP ...]]

  -h, --help            show this help message and exit
  -n, --dry-run         Print changes to console without applying them
  -e ENV_FILE, --env-file ENV_FILE
                        Path to file to use as source for environment variables
  -i INPUT_FOLDER, --input-folder INPUT_FOLDER
                        Path to a local folder to use as configuration input
  -o OUTPUT_FOLDER, --output-folder OUTPUT_FOLDER
                        Path to the build output folder
  --csp CSP [CSP ...]   List of CSP files to include. Possible values are: azure, custom, default
                        (default: azure custom default)
```

# Usage example

Run the script with dry-run enabled:
`python main.py -n -i my_custom_config_folder`

## Basic configuration for projects using a generic webapp

### Content Security Policy

Combinations of these three options are possible:

- `azure`: will add the content of _csp/azure.json_
- `custom`: will search for the file _ContentSecurityPolicy.json_ in the input configuration folder, and add its content
- `default`: will add the content of _csp/default.json_

When merging multiple sources, the CSP directives are **added** to the previous directives. If you want to **replace**
the default directives, you must omit the `azure` and/or `default` sources and declare all the directives you want to
keep in your custom _ContentSecurityPolicy.json_ file.

For instance, merging the two sources below

```json
{ "connect-src": ["'self'"] }
```

```json
{ "connect-src": ["*.api.cosmotech.com"] }
```

will result in the following CSP configuration:

```json
{ "connect-src": ["'self'", "*.api.cosmotech.com"] }
```

## Advanced configuration for customized webapps

### Assets copy mapping

If your webapp adds custom assets into the _public_ folder, and if you want these resources to be patched from each
project configuration, then you must declare the input and ouput paths of these resources in a JSON file describing all
the resources to copy. This file must be named _AssetCopyMapping.json_ and placed in the **input configuration folder**.

If you want to start from a template, you can duplicate the file
[AssetCopyMapping.json](generic_config/AssetCopyMapping.json), but keep in mind that this file
may evolve in future releases of the Cosmo Tech webapp. By editing this file, you can add new resources that are
required by your custom webapp, or remove from the list some assets that are no longer necessary.

The expected format is straightforward: an array of objects with `src` and `dst` properties, describing respectively the
source path and destination path of files to copy.

Example:

```json
[
  { "src": "assets/my_company_logo_dark.png", "dst": "theme/cosmotech_dark_logo.png" },
  { "src": "assets/my_company_logo_light.png", "dst": "theme/cosmotech_light_logo.png" }
]
```
