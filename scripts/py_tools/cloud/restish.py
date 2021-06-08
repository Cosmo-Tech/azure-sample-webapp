# -*- coding: utf-8 -*-
import json
from common_tools.exec import has_command, run_command


def check_dependencies():
    '''
    Dependencies to check:
      - restish
    '''
    return has_command('restish')


def get_scenarios(api_name, org_id, ws_id):
    '''
    Get the list of all scenarios in the provided workspace.
    '''
    # Forge command line to run
    cmd = f'restish {api_name} find-all-scenarios {org_id} {ws_id} -o json'
    # Run restish command
    (out, err, ret_code, _) = run_command(cmd)
    # Handle errors
    if err:
        print(f'restish command failed with return code {ret_code}')
        print(f'Error:\n{err}')
        print(f'Output:\n{out}')
        return None
    # If there were no errors, parse the list of scenarios received
    data = json.loads(out)
    scenarios = data['body']
    return scenarios


def delete_scenario(api_name, org_id, ws_id, scenario_id):
    '''
    Delete the provided scenario.
    Returns True if the scenario has been successfully deleted, or False
    otherwise.
    '''
    # Forge command line to run
    cmd = (f'restish {api_name} delete-scenario {org_id} {ws_id} '
           f'{scenario_id} -o json')
    # Run restish command
    (out, err, ret_code, _) = run_command(cmd)
    # Handle errors
    if err:
        print(f'restish command failed with return code {ret_code}')
        print(f'Error:\n{err}')
        print(f'Output:\n{out}')
        return False
    # If there were no errors, confirm scenario removal
    return True


def update_scenario(api_name, org_id, ws_id, scenario_id, parent_id):
    '''
    Update the parent id of the provided scenario.
    Returns True if the scenario has been successfully updated, or False
    otherwise.
    '''
    # Forge command line to run
    cmd = (f'restish {api_name} delete-scenario {org_id} {ws_id} '
           f'{scenario_id} -o json')
    # Run restish command
    (out, err, ret_code, _) = run_command(cmd)
    # Handle errors
    if err:
        print(f'restish command failed with return code {ret_code}')
        print(f'Error:\n{err}')
        print(f'Output:\n{out}')
        return False
    # If there were no errors, confirm scenario removal
    return True
