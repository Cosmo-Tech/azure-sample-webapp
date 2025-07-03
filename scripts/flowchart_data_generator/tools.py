#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os


def get_absolute_path(file_path):
    return os.path.normpath(os.path.join(os.getcwd(), file_path))


def check_folder_exists(folder_path):
    if os.path.exists(folder_path) is False:
        print(f'[ERROR] Folder does not exist: "{folder_path}"')
        return False
    if os.path.isfile(folder_path):
        print(f'[ERROR] Provided path is not a folder: "{folder_path}"')
        return False
    return True


def check_file_exists(file_path):
    if os.path.exists(file_path) is False:
        print(f'[ERROR] File does not exist: "{file_path}"')
        return False
    if os.path.isfile(file_path) is False:
        print(f'[ERROR] Provided path is not a file: "{file_path}"')
        return False
    return True


def check_file_can_be_created(file_path, force=False):
    if os.path.exists(file_path):
        if force is False:
            print(f'[ERROR] File already exists: "{file_path}"')
            return False
        if os.path.isfile(file_path) is False:
            print(f'[ERROR] Provided path is not a file: "{file_path}"')
            return False

    output_folder = os.path.dirname(file_path)
    if os.path.exists(output_folder) is False:
        try:
            os.makedirs(output_folder)
        except Exception as e:
            print(f'[ERROR] Cannot create output folder: "{output_folder}"')
            print(e)
            return False
    return True
