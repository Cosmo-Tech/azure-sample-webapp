// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useUserAppPermissions } from '../state/hooks/AuthHooks';
import { useCurrentDataset } from '../state/hooks/DatasetHooks';
import { useCurrentScenarioData } from '../state/hooks/ScenarioHooks';

const useGetUserPermissionOnScenarioData = () =>
  useCallback((scenarioData) => scenarioData?.security?.currentUserPermissions || [], []);

export const useUserPermissionsOnCurrentScenario = () => {
  const getUserPermissionOnScenario = useGetUserPermissionOnScenarioData();
  const currentScenarioData = useCurrentScenarioData();
  return useMemo(
    () => getUserPermissionOnScenario(currentScenarioData),
    [getUserPermissionOnScenario, currentScenarioData]
  );
};

export const useGetUserAppAndScenarioPermissions = () => {
  const getUserPermissionOnScenario = useGetUserPermissionOnScenarioData();
  const userAppPermissions = useUserAppPermissions();
  return useCallback(
    (scenarioData) => {
      const userPermissionsOnScenario = getUserPermissionOnScenario(scenarioData);
      return userAppPermissions.concat(userPermissionsOnScenario);
    },
    [getUserPermissionOnScenario, userAppPermissions]
  );
};

export const useUserAppAndCurrentScenarioPermissions = () => {
  const userAppPermissions = useUserAppPermissions();
  const userPermissionsOnCurrentScenario = useUserPermissionsOnCurrentScenario();
  return useMemo(
    () => userAppPermissions.concat(userPermissionsOnCurrentScenario),
    [userAppPermissions, userPermissionsOnCurrentScenario]
  );
};

export const useHasUserPermissionOnScenario = () => {
  const getUserAppAndScenarioPermissions = useGetUserAppAndScenarioPermissions();
  return useCallback(
    (permission, scenario) => {
      const userAppAndScenarioPermissions = getUserAppAndScenarioPermissions(scenario);
      return userAppAndScenarioPermissions.includes(permission);
    },
    [getUserAppAndScenarioPermissions]
  );
};

export const useGetUserPermissionOnDataset = () =>
  useCallback((dataset) => dataset?.security?.currentUserPermissions || [], []);

export const useUserPermissionsOnCurrentDataset = () => {
  const getUserPermissionOnDataset = useGetUserPermissionOnDataset();
  const currentDataset = useCurrentDataset();
  return useMemo(() => getUserPermissionOnDataset(currentDataset), [getUserPermissionOnDataset, currentDataset]);
};
