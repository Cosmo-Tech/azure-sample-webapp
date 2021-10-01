// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tab,
  makeStyles
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { SCENARIO_PARAMETERS_TABS_CONFIG } from '../../../config/ScenarioParameters';

const useStyles = makeStyles(theme => ({
  tabPanel: {
    maxHeight: 450,
    overflow: 'auto'
  },
  tabs: {
    margin: '8px'
  },
  tab: {
    minWidth: 0,
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0',
    lineHeight: '15px',
    textAlign: 'center',
    flexGrow: 1,
    opacity: 1,
    color: theme.palette.text.shaded,
    '&.Mui-selected': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText
    }
  },
  placeholder: {
    margin: `0 ${theme.spacing(3)}px`
  }
}));

const ScenarioParametersTabs = ({
  tabs,
  currentScenario
}) => {
  const classes = useStyles();

  // Translation
  const { t } = useTranslation();

  const [selectedTab, setSelectedTab] = useState('');
  const [visibleTabs, setVisibleTabs] = useState([]);

  const handleTabChange = (event, newTab) => {
    setSelectedTab(newTab);
  };

  // Reset selected tab on scenario change
  useEffect(() => {
    let selectedTab = '';
    const newVisibleTabs = [];
    // Filter visible tabs based on current run template
    SCENARIO_PARAMETERS_TABS_CONFIG.forEach((tab) => {
      if (tab.runTemplateIds.includes(currentScenario.data.runTemplateId)) {
        newVisibleTabs.push(tab);
        // Set selected tab if still unititialized
        if (selectedTab === '') {
          selectedTab = tab.value;
        }
      }
    });
    // Update component state
    setSelectedTab(selectedTab);
    setVisibleTabs(newVisibleTabs);
  }, [currentScenario]);

  return (
    <div data-cy="scenario-parameters-tabs">
    { visibleTabs.length === 0
      ? <div className={classes.placeholder}>
          { t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.') }
        </div>
      : <TabContext value={selectedTab}>
        <TabList
          value={selectedTab}
          variant="scrollable"
          indicatorColor="primary"
          textColor="primary"
          onChange={handleTabChange}
          aria-label="scenario parameters"
        >
          {
            visibleTabs.map((tab, index) => (
              <Tab
                key={index}
                data-cy={tab.value + '_tab'}
                className={classes.tab}
                label={t(tab.translationKey, tab.label)}
                value={tab.value}/>
            ))
          }
        </TabList>
        {
          visibleTabs.map((tab, index) => (
            <TabPanel
              key={index}
              className={classes.tabPanel}
              value={tab.value}
              index={index}
            >
              {tabs[tab.id]}
            </TabPanel>
          ))
        }
      </TabContext>
    }
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  tabs: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParametersTabs;
