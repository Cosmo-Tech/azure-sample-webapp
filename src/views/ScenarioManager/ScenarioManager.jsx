// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { LoadingBackdrop } from '../../components';
import { useScenarioManager } from './ScenarioManagerHook';
import { ScenarioManagerTable } from './components';

const ScenarioManager = () => {
  const { runnersListStatus } = useScenarioManager();

  return (
    <div style={{ position: 'fixed', margin: 'auto', height: '100%', width: '100%' }} data-cy="scenario-manager-view">
      <LoadingBackdrop status={runnersListStatus} />
      <ScenarioManagerTable />
    </div>
  );
};

export default ScenarioManager;
