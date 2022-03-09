# Copyright (c) Cosmo Tech corporation.
# Licensed under the MIT license.
from CosmoTech_Acceleration_Library.Accelerators.scenario_download.azure_function_main import generate_main


def apply_update(content: dict, scenario_data: dict) -> dict:
    """
    Sample update that look for each ADT datasets and count the number of entities/relation of a given type
    :param content: Contains all datasets and parameters downloaded from the API
    :param scenario_data: The data associated to your scenario downloaded from the API
    :return: dict (str -> int) containing the number of entities/relations for each type in all ADT datasets
    """
    ret = dict()
    for dataset in content['datasets'].values():
        if dataset['type'] is not "adt":
            continue
        data = dataset['content']
        for item_type, list_items in data.items():
            ret.setdefault(item_type, 0)
            ret[item_type] += len(list_items)

    return ret


main = generate_main(apply_update=apply_update)
