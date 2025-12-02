// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Tabs, Tab, Box } from '@mui/material';

export const SubNavigation = (props) => {
  const { t } = useTranslation();
  const { tabs = [], selectedTabIndex, setSelectedTabIndex } = props;

  return (
    <Box>
      <Tabs
        sx={{
          pt: '16px',
          pb: '8px',
          display: 'flex',
          backgroundColor: 'background.background01.main',

          '& .MuiTabs-flexContainer': {
            justifyContent: 'flex-start',
          },
          '& .MuiTab-root:last-of-type': {
            marginLeft: 'auto',
          },
          '& .MuiTabs-scroller': {
            order: 1,
            width: 0,
            paddingRight: '16px',
          },
          '& .MuiTabs-scrollButtons': {
            order: 2,
          },
          '& .MuiTabs-scrollButtons:first-of-type': {
            ml: 0,
          },
        }}
        value={selectedTabIndex}
        variant="scrollable"
        slotProps={{ indicator: { sx: { display: 'none' } } }}
        scrollButtons
        allowScrollButtonsMobile
        onChange={(event, value) => setSelectedTabIndex(value)}
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            icon={
              <Box
                sx={{
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'secondary.main',
                  backgroundColor: 'background.background01.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tab.icon}
              </Box>
            }
            iconPosition="start"
            label={t(tab.labelKey, tab.defaultLabel)}
            variant="contained"
            sx={{
              ml: '8px',
              py: '4px',
              pl: '4px',
              minHeight: 0,
              borderRadius: '32px',
              backgroundColor: 'neutral.neutral04.main',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'background.background02.main',
                '& .MuiTab-iconWrapper': {
                  backgroundColor: 'neutral.neutral03.main',
                  color: 'neutral.neutral04.main',
                },
              },
              '&.Mui-selected': {
                backgroundColor: 'secondary.main',
                color: 'white',
                '& .MuiTab-iconWrapper': {
                  backgroundColor: 'neutral.neutral01.main',
                  color: 'neutral.neutral04.main',
                },
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

SubNavigation.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.object),
  selectedTabIndex: PropTypes.number.isRequired,
  setSelectedTabIndex: PropTypes.func.isRequired,
};
