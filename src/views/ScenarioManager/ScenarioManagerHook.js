// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useRunnersListStatus } from '../../state/runner/hooks';

export const useScenarioManager = () => {
  const runnersListStatus = useRunnersListStatus();
  return { runnersListStatus };
};
