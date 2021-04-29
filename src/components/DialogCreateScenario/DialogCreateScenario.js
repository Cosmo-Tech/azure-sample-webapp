import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import {
  Button, TextField, Dialog, DialogActions, FormControlLabel,
  DialogTitle, DialogContent, Checkbox, Grid
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Autocomplete from '@material-ui/lab/Autocomplete';
import DropdownScenario from '../../components/DropdownScenario';
import { SCENARIO_TYPES } from '../../state/commons/ScenarioConstants';
import { useTranslation } from 'react-i18next';
import { ScenarioUtils } from '@cosmotech/core';
import scenarioJSON from '../DropdownScenario/GetScenariosTree.json';
import datasetJSON from '../DropdownScenario/GetDataset.json';

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
    scenarioHelper: 'scenario.textField.enterName',
    checkScenarioMaster: true,
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
  const handleChange = (event, value, id) => {
    const newValues = { ...values };
    if (id === undefined) {
      id = event.target.id;
    }
    if (value === undefined) {
      value = event.target.value;
    }

    if (id === 'scenarioName') {
      const scenarioExist = ScenarioUtils.isScenarioExist(scenarioJSON, value);
      const scenarioNameEmpty = value.length === 0;
      newValues.scenarioLabel = 'scenario.textField.error';
      if (scenarioExist) {
        newValues.scenarioHelper = 'scenario.textField.nameAlreadyExist';
      } else if (scenarioNameEmpty) {
        newValues.scenarioHelper = 'scenario.textField.nameIsEmpy';
      } else {
        newValues.scenarioHelper = '';
        newValues.scenarioLabel = 'scenario.textField.label';
      }
      newValues.buttonCreateDisabled = scenarioExist || value.length === 0;
      newValues.scenarioError = newValues.buttonCreateDisabled;
    } else if (id === 'dropDownScenario') {
      newValues.scenarioParent = value;
    }
    setValues({ ...newValues, [id]: value });
  };

  const createScenario = () => {
    const newScenario = {
      id: Math.max(...scenarioJSON.map((sc) => parseInt(sc.id))) + 1,
      name: values.scenarioName,
      type: values.scenarioType
    };
    if (values.checkScenarioMaster) {
      newScenario.parentId = values.scenarioParent.id;
    } else {
      newScenario.dataset = values.dataset.id;
    }
    scenarioJSON.push(newScenario);
    handleDialogClose();
  };

  let scenarioOrDatasetDropDown;
  if (values.checkScenarioMaster) {
    scenarioOrDatasetDropDown =
      <Autocomplete
        id="dropdownDataset"
        disableClearable={true}
        options={datasetJSON}
        onChange={(event, dataset) => (handleChange(event, dataset, 'dropdownDataset'))}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField {...params} placeholder="Dataset" label="Select a dataset" variant="outlined"/>
        )}
      />;
  } else {
    scenarioOrDatasetDropDown =
      <DropdownScenario scenarioTree={scenarioTree} label='scenario.dropdown.parentlabel' handleChange={handleChange}>
      </DropdownScenario>;
  }

  return (
    <div>
      <Button startIcon={<AddIcon />} variant="text" onClick={handleClickOpen} color="primary">
        Create Alternate Scenario
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
              <TextField onChange={handleChange} autoFocus id="scenarioName" value={values.scenarioName}
                error={values.scenarioError} label={t(values.scenariolabel)} helperText={t(values.scenariohelper)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={values.checkScenarioMaster}
                  onChange={handleChange}
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
                id="scenarioType"
                disableClearable={true}
                options={Object.values(SCENARIO_TYPES)}
                onChange={handleChange}
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
