// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Tab,
  Typography
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { BasicTypes, EditModeButton, NormalModeButton } from './components';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';

const useStyles = theme => ({
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
  },
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

const ScenarioParameters = ({
  classes,
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  workspaceId,
  currentScenario,
  scenarioId
}) => {
  // Translation
  const { t } = useTranslation();

  // General states
  const [value, setValue] = useState('basic_types');
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);

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
                                               handleClickOnLaunchScenario={handleClickOnLaunchScenarioButton}/>)
                      }
                  </Grid>
              </Grid>
          </Grid>
          <Grid item className={classes.tabs}>
              <form>
                  <TabContext value={value}>
                      <TabList
                          value={value}
                          indicatorColor="primary"
                          textColor="primary"
                          onChange={handleChange}
                          aria-label="scenario parameters">
                          <Tab label={t('commoncomponents.tab.scenario.parameters.upload.file', 'Upload File template')} value="upload_file_template" className={classes.tab}/>
                          <Tab label={t('commoncomponents.tab.scenario.parameters.array.template', 'Array Template')} value="array_template" className={classes.tab}/>
                          <Tab label={t('commoncomponents.tab.scenario.parameters.basic.types', 'Basic Types template')} value="basic_types" className={classes.tab}/>
                      </TabList>
                      <TabPanel value="upload_file_template" index={0} className={classes.tabPanel}>
                        EMPTY
                      </TabPanel>
                      <TabPanel value="array_template" index={0} className={classes.tabPanel}>
                        EMPTY
                      </TabPanel>
                      <TabPanel value="basic_types" index={0} className={classes.tabPanel}>
                          <BasicTypes
                            initTextFieldValue={textField}
                            changeTextField={setTextField}
                            changeNumberField={setNumberField}
                            changeEnumField={setEnumField}
                            changeSwitchType={setSwitchType}
                            editMode={editMode}
                          />
                      </TabPanel>
                  </TabContext>
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
  classes: PropTypes.any,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default withStyles(useStyles)(ScenarioParameters);
