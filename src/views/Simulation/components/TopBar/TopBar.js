// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Stack } from '@mui/material';
import { CurrentScenarioSelector } from '../../../../components';
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
        <CurrentScenarioSelector />
      </div>
      <div style={{ flexGrow: 1 }}>
        <SearchBar />
      </div>
      <SimulationHorizon />
      <SettingsButton />
    </Stack>
  );
};

export default TopBar;
