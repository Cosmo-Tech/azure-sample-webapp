// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useFormState } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import LockIcon from '@mui/icons-material/Lock';
import { TabList } from '@mui/lab';
import { Badge, Tab } from '@mui/material';
import { ConfigUtils, ScenarioParametersUtils, TranslationUtils } from '../../../../utils';

export const hasRequiredProfile = (userProfiles, requiredProfiles) => {
  if (!requiredProfiles) return true;
  if (Array.isArray(requiredProfiles) && requiredProfiles.length === 0) return true;
  return requiredProfiles.some((profile) => userProfiles.includes(profile));
};

const _buildScenarioTabList = (tabs, userRoles, t, errors) => {
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
};

export const ScenarioParametersTabList = ({ tabs, userRoles, selectedTab, onTabChange }) => {
  const { t } = useTranslation();
  const { errors } = useFormState();

  return (
    <TabList
      value={selectedTab}
      variant="scrollable"
      indicatorColor="primary"
      textColor="primary"
      onChange={onTabChange}
      aria-label="scenario parameters"
    >
      {_buildScenarioTabList(tabs, userRoles, t, errors)}
    </TabList>
  );
};

ScenarioParametersTabList.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  userRoles: PropTypes.array.isRequired,
};
