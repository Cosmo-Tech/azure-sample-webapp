#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import sys
from shutil import rmtree


def mv_file(src_file_path, dst_file_path):
    """
    Move source file to the provided destination.
    :param src_file_path: Path to the file to move
    :param dst_file_path: Path to destination for file
    """
    os.rename(src_file_path, dst_file_path)


def rm_dir(folder_path):
    """
    Remove folder whose path is provided, after making sure it is actually a
    folder. If the folder does not exist, the function does nothing.
    :param folder_path: Path to the folder to remove
    """
    if os.path.isfile(folder_path):
        print(f'Error: file "{folder_path}" is not a folder, not removing it')
        sys.exit(1)
    if os.path.isdir(folder_path):
        rmtree(folder_path)


def rm_file(file_path):
    """
    Remove file whose path is provided. If the file does not exist, the function does nothing.
    :param file_path: Path to the file to remove
    """
    if os.path.isdir(file_path):
        print(f'Error: folder "{file_path}" is not a file, not removing it')
        sys.exit(1)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        os.remove(file_path)
