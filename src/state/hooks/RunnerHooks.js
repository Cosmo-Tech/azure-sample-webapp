// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { dispatchCreateRunner } from '../dispatchers/runner/RunnerDispatcher';
import { useOrganizationId } from './OrganizationHooks';
import { useWorkspaceId } from './WorkspaceHooks';

export const useCreateRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (runner) => dispatch(dispatchCreateRunner(organizationId, workspaceId, runner)),
    [dispatch, organizationId, workspaceId]
  );
};
