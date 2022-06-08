#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
from tools_common.exec import has_command, run_command


def check_jq(log_if_missing=False):
    """
    Check if jq is installed.
    """
    is_jq_installed = has_command("jq")
    if is_jq_installed is False and log_if_missing:
        print('jq is missing. Please install it with "sudo apt-get install jq"')
    return is_jq_installed


def _on_command_error(msg, out, err):
    print(msg)
    if out:
        print(out)
    if err:
        print(err)


def get_npm_package_version(project_root_folder):
    """
    Get project version from package.json.
    """

    command = "jq .version package.json"
    out, err, ret_code, _ = run_command(command, cwd=project_root_folder)
    if err or ret_code != 0:
        _on_command_error('Something went wrong when parsing the package.json file.', out, err)
        return None

    try:
        return out.split('\n')[0].replace('"', "")
    except Exception:
        _on_command_error('Something went wrong when parsing the package.json file.', out, err)
        return None


def set_npm_package_version(project_root_folder, new_version):
    """
    Set project version in package.json.
    """
    command = f"jq --arg version {new_version} '.version |= $version' package.json"
    out, err, ret_code, _ = run_command(command, cwd=project_root_folder)
    if err or ret_code != 0:
        _on_command_error('Something went wrong when writing the new version in the package.json file.', out, err)
        return False

    package_file_path = os.path.join(project_root_folder, 'package.json')
    with open(package_file_path, 'w+') as file:
        file.write(out)
    return True
