// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Tab
} from '@material-ui/core';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import { BasicTypes } from '../components';
import { SCENARIO_PARAMETERS_TABS_CONFIG } from '../../../configs/ScenarioParametersTabs.config';

const useStyles = theme => ({
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
    color: theme.palette.text.grey,
    '&.Mui-selected': {
      fontWeight: 'bold',
      color: theme.palette.primary.contrastText
    }
  }
});

const ScenarioParametersTabs = ({
  currentScenario,
  classes,
  initTextFieldValue,
  changeTextField,
  changeNumberField,
  changeEnumField,
  changeSwitchType,
  editMode
}) => {
  const [value, setValue] = useState('basic_types');

  const SCENARIO_PARAMETERS = [
    <Typography key="0">Empty</Typography>,
    <Typography key="1">Empty</Typography>,
    <BasicTypes key="2"
      initTextFieldValue={initTextFieldValue}
      changeTextField={changeTextField}
      changeNumberField={changeNumberField}
      changeEnumField={changeEnumField}
      changeSwitchType={changeSwitchType}
      editMode={editMode}
    />
  ];

  // Translation
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Create tabs lists
  const renderedTabs = [];
  const renderedTabsList = [];
  let index = 0;
  for (const tab of SCENARIO_PARAMETERS_TABS_CONFIG) {
    if (tab.runTemplateIds.includes(currentScenario.data.runTemplateId)) {
      renderedTabs.push((<Tab key={index} label={t(tab.translationKey, tab.label)} value={tab.value} className={classes.tab}/>));
      renderedTabsList.push((
        <TabPanel key={index} value={tab.value} index={index} className={classes.tabPanel}>
          {SCENARIO_PARAMETERS[tab.id]}
        </TabPanel>
      ));
    }
    index++;
  }

  return (
    <TabContext value={value}>
      <TabList
        value={value}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleChange}
        aria-label="scenario parameters"
      >
        { renderedTabs }
      </TabList>
      { renderedTabsList }
    </TabContext>
  );
};

ScenarioParametersTabs.propTypes = {
  classes: PropTypes.any,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired,
  initTextFieldValue: PropTypes.string.isRequired,
  changeTextField: PropTypes.func.isRequired,
  changeNumberField: PropTypes.func.isRequired,
  changeEnumField: PropTypes.func.isRequired,
  changeSwitchType: PropTypes.func.isRequired,
  editMode: PropTypes.bool.isRequired
};

export default withStyles(useStyles)(ScenarioParametersTabs);
