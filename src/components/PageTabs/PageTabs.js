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
              fontSize: '13px',
              color: 'custom.disabled.main',
              '&:hover': {
                backgroundColor: 'background.background02.main',
              },
              '&.Mui-selected': {
                color: 'secondary.main',
                borderRight: 1,
                borderLeft: 1,
                borderTop: 1,
                borderColor: 'divider',
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

PageTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
    })
  ),
  selectedTabIndex: PropTypes.number.isRequired,
  setSelectedTabIndex: PropTypes.func.isRequired,
};
