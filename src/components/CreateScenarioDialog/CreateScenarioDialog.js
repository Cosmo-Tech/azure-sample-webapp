// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';
import {
  CREATE_SCENARIO_DIALOG_CANCEL_LABEL_KEY, CREATE_SCENARIO_DIALOG_CREATE_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_DATASET_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_DATASET_PLACEHOLDER_KEY,
  CREATE_SCENARIO_DIALOG_PARENT_SCENARIO_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_SCENARIO_MASTER_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_SCENARIO_NAME_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_SCENARIO_TYPE_LABEL_KEY,
  CREATE_SCENARIO_DIALOG_SCENARIO_TYPE_PLACEHOLDER_KEY,
  CREATE_SCENARIO_DIALOG_TITLE_LABEL_KEY,
  ERROR_SCENARIO_NAME_EMPTY_LABEL_KEY,
  ERROR_SCENARIO_NAME_EXISTING_LABEL_KEY
} from './CreateScenarioDialogButtonConstants';
import { ScenarioUtils } from '@cosmotech/core';
import {
  Button,
  Checkbox,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HierarchicalComboBox from '../HierarchicalComboBox/HierarchicalComboBox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialogContent: {
    marginTop: '16px'
  },
  dialogActions: {
    marginRight: '4px',
    marginBottom: '4px'
  }
});

const isDialogDataValid = (scenarioName, isMaster, scenarioType, parentScenario, dataset) => {
  const validScenarioName = scenarioName.value.length !== 0 && !scenarioName.hasError;
  const validScenarioType = Object.keys(scenarioType).length !== 0;
  const validParentScenario = Object.keys(parentScenario).length !== 0;
  const validDataset = Object.keys(dataset).length !== 0;
  let isValid;
  if (isMaster) {
    isValid = validScenarioName && validDataset && validScenarioType;
  } else {
    isValid = validScenarioName && validParentScenario && validScenarioType;
  }
  return isValid;
};

const CreateScenarioDialog = ({
  classes,
  open,
  closeDialog,
  scenarios,
  currentScenario,
  datasets,
  runTemplates
}) => {
  const { t } = useTranslation();

  const scenarioNameInitialState = {
    value: '',
    hasError: false,
    errorKey: ''
  };

  const [scenarioNameFieldValues, setScenarioNameFieldValues] = useState(scenarioNameInitialState);
  const [isMaster, setMaster] = useState(false);
  const [datasetFieldValues, setDatasetFieldValues] = useState({});
  const [parentScenarioFieldValues, setParentScenarioFieldValues] = useState({});
  const [scenarioTypeFieldValues, setScenarioTypeFieldValues] = useState({});

  const handleChangeScenarioName = (event) => {
    const newScenarioName = event.target.value;
    let errorKey = '';
    let hasErrors = false;
    if (newScenarioName.length === 0) {
      errorKey = ERROR_SCENARIO_NAME_EMPTY_LABEL_KEY;
      hasErrors = true;
    }
    if (ScenarioUtils.isScenarioExist(scenarios, newScenarioName)) {
      errorKey = ERROR_SCENARIO_NAME_EXISTING_LABEL_KEY;
      hasErrors = true;
    }
    setScenarioNameFieldValues({
      ...scenarioNameFieldValues,
      value: newScenarioName,
      errorKey: errorKey,
      hasError: hasErrors
    });
  };

  /*   const handleCreateScenario = () => {
   let formData;
    if (isMaster) {
      formData = {
        name: scenarioNameFieldValues.value,
        description: scenarioNameFieldValues.value,
        parentId: parentScenarioFieldValues.id,
        ownerId: 'testId'

      };
    } else {

    }

    closeDialog();
  }; */

  const handleChangeScenarioMaster = (event) => {
    const isMaster = event.target.checked;
    if (isMaster) {
      setParentScenarioFieldValues({});
    } else {
      setDatasetFieldValues({});
    }
    setMaster(isMaster);
  };

  const handleChangeDataset = (newDataset) => setDatasetFieldValues(newDataset);

  const handleChangeParentScenario = (newParentScenario) => setParentScenarioFieldValues(newParentScenario);

  const handleScenarioTypeChange = (newScenarioType) => setScenarioTypeFieldValues(newScenarioType);

  let createScenarioDisabled = true;
  if (isDialogDataValid(scenarioNameFieldValues,
    isMaster,
    scenarioTypeFieldValues,
    parentScenarioFieldValues,
    datasetFieldValues)) {
    createScenarioDisabled = false;
  }

  const currentScenarioSelected = currentScenario.data !== null;
  const selectedParentType = currentScenario.data === null ? '' : currentScenario.data.name;

  const resetState = () => {
    console.log('resetState');
    setScenarioTypeFieldValues({});
    setParentScenarioFieldValues({});
    setDatasetFieldValues({});
    setMaster(false);
    setScenarioNameFieldValues(scenarioNameInitialState);
  };

  const handleCloseDialog = () => {
    console.log('handleCloseDialog');
    resetState();
    closeDialog();
  };

  return (
        <Dialog open={open}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
                maxWidth={'sm'}
                fullWidth={true}
                disableBackdropClick >
                <DialogTitle id="form-dialog-title" className={classes.dialogContent} >
                    <Typography variant='h3'>
                        {t(CREATE_SCENARIO_DIALOG_TITLE_LABEL_KEY, 'Create alternative scenario')}
                    </Typography>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField onChange={handleChangeScenarioName}
                                       onBlur = {handleChangeScenarioName}
                                       autoFocus
                                       id="scenarioName"
                                       value={scenarioNameFieldValues.value}
                                       error={scenarioNameFieldValues.hasError}
                                       label={t(CREATE_SCENARIO_DIALOG_SCENARIO_NAME_LABEL_KEY)}
                                       helperText={t(scenarioNameFieldValues.errorKey)}
                                       fullWidth />
                        </Grid>
                        {currentScenarioSelected &&
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={isMaster}
                                        onChange={handleChangeScenarioMaster}
                                        id="isScenarioMaster"
                                        color="primary" />
                                }
                                label={t(CREATE_SCENARIO_DIALOG_SCENARIO_MASTER_LABEL_KEY, 'Master')}/>
                        </Grid>
                        }
                        <Grid item xs={12}>
                            { isMaster || !currentScenarioSelected
                              ? (<Autocomplete
                                    disableClearable={true}
                                    id='dataset'
                                    options={datasets}
                                    onChange={
                                        (event, newDataset) => (handleChangeDataset(newDataset))
                                    }
                                    getOptionLabel={(option) => option.name}
                                    renderInput={
                                        (params) => (
                                            <TextField
                                                {...params}
                                                placeholder={t(CREATE_SCENARIO_DIALOG_DATASET_PLACEHOLDER_KEY, 'Dataset')}
                                                label={t(CREATE_SCENARIO_DIALOG_DATASET_LABEL_KEY, 'Select a dataset')}
                                                variant="outlined"/>)
                                    }/>)
                              : (<HierarchicalComboBox
                                        tree={scenarios}
                                        label={CREATE_SCENARIO_DIALOG_PARENT_SCENARIO_LABEL_KEY}
                                        defaultValue={{ optionLabel: selectedParentType }}
                                        handleChange={
                                            (event, newParentScenario) => (handleChangeParentScenario(newParentScenario))
                                        }/>
                                )
                            }
                        </Grid>
                        <Grid item xs={12}>
                            <Autocomplete
                                id='scenarioType'
                                disableClearable={true}
                                options={runTemplates}
                                onChange={
                                    (event, newScenarioType) => (handleScenarioTypeChange(newScenarioType))
                                }
                                getOptionLabel={(option) => option.name}
                                renderInput={
                                    (params) => (
                                        <TextField
                                            {...params}
                                            placeholder={t(CREATE_SCENARIO_DIALOG_SCENARIO_TYPE_PLACEHOLDER_KEY, 'Scenario')}
                                            label={t(CREATE_SCENARIO_DIALOG_SCENARIO_TYPE_LABEL_KEY, 'Scenario Type')}
                                            variant="outlined"/>
                                    )}/>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button id="cancel"
                            onClick={handleCloseDialog}
                            color="primary">
                        {t(CREATE_SCENARIO_DIALOG_CANCEL_LABEL_KEY, 'Cancel')}
                    </Button>
                    <Button id="create"
                            disabled={createScenarioDisabled}
                            color="primary">
                        {t(CREATE_SCENARIO_DIALOG_CREATE_LABEL_KEY, 'Create')}
                    </Button>
                </DialogActions>
        </Dialog>
  );
};

CreateScenarioDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  scenarios: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  runTemplates: PropTypes.array.isRequired
};

export default withStyles(useStyles)(CreateScenarioDialog);
