// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';
import HierarchicalComboBox from '../../components/HierarchicalComboBox';
import DialogCreateScenario from '../../components/DialogCreateScenario';
import { useTranslation } from 'react-i18next';

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  scenarioPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  scenarioList: {
    paddingLeft: '40px',
    paddingRight: '20px'
  },
  mainGrid: {
    display: 'flex',
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    paddingTop: '10px',
    flexGrow: 1
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = (props) => {
  const { t } = useTranslation();
  // TODO remove eslint warning when information will be retrieved from api calls
  // eslint-disable-next-line no-unused-vars
  const [simulators, setSimulators] = useState(['supplychain', 'supplychaindemo']);
  // eslint-disable-next-line no-unused-vars
  const [simulations, setSimulations] = useState(['Simulation']);
  // eslint-disable-next-line no-unused-vars
  const [drivers, setDrivers] = useState(['Supplychain.zip']);

  // eslint-disable-next-line no-unused-vars
  const { currentScenario, scenarioList, findScenarioById, scenarioTree } = props;

  return (
    <Grid container alignItems="center" className={props.classes.mainGrid}>
      <Grid item xs={9}>
        <Grid container spacing={0} alignItems="center" className={props.classes.mainGrid}>
          <Grid item xs={5} className={props.classes.scenarioList}>
            <HierarchicalComboBox
              maxCharLength="36"
              tree={scenarioTree.data}
              label='scenario.dropdown.label'
              handleChange={(event, scenario) => (findScenarioById({ data: scenario.id }))}
            />
          </Grid>
          <Grid item xs={7}>
            <Typography>{ t('scenario.type.label')} {currentScenario.data && currentScenario.data.runTemplateName}</Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3}>
        <Grid container spacing={2} justify="flex-end" className={props.classes.mainGrid}>
          <Grid item>
            <DialogCreateScenario scenarioTree={scenarioTree.data} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioTree: PropTypes.object.isRequired,
  scenarioList: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired
};

export default withStyles(useStyles)(Scenario);
