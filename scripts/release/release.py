#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import sys
import argparse
from tools_common.git import (
    check_head,
    check_branch_is_main,
    check_tag_exists,
    commit_all_changes,
    create_tag,
    create_branch,
    get_top_level_folder,
    pull,
    switch,
)
from tools_common.os import rm_dir, rm_file, mv_file
from tools_common.jq import check_jq, get_npm_package_version, set_npm_package_version


def is_patch_version(new_version):
    version_details = new_version.split(".")
    if version_details[2] != '0':
        return True
    return False


def parse_arguments():
    parser = argparse.ArgumentParser(
        description='''Create release tags for Azure Sample Webapp. These tags will not be pushed by the script, this
        operation must be done by the user.
        '''
    )
    parser.add_argument("version", help="Version to release (e.g. 2.0.0)")
    args = parser.parse_args()
    return args.version


def check_all(version, tag_brewery, tag_vanilla):
    if is_patch_version(version):
        return (
            check_jq(log_if_missing=True)
            and not check_tag_exists(tag_brewery)
            and not check_tag_exists(tag_vanilla)
            )
    return (
        check_jq(log_if_missing=True)
        and check_branch_is_main()
        and pull()
        and check_head()
        and not check_tag_exists(tag_brewery)
        and not check_tag_exists(tag_vanilla)
        )


def update_package_version(new_version):
    root_folder = get_top_level_folder()
    current_version = get_npm_package_version(root_folder)
    if current_version != new_version:
        print(f'Updating package version: {current_version} -> {new_version}')
        return set_npm_package_version(root_folder, new_version)
    return False


def update_package_version_pre_tag(new_version):
    if update_package_version(new_version):
        commit_all_changes(f"chore: bump webapp version to {new_version}")


def update_package_version_post_tag(new_version):
    try:
        if is_patch_version(new_version):
            print("Not tagging a new minor version. Dev version will NOT be set in package.json.")
            return
        version_details = new_version.split(".")
        version_details[1] = str(int(version_details[1]) + 1)
        new_dev_version = '.'.join(version_details) + '-dev'
        if update_package_version(new_dev_version):
            commit_all_changes(f"chore: bump webapp version to {new_dev_version}")
    except Exception:
        print(f"Could not determine next version number from version '{new_version}'."
              "Dev version will NOT be set in package.json.")


def remove_specific_files():
    root_folder = get_top_level_folder()
    clean_cypress(root_folder)
    clean_config(root_folder)
    clean_ci(root_folder)


def clean_cypress(root_folder):
    files_to_remove = [
        'commons/actions/brewery',
        'commons/constants/brewery',
        'integration/brewery',
    ]
    for file_to_remove in files_to_remove:
        path = os.path.join(root_folder, 'cypress', file_to_remove)
        rm_dir(path)


def clean_config(root_folder):
    '''
    Overwrite brewery config files in "src/config" and in root folder for files matching the patterns:
     - *.vanilla.js
     - *.vanilla.json
    '''
    def restore_vanilla_files_in_folder(folder):
        for config_file_name in os.listdir(folder):
            extensions = ['js', 'json']
            for ext in extensions:
                pattern = f'.vanilla.{ext}'
                if config_file_name.endswith(pattern):
                    generic_config_file_name = config_file_name[:-len(pattern)] + '.' + ext
                    vanilla_config_file_path = os.path.join(folder, config_file_name)
                    generic_config_file_path = os.path.join(folder, generic_config_file_name)
                    mv_file(vanilla_config_file_path, generic_config_file_path)

    config_folder_path = os.path.join(root_folder, 'src', 'config')
    overrides_config_folder_path = os.path.join(root_folder, 'src', 'config', 'overrides')
    powerbi_theme_folder_path = os.path.join(root_folder, 'src', 'theme', 'powerbi')
    restore_vanilla_files_in_folder(config_folder_path)
    restore_vanilla_files_in_folder(overrides_config_folder_path)
    restore_vanilla_files_in_folder(powerbi_theme_folder_path)
    restore_vanilla_files_in_folder(root_folder)


def clean_ci(root_folder):
    '''
    Remove brewery-specific CI files (e.g. Github Actions workflow file)
    '''
    ci_folder_path = os.path.join(root_folder, '.github', 'workflows')
    for ci_file_name in os.listdir(ci_folder_path):
        if ci_file_name.startswith('azure-static-web-apps-') and ci_file_name.endswith('.yml'):
            rm_file(os.path.join(ci_folder_path, ci_file_name))


def main():
    version = parse_arguments()
    tag_brewery = f"v{version}-brewery"
    tag_vanilla = f"v{version}-vanilla"
    branch_vanilla = f"release/{version}-vanilla"

    if not check_all(version, tag_brewery, tag_vanilla):
        sys.exit(1)

    update_package_version_pre_tag(version)
    create_tag(tag_brewery)
    create_branch(branch_vanilla)
    remove_specific_files()
    commit_all_changes(f'chore: prepare release {tag_vanilla}')
    create_tag(tag_vanilla)
    switch('-')  # Switch back to the previous branch or commit
    update_package_version_post_tag(version)
    print('''
The release script ran successfully. Please check created tags are correct, and push them with:
git push --tags

You can get the release changelog with:
git-conventional-commits changelog
''')
    return


if __name__ == "__main__":
    main()
