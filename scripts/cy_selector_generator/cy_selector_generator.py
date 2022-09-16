#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.

import re
import argparse


def parse_arguments():
    parser = argparse.ArgumentParser(
        description='''Parse a JS file for occurences of data-cy and generate selectors and actions functions.
        '''
    )
    parser.add_argument("input", help="Input file to parse")
    args = parser.parse_args()
    return args.input


def parse_file(file_path):
    with open(file_path) as file:
        return file.read()


def get_selectors_from_file(file_content):
    lines = file_content.split()
    lines_with_data_cy = [line for line in lines if 'data-cy=' in line]
    selectors = []
    for line in lines_with_data_cy:
        start_patterns = ['"', "'", "{`"]
        end_patterns = ['"', "'", "`}"]
        for i in range(0, len(start_patterns)):
            startPattern = "data-cy=" + start_patterns[i]
            endPattern = end_patterns[i]
            try:
                start_pos = line.index(startPattern) + len(startPattern)
                end_pos = line.index(endPattern, start_pos + 1)
            except ValueError:
                continue
            selectors.append({'value': line[start_pos:end_pos]})
            break
    return selectors


def extract_parameters_from_selector(selector):
    selector['parameters'] = re.findall(r'\$\{([^\{\}]*)\}', selector['value'])
    selector['valueWithoutParameters'] = selector['value']
    for parameter in selector['parameters']:
        pattern_to_remove = '${' + parameter + '}'
        selector['valueWithoutParameters'] = selector['valueWithoutParameters'].replace(
            pattern_to_remove, '').strip('-')


def extract_parameters_from_selectors(selectors):
    for selector in selectors:
        extract_parameters_from_selector(selector)


def kebab_to_camel_case(s, start_with_capital_letter=False):
    if len(s) == 0:
        return ''
    s = s.title().replace('-', '')
    if start_with_capital_letter:
        return s
    return s[0].lower() + s[1:]


def generate_id_constant(selector):
    selector['id_constant_pattern'] = selector['value']
    for param in selector['parameters']:
        selector['id_constant_pattern'] = selector['id_constant_pattern'].replace(
            '${' + param + '}', '$' + param.upper())
    parameters = [kebab_to_camel_case(param, True) for param in selector['parameters']]
    selector['id_constant_map_key'] = 'By'.join([kebab_to_camel_case(selector['valueWithoutParameters']), *parameters])
    selector['id_constant_map_value'] = "'[data-cy=" + selector['id_constant_pattern'] + "]'"
    selector['id_constant_map_line'] = selector['id_constant_map_key'] + ": " + selector['id_constant_map_value']


def generate_ids_constants(selectors):
    for selector in selectors:
        generate_id_constant(selector)


def display_ids_constants(selectors):
    print('\nIds constants:\n')
    print(',\n'.join([selector['id_constant_map_line'] for selector in selectors]))


def generate_action(selector):
    template = '''function $FUNCTION_NAME($PARAMETERS) {
  return cy.get(GENERIC_SELECTORS.$SELECTOR_PATH);
}'''
    selector['action_name'] = 'get' + kebab_to_camel_case(selector['valueWithoutParameters'], True)
    selector['action'] = template.replace(
        '$FUNCTION_NAME', selector['action_name']).replace(
        '$SELECTOR_PATH', selector['id_constant_map_key']).replace(
        '$PARAMETERS', ', '.join([*selector['parameters']]))


def generate_actions(selectors):
    for selector in selectors:
        generate_action(selector)


def display_actions(selectors):
    print('\n\nActions (don\'t forget to adapt the paths):\n')
    print('\n'.join([selector['action'] for selector in selectors]))


def display_actions_exports(selectors):
    print('\n\nExports for actions:\n')
    print(',\n'.join([selector['action_name'] for selector in selectors]))


def main():
    input = parse_arguments()
    file_content = parse_file(input)
    selectors = get_selectors_from_file(file_content)
    extract_parameters_from_selectors(selectors)
    generate_ids_constants(selectors)
    generate_actions(selectors)

    display_ids_constants(selectors)
    display_actions(selectors)
    display_actions_exports(selectors)


if __name__ == "__main__":
    main()
