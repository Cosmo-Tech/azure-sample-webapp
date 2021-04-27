// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Grid, Typography } from '@material-ui/core'
import DropdownScenario from '../../components/DropdownScenario'
import DialogCreateScenario from '../../components/DialogCreateScenario'
import { useTranslation } from 'react-i18next'

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
  mainGrid: {
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    flexGrow: 1
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
});

const Scenario = ({
  classes,
  scenarioList,
  scenarioTree,
  currentScenario
}) => {
  const { t } = useTranslation();
  // TODO remove eslint warning when information will be retrieved from api calls
  // eslint-disable-next-line no-unused-vars
  const [simulators, setSimulators] = useState(['supplychain', 'supplychaindemo'])
  // eslint-disable-next-line no-unused-vars
  const [simulations, setSimulations] = useState(['Simulation'])
  // eslint-disable-next-line no-unused-vars
  const [drivers, setDrivers] = useState(['Supplychain.zip'])

  const [scenario, setStateScenario] = useState(null)

  const { t } = useTranslation()

  return (
    <Grid container spacing={2} alignItems="center" className={props.classes.mainGrid}>
      <Grid item xs={10}>
        <Grid container spacing={2} alignItems="center" className={props.classes.mainGrid}>
          <Grid item xs={3} style={{ width: '100%', marginLeft: '20px', paddingRight: '30px' }}>
            <DropdownScenario setScenario={(sc) => (setStateScenario(sc))}>
            </DropdownScenario>
          </Grid>
          <Grid item xs={3}>
            <Typography>{ t('scenario.type.label')} {scenario}</Typography>
          </Grid>
        </Grid>
        </Grid>
      <Grid item xs={2}>
        <DialogCreateScenario></DialogCreateScenario>
      </Grid>
    </Grid>
  )
}

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioList: PropTypes.object.isRequired,
  scenarioTree: PropTypes.object.isRequired,
  currentScenario: PropTypes.object
};

export default withStyles(useStyles)(Scenario);
