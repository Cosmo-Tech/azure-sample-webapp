#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import shlex
import subprocess
import time


def has_command(name):
    """
    Check whether the provided command is available or not.
    """
    from shutil import which
    return which(name) is not None


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
    p = subprocess.Popen(
        shlex.split(command), stdout=stdout, stderr=stderr, cwd=cwd)
    out, err = p.communicate()
    duration = time.time() - start
    ret_code = p.returncode
    # Process output
    out = out.decode('utf-8') if out else out
    err = err.decode('utf-8') if err else err
    return out, err, ret_code, duration
