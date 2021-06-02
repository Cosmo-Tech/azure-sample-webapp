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
import { SimpleTwoActionsDialog } from '@cosmotech/ui';

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
  // General states
  const [displayPopup, setDisplayPopup] = useState(false);

  // TODO: For now, backend is replaced with a mock server. It has limitations,
  // and it returns a string at the very first index. Therefore 0 is hardcoded
  // here, but this should be updated once a real connection with the backend is
  // established. A tag should be used here instead of the index.
  const getTextParameter = (params) => params[0].value;
  // TODO: use actual scenario parameters
  const getNumberParameter = (params) => '1000';
  const getEnumParameter = (params) => 'EUR';
  const getBoolParameter = (params) => false;
  const getSelectedDate = (params) => new Date('2014-08-18T21:11:54');

  // States for parameters
  const parameters = currentScenario.data.parametersValues;
  const [textField, setTextField] = useState(getTextParameter(parameters));

  // Update the parameters form when scenario paramaters change
  useEffect(() => {
    setTextField(getTextParameter(parameters));
  }, [parameters]);

  const [numberField, setNumberField] = useState('1000');
  const [enumField, setEnumField] = useState('EUR');
  const [switchType, setSwitchType] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date('2021-08-18T21:11:54'));

  // Popup part
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);

  // TODO: Discard changes
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    setTextField(getTextParameter(parameters));
    setNumberField(getNumberParameter(parameters));
    setEnumField(getEnumParameter(parameters));
    setSwitchType(getBoolParameter(parameters));
    setSelectedDate(getSelectedDate(parameters));
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING;

  // TODO: Launch scenario
  const handleClickOnLaunchScenarioButton = () => alert('TODO');

  // Edit Mode Screen
  // TODO: Update parameters and Launch scenario
  const handleClickOnUpdateAndLaunchScenarioButton = () => {
    const parametersData = [
      {
        parameterId: 'currency',
        varType: 'string',
        value: enumField,
        isInherited: 'true'
      },
      {
        parameterId: 'currency name',
        varType: 'string',
        value: textField,
        isInherited: 'true'
      },
      {
        parameterId: 'currency value',
        varType: 'string',
        value: numberField,
        isInherited: 'true'
      },
      {
        parameterId: 'currency used',
        varType: 'bool',
        value: switchType,
        isInherited: 'true'
      },
      {
        parameterId: 'Date',
        varType: 'string',
        value: '' + selectedDate,
        isInherited: 'true'
      }
    ];

    // See https://github.com/jreynard-code/cosmotech-api-javascript-client/blob/master/docs/ScenarioApi.md#addorreplacescenarioparametervalues
    updateAndLaunchScenario(workspaceId, scenarioId, parametersData);

    changeEditMode(false);
  };

  // Open the popup
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);

  return (
      <div>
        <Grid container direction="column" justify="center" alignContent="flex-start" >
          <Grid container className={classes.root} direction="row" justify="space-between" alignContent="flex-start" spacing={5}>
            <Grid item >
              <Typography variant='subtitle1' >Scenario parameters</Typography>
            </Grid>
            <Grid item >
              {editMode
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
          <form>
            <ScenarioParametersTabs
              currentScenario={currentScenario}
              classes={classes}
              initTextFieldValue={textField}
              changeTextField={setTextField}
              changeNumberField={setNumberField}
              changeEnumField={setEnumField}
              changeSwitchType={setSwitchType}
              changeSelectedDate={setSelectedDate}
              editMode={editMode}
            />
          </form>
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
