// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Tab } from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { TranslationUtils } from '../../../utils/TranslationUtils';
import LockIcon from '@material-ui/icons/Lock';

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
    color: theme.palette.text.shaded,
    '&.Mui-selected': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText,
    },
  },
  placeholder: {
    margin: `0 ${theme.spacing(3)}px`,
  },
}));

const RegularTab = ({ t, key, groupMetadataId, className }) => {
  return (
    <Tab
      key={key}
      value={groupMetadataId}
      data-cy={groupMetadataId + '_tab'}
      className={className}
      label={t(TranslationUtils.getParametersGroupTranslationKey(groupMetadataId), groupMetadataId)}
    />
  );
};

RegularTab.propTypes = {
  t: PropTypes.func.isRequired,
  key: PropTypes.string.isRequired,
  groupMetadataId: PropTypes.string.isRequired,
  className: PropTypes.object.isRequired,
};

const ScenarioParametersTabs = ({ parametersGroupsMetadata }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const [tabs, setTabs] = useState(parametersGroupsMetadata);
  const [selectedTab, setSelectedTab] = useState(parametersGroupsMetadata?.[0]?.id);

  // Reset selected tab on scenario change
  useEffect(() => {
    setTabs(parametersGroupsMetadata);
    if (parametersGroupsMetadata.find((groupMetadata) => groupMetadata.id === selectedTab) === undefined) {
      setSelectedTab(parametersGroupsMetadata?.[0]?.id);
    }
    // eslint-disable-next-line
  }, [parametersGroupsMetadata]);

  return (
    <div data-cy="scenario-parameters-tabs">
      {tabs.length === 0 ? (
        <div className={classes.placeholder}>
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
            {tabs.map((groupMetadata, index) => (
              <Tab
                icon={<LockIcon />}
                key={groupMetadata.id}
                value={groupMetadata.id}
                data-cy={groupMetadata.id + '_tab'}
                className={classes.tab}
                label={t(TranslationUtils.getParametersGroupTranslationKey(groupMetadata.id), groupMetadata.id)}
              />
            ))}
          </TabList>
          {tabs.map((groupMetadata, index) => (
            <TabPanel index={index} key={groupMetadata.id} value={groupMetadata.id} className={classes.tabPanel}>
              {groupMetadata.tab}
            </TabPanel>
          ))}
        </TabContext>
      )}
    </div>
  );
};

ScenarioParametersTabs.propTypes = {
  parametersGroupsMetadata: PropTypes.array.isRequired,
};

export default ScenarioParametersTabs;
