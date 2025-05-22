#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import sys
import argparse
from load import load_from_excel_file
from export import export_to_json


def get_absolute_path(file_path):
    return os.path.normpath(os.path.join(os.getcwd(), file_path))


def parse_arguments():
    parser = argparse.ArgumentParser(description="""Parse Excel instance file to generate flowchart data.""")
    parser.add_argument("--input", "-i", help="Path to input XLSX file", required=True)
    parser.add_argument("--output", "-o", help="Path to output JSON file", default="output.json")
    parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        help="Force file creation even if the output file already exists",
        default=False,
    )
    parser.add_argument(
        "--pretty", "-p", action="store_true", help="Enable pretty print for the output JSON file", default=False
    )
    args = parser.parse_args()

    return {
        "input_file_path": get_absolute_path(args.input),
        "output_file_path": get_absolute_path(args.output),
        "force": args.force,
        "pretty": args.pretty,
    }


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


def check_arguments(input_file_path, output_file_path, force):
    return check_file_exists(input_file_path) and check_file_can_be_created(output_file_path, force)


def main():
    args = parse_arguments()
    input_file_path = args["input_file_path"]
    output_file_path = args["output_file_path"]
    force = args["force"]
    pretty = args["pretty"]

    if check_arguments(input_file_path, output_file_path, force) is False:
        sys.exit(1)

    graph_data = load_from_excel_file(input_file_path)
    export_to_json(graph_data, output_file_path, pretty)
    return


if __name__ == "__main__":
    main()
