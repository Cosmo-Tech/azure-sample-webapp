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
from tools_common.os import rm_dir, mv_file


def parse_arguments():
    parser = argparse.ArgumentParser(
        description='''Create release tags for Azure Sample Webapp. These tags will not be pushed by the script, this
        operation must be done by the user.
        '''
    )
    parser.add_argument("-v", "--version", help="Version to release (e.g. 2.0.0)", required=True)
    args = parser.parse_args()
    return args.version


def check_all(version_brewery, version_vanilla):
    return (
        check_branch_is_main()
        and pull()
        and check_head()
        and not check_tag_exists(version_brewery)
        and not check_tag_exists(version_vanilla)
        )


def remove_specific_files():
    root_folder = get_top_level_folder()
    clean_cypress(root_folder)
    clean_config(root_folder)


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
    config_file_path = os.path.join(root_folder, 'src/config/ScenarioParameters.js')
    vanilla_config_file_path = os.path.join(root_folder, 'src/config/ScenarioParameters.vanilla.js')
    mv_file(vanilla_config_file_path, config_file_path)


def main():
    version = parse_arguments()
    version_brewery = f"v{version}-brewery"
    version_vanilla = f"v{version}-vanilla"
    branch_vanilla = f"release/{version}-vanilla"

    if not check_all(version_brewery, version_vanilla):
        print('error')
        sys.exit(1)

    create_tag(version_brewery)
    create_branch(branch_vanilla)
    remove_specific_files()
    commit_all_changes(f'chore: prepare release {version_vanilla}')
    create_tag(version_vanilla)
    switch('-')  # Switch back to the previous branch or commit
    print('''
The release script ran successfully. Please check created tags are correct, and push them with:

git push --tags

You can get the release changelog with:

git-conventional-commits changelog
''')
    return


if __name__ == "__main__":
    main()
