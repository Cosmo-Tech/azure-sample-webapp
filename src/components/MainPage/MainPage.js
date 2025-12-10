// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import { Stack, Box } from '@mui/material';
import { SubNavigation } from '../../components/Subnavigation/SubNavigation';
import { useMainPage } from './MainPageHook';

export const MainPage = () => {
  const { tabs } = useMainPage();
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  return (
    <Stack
      direction="column"
      sx={{
        padding: 2,
        backgroundColor: (theme) => theme.palette.background.background01.main,
      }}
    >
      <SubNavigation tabs={tabs} selectedTabIndex={selectedTabIndex} setSelectedTabIndex={setSelectedTabIndex} />
      <Box sx={{ backgroundColor: (theme) => theme.palette.neutral.neutral04.main, borderRadius: 1, padding: 2 }}>
        {tabs.map((tab, index) => (
          <Box key={tab.key} sx={{ display: selectedTabIndex === index ? 'block' : 'none' }}>
            {tab.render}
          </Box>
        ))}
      </Box>
    </Stack>
  );
};
