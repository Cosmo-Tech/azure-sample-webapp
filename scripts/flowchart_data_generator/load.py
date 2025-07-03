#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import os
import pandas as pd
from tools import check_file_exists


pd.set_option("future.no_silent_downcasting", True)


SHEETS_TO_READ = [
    "contains",
    "input",
    "output",
    "ProductionResource",
    "ProductionOperation",
    "Stock",
    "Transport",
    "Demands",
]


def to_float(value):
    return float(value.replace(",", ""))


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

    return df


def process_stock_demands(data):
    df = data["Demands"]
    # Unused input columns: DemandUncertainties, DemandWeights
    del df["DemandUncertainties"]
    del df["DemandWeights"]

    df = rename_cols_to_camel_case(df, ["Timestep", "Demands"])
    df = df.groupby("id")["demands"].apply(list)
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

    stock_demands_df = process_stock_demands(excel_file_data)

    return (
        input_df,
        output_df,
        transports_df,
        production_resources_df,
        production_operations_df,
        stocks_df,
        compounds_df,
        stock_demands_df,
    )


def process_configuration(file_path):
    df = pd.read_csv(file_path)
    df = rename_cols_to_camel_case(
        df, ["SimulationRun", "StartingDate", "SimulatedCycles", "StepsPerCycle", "TimeStepDuration"]
    )

    for col in ["timeStepDuration"]:
        df[col] = df[col].apply(to_float)

    df['endDate'] = (
        pd.to_datetime(df['startingDate'], format='%m/%d/%Y, %I:%M:%S %p') +
        pd.to_timedelta(df['simulatedCycles'] * df['stepsPerCycle'] * df['timeStepDuration'], unit='m')
    ).dt.strftime('%m/%d/%Y, %I:%M:%S %p')
    return df


def process_kpis(file_path):
    df = pd.read_csv(file_path)
    df = df.rename(
        columns={
            "OPEX": "totalCost",
            "CO2Emissions": "co2Emissions",
            "OnTimeFillRateServiceLevel": "fillRate",
            "Profit": "grossMargin",
            "AverageStockValue": "stockValue",
        }
    )
    df = rename_cols_to_camel_case(df, ["SimulationRun", "SimulationName"])

    for col in ["totalCost", "stockValue", "co2Emissions", "grossMargin"]:
        df[col] = df[col].apply(to_float)
    return df


def process_shortages(dispatched_quantity_measures_path, stock_measures_path):
    dispatched_quantity_df = pd.read_csv(dispatched_quantity_measures_path)
    stock_df = pd.read_csv(stock_measures_path)
    # Unused input columns: SimulationRun, SimulationName
    del dispatched_quantity_df["SimulationRun"]
    del dispatched_quantity_df["SimulationName"]
    del stock_df["SimulationRun"]
    del stock_df["SimulationName"]
    dispatched_quantity_df = rename_cols_to_camel_case(dispatched_quantity_df, ["TimeStep", "Shortage"])
    stock_df = rename_cols_to_camel_case(stock_df, ["TimeStep", "Shortage"])
    dispatched_quantity_df["shortage"] = dispatched_quantity_df["shortage"].apply(to_float)
    df = pd.concat([dispatched_quantity_df, stock_df], ignore_index=True)
    df = df.sort_values("timeStep").groupby("id").apply(lambda x: dict(zip(x["timeStep"], x["shortage"])))
    return df


def process_bottlenecks(operation_bottlenecks_file_path, compounds_df):
    operation_bottlenecks_df = pd.read_csv(operation_bottlenecks_file_path)
    # Unused input columns: SimulationRun, SimulationName
    del operation_bottlenecks_df["SimulationRun"]
    del operation_bottlenecks_df["SimulationName"]
    operation_bottlenecks_df = rename_cols_to_camel_case(operation_bottlenecks_df, ["TimeStep", "Bottleneck"])
    operation_bottlenecks_df["bottleneck"] = operation_bottlenecks_df["bottleneck"].apply(to_float)

    merged_df = pd.merge(compounds_df, operation_bottlenecks_df, left_on="child", right_on="id", how="left")
    df = merged_df.groupby(["parent", "timeStep"])["bottleneck"].sum().reset_index()
    df = df.rename(columns={"parent": "id"})
    df = df.sort_values("timeStep").groupby("id").apply(lambda x: dict(zip(x["timeStep"], x["bottleneck"])))

    return df


def load_from_results_folder(folder_path, graph_data):
    (_, _, _, _, _, _, compounds_df, _) = graph_data
    configuration_file_path = os.path.join(folder_path, "configuration.csv")
    if os.path.exists(configuration_file_path):
        configuration_df = process_configuration(configuration_file_path)

    kpis_file_path = os.path.join(folder_path, "kpis.csv")
    if os.path.exists(kpis_file_path):
        kpis_df = process_kpis(kpis_file_path)

    dispatched_quantity_measures_path = os.path.join(folder_path, "dispatchedQuantityMeasures.csv")
    stock_measures_path = os.path.join(folder_path, "stockMeasures.csv")
    if os.path.exists(dispatched_quantity_measures_path) and os.path.exists(stock_measures_path):
        shortages_df = process_shortages(dispatched_quantity_measures_path, stock_measures_path)

    bottlenecks_file_path = os.path.join(folder_path, "bottlenecks.csv")
    if os.path.exists(bottlenecks_file_path):
        bottlenecks_df = process_bottlenecks(bottlenecks_file_path, compounds_df)

    return (configuration_df, kpis_df, shortages_df, bottlenecks_df)
