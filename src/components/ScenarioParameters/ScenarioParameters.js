// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { SCENARIO_RUN_STATE } from '../../utils/ApiUtils';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { BasicTypes } from './components/tabs';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`
  }
}));

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  workspaceId,
  currentScenario,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  // General states
  const [displayPopup, setDisplayPopup] = useState(false);

  // Current scenario parameters
  const parameters = currentScenario.data.parametersValues;
  const getValueFromParameters = (parameterId, defaultValue) => {
    if (parameters === null) {
      return defaultValue;
    }
    const param = parameters.find(element => element.id === parameterId);
    if (param !== undefined) {
      return param.value;
    }
    return defaultValue;
  };

  // State for bar parameters
  // const [stock, setStock] = useState(
  //   getValueFromParameters('stock', 100));
  // const [restockQuantity, setRestockQuantity] = useState(
  //   getValueFromParameters('restock_qty', 25));
  // const [waitersNumber, setWaitersNumber] = useState(
  //   getValueFromParameters('nb_waiters', 5));
  // State for basic input types examples parameters
  const [currency, setCurrency] = useState(
    getValueFromParameters('currency', '€'));
  const [currencyName, setCurrencyName] = useState(
    getValueFromParameters('currency_name', 'EUR'));
  const [currencyValue, setCurrencyValue] = useState(
    getValueFromParameters('currency_value', 1000));
  const [currencyUsed, setCurrencyUsed] = useState(
    getValueFromParameters('currency_used', false));
  const [startDate, setStartDate] = useState(
    getValueFromParameters('start_date', new Date('2014-08-18T21:11:54')));

  const resetParameters = () => {
    // setStock(getValueFromParameters('stock', 100));
    // setRestockQuantity(getValueFromParameters('restock_qty', 25));
    // setWaitersNumber(getValueFromParameters('nb_waiters', 5));
    setCurrency(getValueFromParameters('currency', '€'));
    setCurrencyName(getValueFromParameters('currency_name', 'EUR'));
    setCurrencyValue(getValueFromParameters('currency_value', 1000));
    setCurrencyUsed(getValueFromParameters('currency_used', false));
    setStartDate(getValueFromParameters(
      'start_date', new Date('2014-08-18T21:11:54')));
  };

  // Update the parameters form when scenario parameters change
  useEffect(() => {
    resetParameters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters]);

  // Popup part
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    resetParameters();
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => (
    currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING);

  // TODO: Launch scenario
  const handleClickOnLaunchScenarioButton = () => alert('TODO');

  // Edit Mode Screen
  const handleClickOnUpdateAndLaunchScenarioButton = () => {
    const parametersData = [
      {
        parameterId: 'currency',
        varType: 'string',
        value: currency,
        isInherited: 'true'
      },
      {
        parameterId: 'currency name',
        varType: 'string',
        value: currencyName,
        isInherited: 'true'
      },
      {
        parameterId: 'currency value',
        varType: 'string',
        value: currencyValue,
        isInherited: 'true'
      },
      {
        parameterId: 'currency used',
        varType: 'bool',
        value: currencyUsed,
        isInherited: 'true'
      },
      {
        parameterId: 'Date',
        varType: 'string',
        value: '' + startDate,
        isInherited: 'true'
      }
    ];

    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
    changeEditMode(false);
  };

  // Indices in this array must match indices in the tabs configuration file
  // configs/ScenarioParametersTabs.config.js
  const scenarioParametersTabs = [
    <Typography key="0">Empty</Typography>,
    <Typography key="1">Empty</Typography>,
    <BasicTypes key="2"
      initTextFieldValue={currencyName}
      changeTextField={setCurrencyName}
      changeNumberField={setCurrencyValue}
      changeEnumField={setCurrency}
      changeSwitchType={setCurrencyUsed}
      changeSelectedDate={setStartDate}
      selectedDate={startDate}
      editMode={editMode}
    />
  ];

  return (
      <div>
        <Grid container direction="column" justify="center" alignContent="flex-start" >
          <Grid container className={classes.root} direction="row" justify="space-between" alignContent="flex-start" spacing={5}>
            <Grid item >
              <Typography variant='subtitle1'>
                { t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters') }

              </Typography>
            </Grid>
            <Grid item >
              { editMode
                ? (<EditModeButton classes={classes}
                  handleClickOnDiscardChange={handleClickOnDiscardChangeButton}
                  handleClickOnUpdateAndLaunchScenario={handleClickOnUpdateAndLaunchScenarioButton}/>)
                : (<NormalModeButton classes={classes}
                  handleClickOnEdit={handleClickOnEditButton}
                  handleClickOnLaunchScenario={handleClickOnLaunchScenarioButton}
                  editDisabled={isCurrentScenarioRunning()}
                  runDisabled={isCurrentScenarioRunning()}/>)
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tabs}>
          {
            <form>
              <ScenarioParametersTabs
                tabs={scenarioParametersTabs}
                currentScenario={currentScenario}
              />
            </form>
          }
        </Grid>
        <SimpleTwoActionsDialog
            open={displayPopup}
            dialogTitleKey='genericcomponent.dialog.scenario.parameters.title'
            dialogBodyKey='genericcomponent.dialog.scenario.parameters.body'
            cancelLabelKey='genericcomponent.dialog.scenario.parameters.button.cancel'
            validateLabelKey='genericcomponent.dialog.scenario.parameters.button.validate'
            handleClickOnCancel={handleClickOnPopupCancelButton}
            handleClickOnValidate={handleClickOnPopupDiscardChangeButton}/>
      </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
