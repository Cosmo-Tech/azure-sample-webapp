// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import { Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import LockIcon from '@mui/icons-material/Lock';
import { ConfigUtils, TranslationUtils } from '../../../../utils';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  tabPanel: {
    maxHeight: 450,
    overflow: 'auto',
  },
  tabs: {
    margin: '8px',
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
    '&.Mui-selected': {
      fontWeight: 'bold',
    },
    '& .MuiTab-wrapper': {
      '& .MuiSvgIcon-root': {
        marginLeft: '5px',
      },
      flexDirection: 'row-reverse',
    },
  },
  placeholder: {
    margin: `0 ${theme.spacing(3)}`,
  },
}));

function _buildScenarioTabList(tabs, userRoles, classes, t) {
  const tabListComponent = [];
  for (const groupMetadata of tabs) {
    const lockedTab = !hasRequiredProfile(userRoles, groupMetadata.authorizedRoles);
    const lockIcon = lockedTab ? <LockIcon /> : undefined;
    if (!lockedTab || !ConfigUtils.getParametersGroupAttribute(groupMetadata, 'hideParameterGroupIfNoPermission')) {
      tabListComponent.push(
        <Tab
          key={groupMetadata.id}
          value={groupMetadata.id}
          data-cy={groupMetadata.id + '_tab'}
          icon={lockIcon}
          className={classes.tab}
          label={t(TranslationUtils.getParametersGroupTranslationKey(groupMetadata.id), groupMetadata.id)}
        />
      );
    }
  }
  return tabListComponent;
}

function _buildTabPanels(userRoles, tabs, classes) {
  const tabPanelComponents = [];
  for (let index = 0; index < tabs.length; index++) {
    const groupMetadata = tabs[index];
    const lockedTab = !hasRequiredProfile(userRoles, groupMetadata.authorizedRoles);
    if (!lockedTab || !ConfigUtils.getParametersGroupAttribute(groupMetadata, 'hideParameterGroupIfNoPermission')) {
      tabPanelComponents.push(
        <TabPanel index={index} key={groupMetadata.id} value={groupMetadata.id} className={classes.tabPanel}>
          {groupMetadata.tab}
        </TabPanel>
      );
    }
  }
  return tabPanelComponents;
}

const hasRequiredProfile = (userProfiles, requiredProfiles) => {
  if (!requiredProfiles) {
    return true;
  }
  if (Array.isArray(requiredProfiles) && requiredProfiles.length === 0) {
    return true;
  }
  return requiredProfiles.some((profile) => userProfiles.includes(profile));
};

function chooseParametersTab(parametersGroupsMetadata, userRoles) {
  const selectedTabId = '';
  for (const groupMetadata of parametersGroupsMetadata) {
    if (selectedTabId === '') {
      const canViewTab = hasRequiredProfile(userRoles, groupMetadata.authorizedRoles);
      if (canViewTab || !ConfigUtils.getParametersGroupAttribute(groupMetadata, 'hideParameterGroupIfNoPermission')) {
        return groupMetadata?.id;
      }
    }
  }
  return selectedTabId;
}

const ScenarioParametersTabs = ({ parametersGroupsMetadata, userRoles }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(parametersGroupsMetadata);
  const firstTab = chooseParametersTab(parametersGroupsMetadata, userRoles);
  const [selectedTab, setSelectedTab] = useState(firstTab);

  // Reset selected tab on scenario change
  useEffect(() => {
    setTabs(parametersGroupsMetadata);
    if (parametersGroupsMetadata.find((groupMetadata) => groupMetadata.id === selectedTab) === undefined) {
      setSelectedTab(firstTab);
    }
    // eslint-disable-next-line
  }, [parametersGroupsMetadata]);

  return (
    <div data-cy="scenario-parameters-tabs">
      {tabs.length === 0 ? (
        <div className={classes.placeholder} data-cy="no-parameters-placeholder">
          {t('genericcomponent.text.scenario.parameters.placeholder', 'No parameters to edit.')}
        </div>
      ) : (
        <TabContext value={selectedTab}>
          <TabList
            value={selectedTab}
            variant="scrollable"
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, newTab) => {
              setSelectedTab(newTab);
            }}
            aria-label="scenario parameters"
          >
            {_buildScenarioTabList(tabs, userRoles, classes, t)}
          </TabList>
          {_buildTabPanels(userRoles, tabs, classes)}
        </TabContext>
      )}
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
  userRoles: PropTypes.array.isRequired,
};

export default ScenarioParametersTabs;
