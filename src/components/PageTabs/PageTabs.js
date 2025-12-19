// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';

export const PageTabs = (props) => {
  const { tabs = [], selectedTabIndex, setSelectedTabIndex } = props;

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'neutral.neutral06.main',
        mt: '32px',
        mb: '16px',
      }}
    >
      <Tabs
        sx={{
          '&::after': {
            position: 'relative',
            backgroundColor: '#d4d4d4',
          },
        }}
        slotProps={{
          indicator: { sx: { display: 'none' } },
        }}
        value={selectedTabIndex}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
        onChange={(event, value) => setSelectedTabIndex(value)}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            label={tab.label}
            variant="contained"
            sx={{
              textTransform: 'none',
              fontSize: '13px',
              position: 'relative',
              '&:hover': {
                backgroundColor: '#e5e5e5',
              },
              '&.Mui-selected': {
                color: 'secondary.main',
                borderRight: '1px solid #d4d4d4',
                borderLeft: '1px solid #d4d4d4',
                borderTop: '1px solid #d4d4d4',
                '&::after': {
                  position: 'absolute',
                  bottom: '-1px',
                  height: '2px',
                  backgroundColor: '#ffffff',
                  zIndex: 1,
                },
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

PageTabs.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  selectedTabIndex: PropTypes.number.isRequired,
  setSelectedTabIndex: PropTypes.func.isRequired,
};
