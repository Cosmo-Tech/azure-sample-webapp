import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, TextField, Dialog, DialogActions, FormControlLabel,
  DialogTitle, DialogContent, Checkbox, Grid, Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import { SCENARIO_TYPES } from '../../state/commons/ScenarioConstants';
import { useTranslation } from 'react-i18next';
import { ScenarioUtils } from '@cosmotech/core';
import datasetJSON from '../HierarchicalComboBox/GetDataset.json';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialogcontent: {
    marginLeft: '20px',
    marginRight: '20px'
  },
  dialogactions: {
    marginRight: '30px',
    marginTop: '20px',
    marginBottom: '5px'
  }
});

const DialogCreateScenario = (props) => {
  const { scenarioTree } = props;
  const initState = {
    scenarioName: '',
    scenarioError: false,
    scenarioLabel: 'scenario.textField.label',
    scenarioHelper: 'scenario.textField.entername',
    scenarioMaster: true,
    buttonCreateDisabled: true
  };
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(initState);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setValues(initState);
    setOpen(false);
  };

  const handleChangeScenarioName = (event) => {
    const newValues = { ...values };
    const value = event.target.value;

    const scenarioExist = ScenarioUtils.isScenarioExist(scenarioTree, value);
    const scenarioNameEmpty = value.length === 0;
    newValues.scenarioLabel = 'scenario.textField.error';
    if (scenarioExist) {
      newValues.scenarioHelper = 'scenario.textField.namealreadyexists';
    } else if (scenarioNameEmpty) {
      newValues.scenarioHelper = 'scenario.textField.nameiseempty';
    } else {
      newValues.scenarioHelper = '';
      newValues.scenarioLabel = 'scenario.textField.label';
    }
    newValues.buttonCreateDisabled = scenarioExist || value.length === 0;
    newValues.scenarioError = newValues.buttonCreateDisabled;

    setValues({ ...newValues, scenarioName: value });
  };

  const handleChangeScenarioMaster = (event) => {
    const newValues = { ...values, scenarioMaster: event.target.checked };
    setValues({ ...newValues });
  };

  const handleChangeCommon = (event, value, id) => {
    const newValues = { ...values, [id]: value };
    setValues({ ...newValues });
  };

  const createScenario = () => {
    const newScenario = {
      name: values.scenarioName,
      type: values.scenarioType
    };
    if (values.checkScenarioMaster) {
      newScenario.parentId = values.scenarioParent.id;
    } else {
      newScenario.dataset = values.dataset.id;
    }
    handleDialogClose();
  };

  let scenarioOrDatasetDropDown;
  if (values.scenarioMaster) {
    scenarioOrDatasetDropDown =
      <Autocomplete
        disableClearable={true}
        options={datasetJSON}
        onChange={(event, dataset) => (handleChangeCommon(event, dataset, 'dataset'))}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} placeholder="Dataset" label="Select a dataset" variant="outlined"/>
        )}
      />;
  } else {
    scenarioOrDatasetDropDown =
      <HierarchicalComboBox scenarioTree={scenarioTree} label='scenario.dropdown.parentlabel'
        handleChange={(event, scenarioParent) => (handleChangeCommon(event, scenarioParent, 'scenarioParent'))}>
      </HierarchicalComboBox>;
  }

  return (
    <div>
      <Button size="medium" startIcon={<AddIcon />} variant="text" onClick={handleClickOpen} color="primary">
        <Typography noWrap color="primary">Create Alternate Scenario</Typography>
      </Button>
      <Dialog open={open} onClose={handleDialogClose} aria-labelledby="form-dialog-title"
        maxWidth={'sm'}
        fullWidth={true}
        disableBackdropClick
      >
        <DialogTitle id="form-dialog-title" className={props.classes.dialogcontent}>
          CREATE ALTERNATIVE SCENARIO
        </DialogTitle>
        <DialogContent className={props.classes.dialogcontent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField onChange={handleChangeScenarioName} autoFocus id="scenarioName" value={values.scenarioName}
                error={values.scenarioError} label={t(values.scenarioLabel)} helperText={t(values.scenarioHelper)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.scenarioMaster}
                  onChange={handleChangeScenarioMaster}
                  id="checkScenarioMaster"
                  color="primary"
                />
              }
              label="Master"
            />
            </Grid>
            <Grid item xs={12}>
              {scenarioOrDatasetDropDown}
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                disableClearable={true}
                options={Object.values(SCENARIO_TYPES)}
                onChange={(event, dataset) => (handleChangeCommon(event, dataset, 'scenarioType'))}
                getOptionLabel={(option) => t(option.trad, 'type')}
                renderInput={(params) => (
                  <TextField {...params} placeholder="Scenario" label="Scenario Type" variant="outlined"/>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={props.classes.dialogactions}>
          <Button id="ButtonCancel" onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
          <Button id="ButtonCreate" disabled={values.buttonCreateDisabled} onClick={createScenario} color="primary">
            CREATE
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

DialogCreateScenario.propTypes = {
  classes: PropTypes.any,
  scenarioTree: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired
};

export default withStyles(useStyles)(DialogCreateScenario);
