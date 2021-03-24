// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Trans, useTranslation } from 'react-i18next'
import { Card, MenuItem, Select, Typography } from '@material-ui/core'
import Snackbar from '@material-ui/core/Snackbar'
import MuiAlert from '@material-ui/lab/Alert'
import { ButtonRunSimulation } from '../../components'
import apiConfig from '../../service/api'

const useStyles = theme => ({
  card: {
    height: '100%',
    color: '#FFFFFF',
    backgroundColor: theme.palette.background.secondary,
    marginBottom: '8px',
    marginLeft: '4px',
    marginRight: '4px'
  },
  title: {
    margin: '16px',
    fontWeight: 'bold',
    textAlign: 'left',
    fontSize: 18,
    padding: 0,
    letterSpacing: 0
  },
  parameter: {
    marginTop: '8px',
    marginBottom: '8px',
    marginLeft: '16px'
  },
  label: {
    marginRight: '4px'
  },
  select: {
    marginLeft: '8px'
  },
  buttonContainer: {
    marginTop: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
})

function Alert (props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

const CardSimulationParameters = (props) => {
  const [sagaId, setSagaId] = useState(null)
  const [jobName, setJobName] = useState(null)
  const [snackOpen, setSnackOpen] = useState(false)
  const { t } = useTranslation()

  const handleSnackClose = () => setSnackOpen(false)

  const onSimulationStarted = (sagaId, jobName) => {
    setSnackOpen(true)
    setJobName(jobName)
    setSagaId(sagaId)
  }

  const onSelectSimulator = (event) => {
    props.onSimulatorNameChange(event.target.value)
  }

  return (
      <Card className={props.classes.card} raised>
        <Typography variant='h5' component='h2' className={props.classes.title}>
          {t('components.card.simulation.parameters.title.simulation.parameters', 'Simulator parameters')}
        </Typography>
        <div className={props.classes.parameter}>
          <Typography className={props.classes.label} component='span'>
            {t('components.card.simulation.parameters.text.simulator.name', 'Simulator name')}:
          </Typography>
          <Select
              className={props.classes.select}
              labelId='simulators-parameters-simulators-name'
              id='simulators-name-select'
              value={ props.simulatorName }
              onChange={onSelectSimulator}>
            { generateMenuItems(props.simulatorsList) }
          </Select>
        </div>
        <div className={props.classes.parameter}>
          <Typography className={props.classes.label} component='span'>
            {t('components.card.simulation.parameters.text.simulation.name', 'Simulation name')}:
          </Typography>
          <Select
              className={props.classes.select}
              labelId='simulation-parameters-simulation-name'
              id='simulation-name-select'
              value={ props.simulationName }
              onChange={(event) => props.onSimulationNameChange(event.target.value)}>
              { generateMenuItems(props.simulationsList) }
          </Select>
        </div>
        <div className={props.classes.buttonContainer}>
          <ButtonRunSimulation
              apiConfig={apiConfig}
              simulationName={props.simulationName}
              simulatorName={props.simulatorName}
              onSimulationStarted={onSimulationStarted}
          />
        </div>
        <Snackbar open={snackOpen} autoHideDuration={20000} onClose={handleSnackClose}>
          <Alert severity="success" onClose={handleSnackClose}>
            <Trans i18nKey="userMessagesUnread" jobName={jobName} sagaId={sagaId}>
              {t('components.card.simulation.parameters.text.alert.simulation.launched', 'Simulation successfully launched')}:<br/>{{ jobName }}<br/>{{ sagaId }}
            </Trans>
          </Alert>
        </Snackbar>
      </Card>
  )
}

// TODO handle ref component correctly to avoid error message in console
function generateMenuItems (simulations) {
  return simulations.map((simulationName, index) => {
    return (
        <MenuItem key={index} value={simulationName}>
          {simulationName}
        </MenuItem>
    )
  })
}

CardSimulationParameters.propTypes = {
  classes: PropTypes.any,
  simulationsList: PropTypes.array.isRequired,
  simulationName: PropTypes.string.isRequired,
  onSimulationNameChange: PropTypes.func.isRequired,
  simulatorsList: PropTypes.array.isRequired,
  simulatorName: PropTypes.string.isRequired,
  onSimulatorNameChange: PropTypes.func.isRequired
}

export default withStyles(useStyles)(CardSimulationParameters)
