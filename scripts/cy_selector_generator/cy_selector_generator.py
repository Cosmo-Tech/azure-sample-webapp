#!/usr/bin/env python3
# -*- coding:utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


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
        start_pos = line.index("data-cy=\"") + len("data-cy=\"")
        end_pos = line.index("\"", start_pos + 1)
        selectors.append(line[start_pos:end_pos])
    return selectors


def kebab_to_camel_case(s, start_with_capital_letter=False):
    if len(s) == 0:
        return ''
    s = s.title().replace('-', '')
    if start_with_capital_letter:
        return s
    return s[0].lower() + s[1:]


def generate_id_constant(selector):
    camel_case_selector = kebab_to_camel_case(selector)
    return camel_case_selector + ": '[data-cy=" + selector + "]'"


def generate_ids_constants(selectors):
    return [generate_id_constant(selector) for selector in selectors]


def display_ids_constants(ids_constants):
    print('\nIds constants:\n')
    print(',\n'.join(ids_constants))


def generate_action(selector):
    template = '''function $FUNCTION_NAME() {
  return cy.get(GENERIC_SELECTORS.$SELECTOR_PATH);
}'''
    function_name = 'get' + kebab_to_camel_case(selector, True)
    return template.replace('$FUNCTION_NAME', function_name).replace('$SELECTOR_PATH', kebab_to_camel_case(selector))


def generate_actions(selectors):
    return [generate_action(selector) for selector in selectors]


def display_actions(actions):
    print('\n\nActions (don\'t forget to adapt the paths):\n')
    print('\n'.join(actions))


def main():
    input = parse_arguments()
    file_content = parse_file(input)
    selectors = get_selectors_from_file(file_content)
    ids_constants = generate_ids_constants(selectors)
    actions = generate_actions(selectors)

    display_ids_constants(ids_constants)
    display_actions(actions)


if __name__ == "__main__":
    main()
