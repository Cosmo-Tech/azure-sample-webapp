# -*- coding: utf-8 -*-

import sys
import argparse
from common_tools.exec import run_command
from restish import get_scenarios, delete_scenario, update_scenario


def get_scenarios_data(api_name, org_id, ws_id):
    data = get_scenarios(api_name, org_id, ws_id)
    scenarios = {}
    # Get scenarios data
    for scenario in data:
        scenarios[scenario['id']] = {
            'name': scenario['name'],
        }
        # Store parentId if available
        if 'parentId' in scenario:
            scenarios[scenario['id']]['parentId'] = scenario['parentId']
        else:
            scenarios[scenario['id']]['parentId'] = None
    return scenarios


def select_scenarios(scenarios):
    # Prepare zenity command to run
    cmd = ('zenity --list --checklist '
           '--title="Remove scenarios" '
           '--text "Pick the scenarios to remove" '
           '--column "Pick" --column "Scenario id" --column "Scenario name" '
           '--height=800 --width=600 ')
    # Add scenarios data
    for scen_id in scenarios:
        cmd += f'FALSE "{scen_id}" "{scenarios[scen_id]["name"]}" '
    # Run command to let user select scenarios to remove
    (out, err, ret_code, _) = run_command(cmd)
    if err:
        # Handle errors
        if ret_code == 127:
            print('Please install "zenity" to use this script')
            sys.exit(0)
        elif ret_code == 1:
            # User clicked on "Cancel", do nothing
            sys.exit(0)
        else:
            print(f'error code: {ret_code}')
            print(err)
            sys.exit(1)
    # Handle null selection
    if len(out) == 0:
        sys.exit(0)
    # Trim & split output to return the list of selected scenarios
    return out.strip().split('|')


def confirm_removal(scenarios, to_remove):
    # Print scenarios to delete
    print('The scenarios listed below will be DELETED:')
    for scen_id in to_remove:
        print(f' - "{scenarios[scen_id]["name"]}" ({scen_id})')
    print()
    # Ask user confirmation
    res = None
    while res not in ['y', 'n', '']:
        res = input('Do you want to delete these scenarios ? [y/N] ').lower()
    if res in ['n', '']:
        print('Aborted.')
        exit(0)


def update_scenarios_parent(scenarios, to_remove):
    to_change = []
    for scen_id in to_remove:
        new_parent_id = scenarios[scen_id]['parentId']
        for child_id in scenarios:
            if scenarios[child_id]['parentId'] == scen_id:
                scenarios[child_id]['parentId'] = new_parent_id
                if (child_id in to_remove) is False:
                    to_change.append(child_id)
    return (scenarios, to_change)


def updates_scenarios(api_name, org_id, ws_id, scenarios, to_change):
    '''
    Update the parent id for the scenarios in 'to_change' based on the new data
    in 'scenarios'.
    '''
    print('Updating scenarios...')
    # Retrieve data for the scenarios to update
    for scenario_id in to_change:
        parent_id = scenarios[scenario_id]['parentId']
        print(f'{scenario_id} has new parent {parent_id}')
        if not update_scenario(api_name, org_id, ws_id, scenario_id,
                               parent_id):
            print(f'Error when trying to update the scenario "{scenario_id}"')
            sys.exit(1)
    print('Scenarios have been updated.')


def delete_scenarios(api_name, org_id, ws_id, to_remove):
    '''
    Call the deleteScenario endpoint for each scenario to remove.
    '''
    print('Deleting scenarios...')
    # Retrieve files to delete for each scenario to remove
    for scenario_id in to_remove:
        if not delete_scenario(api_name, org_id, ws_id, scenario_id):
            print(f'Error when trying to delete the scenario "{scenario_id}"')
            sys.exit(1)
    print('Scenarios have been deleted.')


def main():
    # Declare & parse arguments
    parser = argparse.ArgumentParser(description=(
        'Display a selection list with all scenarios existing in the '
        'provided workspace, and ask user for the scenarios to delete.'))
    parser.add_argument(
        'api_name',
        help='Name of the restish api to use (e.g. "dev", "cosmo")')
    parser.add_argument('org_id', help='Organization id')
    parser.add_argument('ws_id', help='Workspace id')
    args = parser.parse_args()
    api_name = args.api_name
    org_id = args.org_id
    ws_id = args.ws_id

    # Get the list of all scenarios
    scenarios = get_scenarios_data(api_name, org_id, ws_id)
    # Let user selects the scenarios to remove
    to_remove = select_scenarios(scenarios)
    confirm_removal(scenarios, to_remove)
    # Prepare data changes
    (scenarios, to_change) = update_scenarios_parent(scenarios, to_remove)

    # Apply changes & delete data
    # TODO: Uncomment the line below when the REST API call is fixed
    # updates_scenarios(api_name, org_id, ws_id, scenarios, to_change)
    delete_scenarios(api_name, org_id, ws_id, to_remove)


if __name__ == '__main__':
    main()
