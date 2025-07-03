#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import json
import pandas as pd


def write_json_file(data, output_folder_path, file_name, pretty=False):
    file_path = os.path.join(output_folder_path, file_name)
    with open(file_path, "w+") as f:
        json_str = json.dumps(data, indent=(2 if pretty else None))
        f.write(json_str)


def export_to_json(graph_data, results_data, output_folder_path, pretty=False):
    (
        input_df,
        output_df,
        transports_df,
        production_resources_df,
        production_operations_df,
        stocks_df,
        compounds_df,
        stock_demands_df,
    ) = graph_data

    graph_json = {
        "input": input_df.to_dict(orient="records"),
        "output": output_df.to_dict(orient="records"),
        "transports": transports_df.to_dict(orient="records"),
        "production_resources": production_resources_df.to_dict(orient="records"),
        "production_operations": production_operations_df.to_dict(orient="records"),
        "stocks": stocks_df.to_dict(orient="records"),
        "compounds": compounds_df.to_dict(orient="records"),
    }
    stock_demands_json = stock_demands_df.to_dict()

    (configuration_df, kpis_df, shortages_df, bottlenecks_df) = results_data
    configuration_json = configuration_df.to_dict(orient="records")
    kpis_json = kpis_df.to_dict(orient="records")
    shortages_json = shortages_df.to_dict()
    bottlenecks_json = bottlenecks_df.to_dict()

    write_json_file(configuration_json, output_folder_path, "configuration.json", pretty)
    write_json_file(graph_json, output_folder_path, "graph.json", pretty)
    write_json_file(stock_demands_json, output_folder_path, "stock_demands.json", pretty)
    write_json_file(kpis_json, output_folder_path, "kpis.json", pretty)
    write_json_file(shortages_json, output_folder_path, "shortages.json", pretty)
    write_json_file(bottlenecks_json, output_folder_path, "bottlenecks.json", pretty)

    print(f'Flowchart instance files exported in folder "{output_folder_path}"')
