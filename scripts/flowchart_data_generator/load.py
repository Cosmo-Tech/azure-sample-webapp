#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import pandas as pd


pd.set_option("future.no_silent_downcasting", True)


SHEETS_TO_READ = [
    "contains",
    "input",
    "output",
    "ProductionResource",
    "ProductionOperation",
    "Stock",
    "Transport",
]


def rename_cols_to_camel_case(df, cols):
    cols_renaming_dict = {col: col[0].lower() + col[1:] for col in cols}
    df = df.rename(columns=cols_renaming_dict)
    return df


def process_input(data):
    df = data["input"]
    df = df.rename(columns={"source": "src", "target": "dest"})
    df = rename_cols_to_camel_case(df, ["InputQuantity"])
    df["id"] = df[["src", "dest"]].apply(lambda row: "__to__".join(row.values.astype(str)), axis=1)
    return df


def process_output(data):
    df = data["output"]
    df = df.rename(columns={"source": "src", "target": "dest"})
    df["id"] = df[["src", "dest"]].apply(lambda row: "__to__".join(row.values.astype(str)), axis=1)
    return df


def process_transports(data):
    df = data["Transport"]
    # Unused input column: Label
    del df["Label"]

    df = df.rename(columns={"source": "src", "target": "dest"})
    df = rename_cols_to_camel_case(df, ["Duration", "Mode"])
    df["id"] = df[["src", "dest"]].apply(lambda row: "__to__".join(row.values.astype(str)), axis=1)

    # TODO: create timeseries from a merge with TransportSchedules & InitialTransports sheets
    # Missing output columns:
    #  - TransportUnitCosts
    #  - CustomFees
    #  - CO2UnitEmissions
    #  - InitialTransportedQuantities
    #  - InitialTransportedValues

    return df


def process_production_resources(data):
    df = data["ProductionResource"]
    # Unused input column: Label
    del df["Label"]

    df = rename_cols_to_camel_case(df, ["PlantName", "ProductionStep", "ProductionPolicy"])
    df = df.fillna("")  # ProductionPolicy might be empty

    # TODO: create timeseries from a merge with ProductionResourceSchedules sheet
    # Missing output columns:
    #  - OpeningTimes:
    #  - FixedProductionCosts:

    return df


def process_production_operations(data):
    df = data["ProductionOperation"]
    # Unused input columns: Label, Priority, Duration
    del df["Label"]
    del df["Priority"]
    del df["Duration"]

    df = rename_cols_to_camel_case(df, ["PlantName", "IsContractor", "InvestmentCost"])
    df["isContractor"] = df["isContractor"].fillna(False)

    # TODO: create timeseries from a merge with ProductionOperationSchedules sheet
    # Missing output columns:
    #  - CycleTimes:
    #  - OperatingPerformances:
    #  - RejectRates:
    #  - QuantitiesToProduce:
    #  - ProductionUnitCosts:
    #  - CO2UnitEmissions:

    return df


def process_stocks(data):
    df = data["Stock"]
    # Unused input columns: Label, ReviewPeriod
    del df["Label"]
    del df["ReviewPeriod"]

    df = rename_cols_to_camel_case(
        df,
        [
            "PartId",
            "PlantName",
            "Step",
            "IsInfinite",
            "InitialStock",
            "StockPolicy",
            "SourcingPolicy",
            "DispatchPolicy",
            "Latitude",
            "Longitude",
        ],
    )
    df["isInfinite"] = df["isInfinite"].fillna(False)
    df = df.fillna("")

    # TODO: create timeseries from a merge with StockSchedules sheet
    # Missing output columns:
    #  - InitialValue
    #  - SafetyQuantities
    #  - MaximalStock
    #  - MinimalStock
    #  - PurchasingUnitCosts
    #  - StorageUnitCosts
    #  - UnitIncomes
    #  - CO2UnitEmissions
    #  - Demands

    return df


def process_compound_relationships(data):
    df = data["contains"]
    df = df.rename(columns={"source": "parent", "target": "child"})
    return df


def load_from_excel_file(file_path):
    excel_file_data = pd.read_excel(file_path, sheet_name=SHEETS_TO_READ)

    input_df = process_input(excel_file_data)
    output_df = process_output(excel_file_data)
    transports_df = process_transports(excel_file_data)
    production_resources_df = process_production_resources(excel_file_data)
    production_operations_df = process_production_operations(excel_file_data)
    stocks_df = process_stocks(excel_file_data)
    compounds_df = process_compound_relationships(excel_file_data)

    return (
        input_df,
        output_df,
        transports_df,
        production_resources_df,
        production_operations_df,
        stocks_df,
        compounds_df,
    )
