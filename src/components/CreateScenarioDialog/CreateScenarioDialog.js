// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useTranslation } from 'react-i18next';
import React, { useEffect, useRef, useState } from 'react';
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
  ERROR_SCENARIO_NAME_EXISTING_LABEL_KEY,
  ERROR_SCENARIO_NAME_FORBIDDEN_CHARS_KEY
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
  makeStyles
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HierarchicalComboBox from '../HierarchicalComboBox/HierarchicalComboBox';
import PropTypes from 'prop-types';

const useStyles = makeStyles(theme => ({
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
}));

const getCurrentScenarioRunType = (currentScenario, runTemplates) => {
  const runTemplateId = currentScenario?.data?.runTemplateId;
  runTemplates = runTemplates === undefined ? [] : runTemplates;
  const runTemplate = runTemplates.find(runTemplate => runTemplate.id === runTemplateId);
  return runTemplate === undefined ? {} : runTemplate;
};

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
  open,
  closeDialog,
  scenarios,
  currentScenario,
  datasets,
  runTemplates,
  user,
  createScenario,
  workspaceId,
  solution
}) => {
  const classes = useStyles();
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
  const currentScenarioSelected = currentScenario.data !== null;
  const defaultParentScenario = useRef({});
  const defaultScenarioType = useRef({});

  useEffect(() => {
    if (currentScenarioSelected) {
      defaultParentScenario.current = currentScenario.data;
      setParentScenarioFieldValues(currentScenario.data);
      const currentRunTemplate = getCurrentScenarioRunType(currentScenario, runTemplates);
      defaultScenarioType.current = currentRunTemplate;
      setScenarioTypeFieldValues(currentRunTemplate);
    } else {
      setMaster(true);
    }
  }, [currentScenario, currentScenarioSelected, runTemplates]);

  const handleChangeScenarioName = (event) => {
    const newScenarioName = event.target.value;
    let errorKey = '';
    let hasErrors = false;
    if (newScenarioName.length === 0) {
      errorKey = ERROR_SCENARIO_NAME_EMPTY_LABEL_KEY;
      hasErrors = true;
    } else {
      if (newScenarioName.match(/^\w[\w\d\s-]*$/) === null) {
        errorKey = ERROR_SCENARIO_NAME_FORBIDDEN_CHARS_KEY;
        hasErrors = true;
      } else if (ScenarioUtils.scenarioExists(newScenarioName, scenarios)) {
        errorKey = ERROR_SCENARIO_NAME_EXISTING_LABEL_KEY;
        hasErrors = true;
      }
    }
    setScenarioNameFieldValues({
      ...scenarioNameFieldValues,
      value: newScenarioName,
      errorKey: errorKey,
      hasError: hasErrors
    });
  };

  function createScenarioData () {
    const scenarioData = {
      name: scenarioNameFieldValues.value,
      ownerId: user.userId.toString(),
      ownerName: user.userName,
      solutionId: solution.data.id,
      solutionName: solution.data.name,
      runTemplateId: scenarioTypeFieldValues.id,
      runTemplateName: scenarioTypeFieldValues.name
    };

    if (isMaster) {
      scenarioData.datasetList = [datasetFieldValues.id];
    } else {
      scenarioData.parentId = parentScenarioFieldValues.id;
    }
    return scenarioData;
  }

  const handleCreateScenario = () => {
    const scenarioData = createScenarioData();
    createScenario(workspaceId, scenarioData);
    handleCloseDialog();
  };

  const handleChangeScenarioMaster = (event) => setMaster(event.target.checked);

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

  const resetToDefaultData = () => {
    setParentScenarioFieldValues(defaultParentScenario.current);
    setDatasetFieldValues({});
    setMaster(false);
    setScenarioNameFieldValues(scenarioNameInitialState);
    setScenarioTypeFieldValues(defaultScenarioType.current);
  };

  const handleCloseDialog = () => {
    resetToDefaultData();
    closeDialog();
  };

  return (
        <Dialog open={open}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
                maxWidth={'sm'}
                fullWidth={true}
                disableBackdropClick >
                <DialogTitle id="form-dialog-title">
                  {t(CREATE_SCENARIO_DIALOG_TITLE_LABEL_KEY, 'Create alternative scenario')}
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
                                    defaultValue={datasetFieldValues}
                                    onChange={
                                        (event, newDataset) => (handleChangeDataset(newDataset))
                                    }
                                    getOptionLabel={(option) => Object.keys(option).length !== 0 ? option.name : ''}
                                    getOptionSelected={(option, value) => option.id === value.id}
                                    renderInput={
                                        (params) => (
                                            <TextField
                                                {...params}
                                                placeholder={t(CREATE_SCENARIO_DIALOG_DATASET_PLACEHOLDER_KEY, 'Dataset')}
                                                label={t(CREATE_SCENARIO_DIALOG_DATASET_LABEL_KEY, 'Select a dataset')}
                                                variant="outlined"/>)
                                    }/>)
                              : (<HierarchicalComboBox
                                        values={scenarios}
                                        defaultValue={defaultParentScenario.current}
                                        label={CREATE_SCENARIO_DIALOG_PARENT_SCENARIO_LABEL_KEY}
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
                                value={scenarioTypeFieldValues}
                                options={runTemplates}
                                onChange={
                                    (event, newScenarioType) => (handleScenarioTypeChange(newScenarioType))
                                }
                                getOptionLabel={(option) => Object.keys(option).length !== 0 ? option.name : ''}
                                getOptionSelected={(option, value) => option.id === value.id}
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
                            onClick={handleCreateScenario}
                            color="primary">
                        {t(CREATE_SCENARIO_DIALOG_CREATE_LABEL_KEY, 'Create')}
                    </Button>
                </DialogActions>
        </Dialog>
  );
};

CreateScenarioDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  closeDialog: PropTypes.func.isRequired,
  scenarios: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  runTemplates: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  createScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  solution: PropTypes.object.isRequired
};

export default CreateScenarioDialog;
