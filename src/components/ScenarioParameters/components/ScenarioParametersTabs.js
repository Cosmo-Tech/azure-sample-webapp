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
import { TranslationUtils } from '../../../utils/TranslationUtils';

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
  parametersGroupsData,
  currentScenario
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(parametersGroupsData);
  const [selectedTab, setSelectedTab] = useState(parametersGroupsData?.[0]?.id);

  // Reset selected tab on scenario change
  useEffect(() => {
    setTabs(parametersGroupsData);
    if (parametersGroupsData.find(groupData => groupData.id === selectedTab) === undefined) {
      setSelectedTab(parametersGroupsData?.[0]?.id);
    }
    // eslint-disable-next-line
  }, [parametersGroupsData]);

  return (
    <div data-cy="scenario-parameters-tabs">
    { (tabs.length === 0
      ? <div className={classes.placeholder}>
          { t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.') }
        </div>
      : <TabContext value={selectedTab}>
          <TabList
            value={selectedTab}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
            onChange={ (event, newTab) => { setSelectedTab(newTab); } }
            aria-label="scenario parameters"
          >
            {
              tabs.map((groupData, index) => (
                <Tab
                  key={groupData.id}
                  value={groupData.id}
                  data-cy={groupData.id + '_tab'}
                  className={classes.tab}
                  label={t(TranslationUtils.getParametersGroupTranslationKey(groupData.id), groupData.id)}
                />
              ))
            }
          </TabList>
          {
            tabs.map((groupData, index) => (
              <TabPanel
                index={index}
                key={groupData.id}
                value={groupData.id}
                className={classes.tabPanel}
              >
                {groupData.tab}
              </TabPanel>
            ))
          }
        </TabContext>
      )
    }
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  parametersGroupsData: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParametersTabs;
