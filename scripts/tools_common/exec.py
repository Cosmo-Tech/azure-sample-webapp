#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


import shlex
import subprocess
import time


def run_command(command, cwd=None, stdout=subprocess.PIPE,
                stderr=subprocess.PIPE):
    """
    Run a command and return its standard output, error output, return code and
    execution time.
    :param command: Command to run
    :param cwd: Working directory to run the command
    :param stdout: Standard output (valid values are subprocess.PIPE,
    subprocess.DEVNULL, file descriptors or file objects, see subprocess
    documentation for more information)
    :param stderr: Standard error (valid values are subprocess.PIPE,
    subprocess.DEVNULL, file descriptors or file objects, see subprocess
    documentation for more information)
    """
    # Measure time & run
    start = time.time()
    p = subprocess.Popen(shlex.split(command), stdout=stdout, stderr=stderr, cwd=cwd)
    out, err = p.communicate()
    duration = time.time() - start
    ret_code = p.returncode
    # Process output
    out = out.decode('utf-8') if out else out
    err = err.decode('utf-8') if err else err
    return out, err, ret_code, duration


def has_command(command, cwd=None):
    """
    Check if a program exists to run the provided command. This is done by checking the return value of the 'which'
    command.
    :param command: Command to run
    :param cwd: Working directory to run the command
    """
    which_cmd = f"which {shlex.quote(command)}"
    p = subprocess.Popen(shlex.split(which_cmd), stdout=subprocess.PIPE, stderr=subprocess.PIPE, cwd=cwd)
    out, err = p.communicate()
    if p.returncode == 1:
        return False
    return True
