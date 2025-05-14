#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import json
import pandas as pd


def export_to_json(graph_data, output_file_path, pretty=False):
    (input_df, output_df, transports_df, production_resources_df, production_operations_df, stocks_df, compounds_df) = (
        graph_data
    )

    json_data = {
        "input": input_df.to_dict(orient="records"),
        "output": output_df.to_dict(orient="records"),
        "transports": transports_df.to_dict(orient="records"),
        "production_resources": production_resources_df.to_dict(orient="records"),
        "production_operations": production_operations_df.to_dict(orient="records"),
        "stocks": stocks_df.to_dict(orient="records"),
        "compounds": compounds_df.to_dict(orient="records"),
    }

    with open(output_file_path, "w+") as f:
        json_str = json.dumps(json_data, indent=(2 if pretty else None))
        f.write(json_str)

    print(f'Flowchart instance exported to the file "{output_file_path}"')
