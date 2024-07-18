#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import sys
import argparse
import json
import fileinput
from shutil import copyfile
import pprint as pprint_


ALLOWED_CSP_FILES = ["azure", "custom", "default"]


def parse_arguments():
    parser = argparse.ArgumentParser(
        description='''This script is a python executable, whose goal is to patch a Cosmo Tech webapp package (i.e. a
        "build" folder) by applying changes to the webapp configuration, based on environment variables and
        configuration files. Configuration files can be loaded either from a local folder, or fetched from a git
        repository.
        '''
    )
    parser.add_argument(
        "-n", "--dry-run", action='store_true', help="Print changes to console without applying them", default=False)
    parser.add_argument("-e", "--env-file", help="Path to file to use as source for environment variables")
    parser.add_argument(
        "-i", "--input-folder", help="Path to a local folder to use as configuration input", required=True)
    parser.add_argument("-o", "--output-folder", help="Path to the build output folder", default="./build")
    parser.add_argument('--csp', nargs='+', help='List of CSP files to include. Possible values ' +
                        f' are: {", ".join(ALLOWED_CSP_FILES)} (default: {" ".join(ALLOWED_CSP_FILES)})',
                        default=ALLOWED_CSP_FILES)

    args = parser.parse_args()
    return args


def find_replace_in_file(file_path, old_value, new_value):
    try:
        # Note: with inplace=True, standard output is directed to the input file
        with fileinput.FileInput(file_path, inplace=True, backup='.bak') as file:
            for line in file:
                print(line.replace(old_value, new_value), end='')
        os.remove(file_path + '.bak')
    except Exception as e:
        raise(e)


def pprint(data):
    pprint_.pprint(data, width=120)


def load_json(file_path):
    try:
        with open(file_path, encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        print(e)
        raise RuntimeError(f"Couldn't load JSON file '{file_path}'")


def merge_dicts(input1, input2):
    '''
    Shallow merge, works fine for dicts with a depth of 1
    '''
    return {**input1, **input2}


def deep_merge_dicts(input1, input2):
    '''
    Deep merge, for nested dicts
    '''
    output = dict(input1)
    for key, value in input2.items():
        if key not in output or isinstance(value, str):
            output[key] = value
        else:
            output[key] = deep_merge_dicts(output[key], value)
    return output


def merge_csp_parts(input1, input2):
    '''
    Merge CSP dicts and make sure that each directive value is of type list in the resulting dict
    '''
    output = dict(input1)
    for key, value in input2.items():
        if key not in output:
            if type(value) is list:
                output[key] = value
            else:
                output[key] = [value]
        elif type(value) is list:
            output[key] += value
        else:
            output[key].append(value)
    return output


def load_asset_copy_mapping(input_config_folder):
    specific_asset_copy_mapping_file_path = os.path.join(input_config_folder, 'config', 'AssetCopyMapping.json')
    if os.path.isfile(specific_asset_copy_mapping_file_path):
        print('\nLoading project-specific file AssetCopyMapping.json...')
        asset_copy_mapping = load_json(specific_asset_copy_mapping_file_path)
    else:
        print('\nLoading generic configuration file AssetCopyMapping.json...')
        asset_copy_mapping = load_json("generic_config/AssetCopyMapping.json")

    print(" * resource files to copy:")
    indices_to_remove = []
    for index, operation in enumerate(asset_copy_mapping):
        src_path = os.path.join(input_config_folder, 'assets', operation['src'])
        if os.path.isfile(src_path):
            print(f"   - {operation['src']} -> {operation['dst']}")
        else:
            indices_to_remove.append(index)

    print(" * the following input files have not been found, they won't be copied:")
    for index in indices_to_remove:
        print(f"   - {asset_copy_mapping[index]['src']}")

    indices_to_remove.reverse()
    for index in indices_to_remove:
        del asset_copy_mapping[index]

    return asset_copy_mapping


def apply_asset_copy(input_folder, output_folder, asset_copy_mapping):
    for operation in asset_copy_mapping:
        src_path = os.path.join(input_folder, 'assets', operation['src'])
        dst_path = os.path.join(output_folder, operation['dst'])
        copyfile(src_path, dst_path)


def merge_csp_files(input_config_folder, csp_sources_arg):
    print("\nMerging CSP data...")
    csp_sources = []
    # Split each CSP arg to allow comma-separated syntax in CLI (e.g. "azure,default,custom")
    for csp_element in [el.split(',') for el in csp_sources_arg]:
        if len(csp_element) == 1:
            csp_sources.append(csp_element[0])
        else:
            csp_sources += csp_element
    csp_sources = [el for el in csp_sources if len(el) != 0]  # Ignore empty elements caused by trailing commas

    # Check CSP files allowlist
    for csp_source in csp_sources:
        if csp_source not in ALLOWED_CSP_FILES:
            raise ValueError(
                f"CSP source '{csp_source}' is invalid, please use one of: {', '.join(ALLOWED_CSP_FILES)}")

    # Load & merge CSP JSON files
    csp_dict = {}
    for csp_source in csp_sources:
        file_path = os.path.join('generic_config', 'csp', f'{csp_source}.json')
        if csp_source == 'custom':
            file_path = os.path.join(input_config_folder, 'config', 'ContentSecurityPolicy.json')
            if not os.path.isfile(file_path):
                print(f"  - [WARNING] skipped custom CSP file ContentSecurityPolicy.json (file not found)" )
                continue
        csp_part = load_json(file_path)
        csp_dict = merge_csp_parts(csp_dict, csp_part)

    print("\nCSP to inject:")
    pprint(csp_dict)
    return csp_dict


def generate_csp_html(csp):
    directives = []
    for type, values in csp.items():
        directives.append(f"{type} {' '.join(values)}")
    content = f'<meta http-equiv="Content-Security-Policy" content="{"; ".join(directives)}">'
    print("\nGenerated CSP content:")
    print(content)
    return content


def apply_csp(output_folder, csp_html):
    html_file_path = os.path.join(output_folder, "index.html")
    pattern = '<meta http-equiv="Content-Security-Policy" content=""/>'
    find_replace_in_file(html_file_path, pattern, csp_html)


def load_config_values(input_config_folder, env_file):
    print(f"\nLoading configuration values:" )
    config_values = {}
    file_names = ["ApplicationInsights.json", "GlobalConfiguration.json", "HelpMenuConfiguration.json"]
    for file_name in file_names:
        file_path = os.path.join(input_config_folder, 'config', file_name)
        if not os.path.isfile(file_path):
            print(f"  - [WARNING] skipped {file_name} (file not found)" )
        else:
            print(f"  - parsing {file_name}..." )
            new_values = load_json(file_path)
            config_values = merge_dicts(config_values, new_values)

    print("\nConfiguration values to inject:")
    pprint(config_values)
    return config_values


def generate_config_values_js(config_values):
    rows = [f'  "{k}": "{v}"' for k, v in config_values.items() if v is not None]
    rows_string = ",\n".join(rows)
    js_env_file_content = f'window.publicWebappConfig = {{\n{rows_string}\n}}'

    print("\nJS file content generated from configuration values:")
    print(js_env_file_content)
    return js_env_file_content


def apply_config_values(output_folder, js_env_file_content, public_url=""):
    # Write JS file with config values
    js_file_path = os.path.join(output_folder, 'static', 'js', 'publicWebappConfig.js')
    with open(js_file_path, "w", encoding="utf-8") as f:
        f.write(js_env_file_content)

    # Add JS script loading in index.html
    html_file_path = os.path.join(output_folder, 'index.html')
    pattern = '<script id="publicWebappConfigElement"></script>'
    script_tag = f'<script src="/static/js/publicWebappConfig.js"></script>'
    find_replace_in_file(html_file_path, pattern, script_tag)

    # Inject public URL in path of static resources (src="/foo", href="/bar")
    print(f'\nPatching index.html to use public URL "{public_url}"')
    find_replace_in_file(html_file_path, '="/', f'="{public_url}/')


def merge_translation_files(input_config_folder, output_folder):
    if not os.path.isdir(os.path.join(input_config_folder, 'translations')):
        print("\nCustom translations not defined, skipping this step")
        return None

    print("\nParsing translation files...")
    new_translation_files = {}
    for lang in ['en', 'fr']:
        custom_translations_file_path = os.path.join(input_config_folder, 'translations', f'{lang}.json')
        if not os.path.isfile(custom_translations_file_path):
            print(f'  - [WARNING] skipped {custom_translations_file_path} (file not found)')
            continue
        original_translations_file_path = os.path.join(output_folder, 'locales', lang, 'translation.json')
        print(f'  - parsing {custom_translations_file_path}...')
        custom_translations = load_json(custom_translations_file_path)
        original_translations = load_json(original_translations_file_path)
        new_translation_files[lang] = deep_merge_dicts(original_translations, custom_translations)
    return new_translation_files


def replace_translation_files(output_folder, new_translation_files):
    if new_translation_files is None:
        return
    for lang, file_content in new_translation_files.items():
        with open(os.path.join(output_folder, 'locales', lang, 'translation.json'), "wb") as f:
            f.write(json.dumps(file_content, ensure_ascii=False).encode('utf8'))
    return


def main():
    args = parse_arguments()

    if args.dry_run:
        print("\n*Dry-run is enabled*")

    input_config_folder = args.input_folder

    # Load config & generate new content
    asset_copy_mapping = load_asset_copy_mapping(input_config_folder)
    csp = merge_csp_files(input_config_folder, args.csp)
    csp_html = generate_csp_html(csp)
    config_values = load_config_values(input_config_folder, args.env_file)
    js_env_file_content = generate_config_values_js(config_values)
    new_translation_files = merge_translation_files(input_config_folder, args.output_folder)

    # Generate changes for manifest.json
    public_url = config_values['PUBLIC_URL']

    if args.dry_run:
        print("\nDry-run was enabled, no changes performed")
        return

    # Apply changes in output folder
    apply_asset_copy(input_config_folder, args.output_folder, asset_copy_mapping)
    apply_csp(args.output_folder, csp_html)
    apply_config_values(args.output_folder, js_env_file_content, public_url)
    replace_translation_files(args.output_folder, new_translation_files)
    # TODO: modify manifest.json

    print('\nThe webapp server configuration patch script ran successfully. The server can now be launched with:')
    print(f'  serve -s {args.output_folder}')
    return


if __name__ == "__main__":
    main()
