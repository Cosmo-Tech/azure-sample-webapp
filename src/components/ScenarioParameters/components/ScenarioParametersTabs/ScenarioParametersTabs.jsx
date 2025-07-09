// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import LockIcon from '@mui/icons-material/Lock';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Badge, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { ConfigUtils, ScenarioParametersUtils, TranslationUtils } from '../../../../utils';

const useStyles = makeStyles((theme) => ({
  tabPanel: {
    maxHeight: 450,
    overflow: 'auto',
  },
  placeholder: {
    margin: `0 ${theme.spacing(3)}`,
  },
}));

function _buildScenarioTabList(tabs, userRoles, t, errors) {
  const tabListComponent = [];
  const errorsByTab = ScenarioParametersUtils.getErrorsCountByTab(tabs, errors);
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
          label={
            <Badge data-cy="error-badge" badgeContent={errorsByTab[groupMetadata.id]} color="error">
              {t(TranslationUtils.getParametersGroupTranslationKey(groupMetadata.id), groupMetadata.id)}
            </Badge>
          }
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
  const { errors } = useFormState();

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
            {_buildScenarioTabList(tabs, userRoles, t, errors)}
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
