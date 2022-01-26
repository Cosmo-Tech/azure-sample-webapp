#!/usr/bin/env python3
# -*- coding: utf-8 -*-

# Copyright (c) Cosmo Tech.
# Licensed under the MIT license.


from tools_common.exec import run_command


def check_head():
    """
    Check if current position is HEAD.
    """
    out, err, ret_code, _ = run_command("git diff-index HEAD --")
    if len(out) > 0:
        print(out)
    if len(err) > 0:
        print(err)
    if ret_code != 0 or len(out) > 0 or len(err) > 0:
        print('Please checkout HEAD of main branch')
        return False
    return True


def check_branch_is_main():
    """
    Check that current branch is main
    """
    out, err, ret_code, _ = run_command("git rev-parse --abbrev-ref HEAD")
    out = out.strip()
    if ret_code != 0 or len(err) > 0:
        print(err)
        return False
    if out != 'main':
        print('Please checkout main branch')
        return False
    return True


def check_tag_exists(tag):
    """
    Check if a tag exists.
    :param tag: Name of the tag to look for.
    """
    cmd = f"git show-ref --tags {tag} --quiet"
    out, err, ret_code, _ = run_command(cmd)
    return ret_code == 0


def pull():
    """
    Perform a git pull on current branch
    """
    _, err, ret_code, _ = run_command("git pull -q")
    if len(err) > 0:
        print(err)
    return ret_code == 0


def switch(branch):
    """
    Perform a git checkout to the provided  branch
    """
    _, err, ret_code, _ = run_command(f"git checkout {branch}")
    if len(err) > 0:
        print(err)
    return ret_code == 0


def create_tag(tag):
    """
    Create a new tag
    :param tag: Name of the tag to create.
    """
    _, err, ret_code, _ = run_command(f"git tag {tag}")
    if len(err) > 0:
        print(err)
    return ret_code == 0


def create_branch(branch):
    """
    Create a new branch
    :param branch: Name of the branch to create.
    """
    _, err, ret_code, _ = run_command(f"git checkout -b {branch}")
    if len(err) > 0:
        print(err)
    return ret_code == 0


def get_top_level_folder():
    """
    Return the path to the repository top level directory.
    """
    out, _, ret_code, _ = run_command("git rev-parse --show-toplevel")
    if ret_code != 0:
        raise Exception
    return out.rstrip()


def commit_all_changes(commit_msg):
    """
    Commit all local modifications in a single commit with the provided message.
    :param commit_msg: Commit message.
    """
    _, err, ret_code, _ = run_command(f"git commit -a -m'{commit_msg}'")
    if len(err) > 0:
        print(err)
    return ret_code == 0
