// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Stack } from '@mui/material';
import { GraphViewFilters } from './GraphViewFilters';
import { ScenarioSelector } from './ScenarioSelector';
import { SearchBar } from './SearchBar';
import { SettingsButton } from './SettingsButton';
import { SimulationHorizon } from './SimulationHorizon';

const TopBar = () => {
  return (
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
        <GraphViewFilters />
      </div>
      <SimulationHorizon />
      <SettingsButton />
    </Stack>
  );
};

export default TopBar;
