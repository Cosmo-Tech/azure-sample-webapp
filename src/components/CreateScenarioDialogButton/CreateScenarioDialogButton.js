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
import { useTranslation } from 'react-i18next';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  dialogContent: {
    marginLeft: '20px',
    marginRight: '20px'
  },
  dialogActions: {
    marginRight: '30px',
    marginTop: '20px',
    marginBottom: '5px'
  }
});

const CreateScenarioDialogButton = ({ classes, datasets, scenarios, runTemplates }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleOpenDialog = () => setOpen(true);
  const handleCloseDialog = () => setOpen(false);

  const handleCreateScenario = () => {
    /*    const newScenario = {
      name: dialogData.scenario.name,
      type: dialogData.scenarioType.value
    };
    if (dialogData.scenario.isMaster) {
      newScenario.parentId = dialogData.parentScenario.value;
    } else {
      newScenario.dataset = dialogData.dataset.value;
    } */
    setOpen(false);
  };

  return (
    <div>
      <Button size="medium" startIcon={<AddIcon />} variant="text" onClick={handleOpenDialog} color="primary">
        <Typography noWrap color="primary">{t('commoncomponents.button.create.scenario', 'Create Alternate Scenario')}</Typography>
      </Button>
      <CreateScenarioDialog
          open={open}
          datasets={datasets}
          classes={classes}
          handleCloseDialog={handleCloseDialog}
          handleCreateScenario={handleCreateScenario}
          runTemplates={runTemplates}
          scenarios={scenarios} />
    </div>
  );
};

CreateScenarioDialogButton.propTypes = {
  classes: PropTypes.any,
  scenarios: PropTypes.array.isRequired,
  datasets: PropTypes.array.isRequired,
  runTemplates: PropTypes.array.isRequired
};

const CreateScenarioDialog = ({
  classes,
  open,
  handleCloseDialog,
  handleCreateScenario,
  scenarios,
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
  const [isMaster, setMaster] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [datasetFieldValues, setDatasetFieldValues] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [parentScenarioFieldValues, setParentScenarioFieldValues] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [scenarioTypeFieldValues, setScenarioTypeFieldValues] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [createButtonDisabled, setCreateButtonDisabled] = useState(true);

  /*  const handleChangeScenarioName = (event) => {
    const newValues = { ...dialogData };
    const value = event.target.value;

    const scenarioExist = ScenarioUtils.isScenarioExist(scenarios, value);
    const scenarioNameEmpty = value.length === 0;
    newValues.scenario.label = 'scenario.textField.error';
    if (scenarioExist) {
      newValues.scenario.helper = 'scenario.textField.namealreadyexists';
    } else if (scenarioNameEmpty) {
      newValues.scenario.helper = 'scenario.textField.nameiseempty';
    } else {
      newValues.scenario.helper = '';
      newValues.scenario.label = 'scenario.textField.label';
    }
    newValues.buttonCreateDisabled = scenarioExist || value.length === 0;
    newValues.scenario.hasError = newValues.buttonCreateDisabled;

    setDialogData({
      ...newValues,
      scenario: {
        name: value
      }
    });
  }; */
  const handleChangeScenarioName = (event) => {
    const newScenarioName = event.target.value;
    setScenarioNameFieldValues({
      ...scenarioNameFieldValues,
      value: newScenarioName
    });
  };

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

  return (
      <Dialog open={open}
              onClose={handleCloseDialog}
              aria-labelledby="form-dialog-title"
              maxWidth={'sm'}
              fullWidth={true}
              disableBackdropClick >
        <DialogTitle id="form-dialog-title" className={classes.dialogContent} >
          <Typography variant='h3'>
            {t('commoncomponents.dialog.create.scenario.text.title', 'Create alternative scenario')}
          </Typography>
        </DialogTitle>
        <DialogContent className={classes.dialogContent}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField onChange={handleChangeScenarioName}
                         autoFocus
                         id="scenarioName"
                         value={scenarioNameFieldValues.value}
                         error={scenarioNameFieldValues.hasError}
                         label={t('commoncomponents.dialog.create.scenario.input.scenarioname.label')}
                         helperText={t(scenarioNameFieldValues.errorKey)}
                         fullWidth />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                  control={
                    <Checkbox
                        checked={isMaster}
                        onChange={handleChangeScenarioMaster}
                        id="isScenarioMaster"
                        color="primary" />
                  }
                  label={t('commoncomponents.dialog.create.scenario.checkbox.scenarioMaster.label', 'Master')}/>
            </Grid>
            <Grid item xs={12}>
              { isMaster
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
                                placeholder={t('commoncomponents.dialog.create.scenario.dropdown.dataset.placeholder', 'Dataset')}
                                label={t('commoncomponents.dialog.create.scenario.dropdown.dataset.label', 'Select a dataset')}
                                variant="outlined"/>)
                      }/>)
                : (<HierarchicalComboBox
                          tree={scenarios}
                          label='commoncomponents.dialog.create.scenario.dropdown.parentscenario.label'
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
                            placeholder={t('commoncomponents.dialog.create.scenario.dropdown.scenariotype.placeholder', 'Scenario')}
                            label={t('commoncomponents.dialog.create.scenario.dropdown.scenariotype.label', 'Scenario Type')}
                            variant="outlined"/>
                    )}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.dialogActions}>
          <Button id="cancel"
                  onClick={handleCloseDialog}
                  color="primary">
            {t('commoncomponents.dialog.create.scenario.button.cancel', 'Cancel')}
          </Button>
          <Button id="create"
                  disabled={createButtonDisabled}
                  onClick={handleCreateScenario}
                  color="primary">
            {t('commoncomponents.dialog.create.scenario.button.create', 'Create')}
          </Button>
        </DialogActions>
      </Dialog>
  );
};

CreateScenarioDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleCloseDialog: PropTypes.func.isRequired,
  handleCreateScenario: PropTypes.func.isRequired,
  scenarios: PropTypes.array.isRequired,
  datasets: PropTypes.array.isRequired,
  runTemplates: PropTypes.array.isRequired
};

export default withStyles(useStyles)(CreateScenarioDialogButton);
