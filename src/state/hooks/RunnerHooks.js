// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { dispatchCreateRunner, dispatchStopRunner } from '../dispatchers/runner/RunnerDispatcher';
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

export const useStopRunner = () => {
  const organizationId = useOrganizationId();
  const workspaceId = useWorkspaceId();
  const dispatch = useDispatch();
  return useCallback(
    (datasetId) => dispatch(dispatchStopRunner(organizationId, workspaceId, datasetId)),
    [dispatch, organizationId, workspaceId]
  );
};

export const useGetAllRunners = () => {
  return useSelector((state) => state.runner.etlRunners);
};
