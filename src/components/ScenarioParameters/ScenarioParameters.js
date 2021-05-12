// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Tab,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { TabContext, TabList, TabPanel } from '@material-ui/lab';
import { useTranslation } from 'react-i18next';
import { BasicTypes } from './index';
import EditIcon from '@material-ui/icons/Edit';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';

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
    maxHeight: 300,
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

const ScenarioParameters = ({ classes, editMode, changeEditMode, updateAndLaunchScenario, workspaceId, scenarioId }) => {
  // Translation
  const { t } = useTranslation();

  // General states
  const [value, setValue] = useState('basic_types');
  const [displayPopup, setDisplayPopup] = useState(false);

  // States for parameters
  const [textField, setTextField] = useState('Default value');
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
                          TOTO
                      </TabPanel>
                      <TabPanel value="array_template" index={0} className={classes.tabPanel}>
                          TUTU
                      </TabPanel>
                      <TabPanel value="basic_types" index={0} className={classes.tabPanel}>
                          <BasicTypes
                            changeTextField={setTextField}
                            changeNumberField={setNumberField}
                            changeEnumField={setEnumField}
                            changeSwitchType={setSwitchType}
                            editMode={editMode}
                          />
                          <Typography>{textField} | {numberField} | {enumField} | {switchType ? 'true' : 'false'}</Typography>
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
  scenarioId: PropTypes.string.isRequired
};

const EditModeButton = ({ classes, handleClickOnDiscardChange, handleClickOnUpdateAndLaunchScenario }) => {
  const { t } = useTranslation();
  return (
        <Grid container spacing={1}>
          <Grid item>
            <Button
                color="primary"
                onClick={handleClickOnDiscardChange}>
                {t('commoncomponents.button.scenario.parameters.discard', 'Discard Modifications')}
            </Button>
          </Grid>
          <Grid item>
            <Button
                startIcon={<PlayCircleOutlineIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickOnUpdateAndLaunchScenario}>
                {t('commoncomponents.button.scenario.parameters.update.launch', 'Update And Launch Scenario')}
            </Button>
          </Grid>
        </Grid>
  );
};

EditModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  handleClickOnDiscardChange: PropTypes.func.isRequired,
  handleClickOnUpdateAndLaunchScenario: PropTypes.func.isRequired
};

const NormalModeButton = ({ classes, handleClickOnEdit, handleClickOnLaunchScenario }) => {
  const { t } = useTranslation();
  return (
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Button
                startIcon={<EditIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickOnEdit}>
                {t('commoncomponents.button.scenario.parameters.edit', 'Edit')}
            </Button>
          </Grid>
          <Grid item>
            <Button
                startIcon={<PlayCircleOutlineIcon />}
                variant="contained"
                color="primary"
                onClick={handleClickOnLaunchScenario}>
                {t('commoncomponents.button.scenario.parameters.launch', 'Launch Scenario')}
            </Button>
          </Grid>
        </Grid>
  );
};

NormalModeButton.propTypes = {
  classes: PropTypes.any.isRequired,
  handleClickOnEdit: PropTypes.func.isRequired,
  handleClickOnLaunchScenario: PropTypes.func.isRequired

};

// TODO Add classes/styles props and export this into '@cosmotech/ui' npm package
const SimpleTwoActionsDialog = ({
  open,
  dialogTitleKey,
  dialogBodyKey,
  cancelLabelKey,
  handleClickOnCancel,
  validateLabelKey,
  handleClickOnValidate
}) => {
  const { t } = useTranslation();
  return (
        <Dialog open={open} aria-labelledby="discard-changes-dialog"
                maxWidth={'xs'}
                fullWidth={true}
                disableBackdropClick>
            <DialogTitle id="discard-changes-dialog-title">
                <Typography variant='h3' >
                    {t(dialogTitleKey, 'Dialog title')}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Typography variant='body1'>{t(dialogBodyKey, 'Dialog Body')}</Typography>
            </DialogContent>
            <DialogActions >
                <Button id="ButtonCancel" onClick={handleClickOnCancel} color="primary">
                    {t(cancelLabelKey, 'Cancel label')}
                </Button>
                <Button id="ButtonDiscard" onClick={handleClickOnValidate} color="primary">
                    {t(validateLabelKey, 'Validate label')}
                </Button>
            </DialogActions>
        </Dialog>
  );
};

SimpleTwoActionsDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  dialogTitleKey: PropTypes.string.isRequired,
  dialogBodyKey: PropTypes.string.isRequired,
  cancelLabelKey: PropTypes.string.isRequired,
  handleClickOnCancel: PropTypes.func.isRequired,
  validateLabelKey: PropTypes.string.isRequired,
  handleClickOnValidate: PropTypes.func.isRequired
};

export default withStyles(useStyles)(ScenarioParameters);
