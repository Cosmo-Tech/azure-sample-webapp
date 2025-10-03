// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useMemo } from 'react';
import { Stack } from '@mui/material';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { SIMULATION_MODES } from '../../constants/settings';
import { GraphViewFilters } from './GraphViewFilters';
import { MapEntitiesDropdown } from './MapEntities';
import { ScenarioSelector } from './ScenarioSelector';
import { SearchBar } from './SearchBar';
import { SettingsButton } from './SettingsButton';
import { SimulationHorizon } from './SimulationHorizon';

const TopBar = () => {
  const { viewMode } = useSimulationViewContext();

  const topBarContent = useMemo(
    () => (
      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: 'space-between',
          alignItems: 'stretch',
          height: '72px',
          m: 2,
        }}
      >
        <div style={{ flexGrow: 1 }}>
          <ScenarioSelector />
        </div>
        <div style={{ flexGrow: 1 }}>
          <SearchBar />
        </div>
        <div style={{ flexGrow: 1 }}>
          {viewMode === SIMULATION_MODES.GRAPH ? <GraphViewFilters /> : <MapEntitiesDropdown />}
        </div>
        <SimulationHorizon />
        <SettingsButton />
      </Stack>
    ),
    [viewMode]
  );

  return topBarContent;
};

export default TopBar;
