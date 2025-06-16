#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import sys
import argparse
from tools import get_absolute_path, check_folder_exists, check_file_exists, check_file_can_be_created
from load import load_from_excel_file, load_from_results_folder
from export import export_to_json


def parse_arguments():
    parser = argparse.ArgumentParser(description="""Parse Excel instance file to generate flowchart data.""")
    parser.add_argument("--input", "-i", help="Path to input XLSX file", required=True)
    parser.add_argument("--results", "-r", help="(optional) Path to input folder containing the simulation results")
    parser.add_argument("--output", "-o", help="Path to output folder", default="output")
    parser.add_argument(
        "--force",
        "-f",
        action="store_true",
        help="Force file creation even if the output folder already exists",
        default=False,
    )
    parser.add_argument(
        "--pretty", "-p", action="store_true", help="Enable pretty print for the output JSON files", default=False
    )
    args = parser.parse_args()

    return {
        "input_file_path": get_absolute_path(args.input),
        "results_folder_path": get_absolute_path(args.results) if args.results is not None else None,
        "output_folder_path": get_absolute_path(args.output),
        "force": args.force,
        "pretty": args.pretty,
    }


def check_arguments(input_file_path, results_folder_path, output_folder_path, force):
    if check_file_exists(input_file_path) is False:
        return False
    if results_folder_path is not None and check_folder_exists(results_folder_path) is False:
        return False

    output_files = ["graph.json", "stock_demands.json", "kpis.json", "shortages.json", "bottlenecks.json"]
    for file_name in output_files:
        file_path = os.path.join(output_folder_path, file_name)
        if check_file_can_be_created(file_path, force) is False:
            return False
    return True


def main():
    args = parse_arguments()
    input_file_path = args["input_file_path"]
    results_folder_path = args["results_folder_path"]
    output_folder_path = args["output_folder_path"]
    force = args["force"]
    pretty = args["pretty"]

    if check_arguments(input_file_path, results_folder_path, output_folder_path, force) is False:
        sys.exit(1)

    graph_data = load_from_excel_file(input_file_path)
    results_data = load_from_results_folder(results_folder_path, graph_data)
    export_to_json(graph_data, results_data, output_folder_path, pretty)
    return


if __name__ == "__main__":
    main()
