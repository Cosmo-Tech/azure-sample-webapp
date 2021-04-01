// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { Box } from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'
import { useTranslation } from 'react-i18next'

const useStyles = theme => ({
  button: {
    margin: '2px'
  }
})

const ButtonRunSimulation = (props) => {
  const [disabled, setDisabled] = useState(false)
  const { t } = useTranslation()

  const handleClick = () => {
    // Disable button to prevent multiple clicks
    setDisabled(true)
    // Start the simulation
    startSimulation()
    // Enable button after a delay
    // TODO: move disabled state attribute to a higher component
    window.setTimeout(() => {
      setDisabled(false)
    }, 2000)
  }

  // TODO extract the api call into a core library function in order to abstract the url construction
  const startSimulation = () => {
    const simulatorUri = props.apiConfig.simulator.replace('SIMULATORNAME', props.simulatorName)
    // Check mandatory parameters
    if (simulatorUri === undefined || simulatorUri.length === 0) {
      console.error('Simulator parameter is empty or undefined, can\'t run simulation')
      return
    }
    if (props.simulationName === undefined || props.simulationName.length === 0) {
      console.error('Simulation name parameter is empty or undefined, can\'t run simulation')
      return
    }

    // Forge request URL
    let url = '/api/RunSimulation?'
    // Mandatory simulator parameter
    url += '&simulator=' + simulatorUri
    url += '&simulation=' + props.simulationName

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'csm-authorization': localStorage.getItem('authAccessToken')
      }
    })
      .then(response => {
      // On failure, print error in console
        if (!response.ok) {
          console.error('Request failed with status ' + response.status + ':' +
          response.statusText)
          return undefined
        }
        // On success, parse JSON
        return response.json()
      })
      .then(data => {
        if (data === undefined) { return }
        // Send saga id to the "scenario manager"
        if (props.onSimulationStarted) {
          props.onSimulationStarted(data.sagaId, data.jobName)
        }
      })
  }

  return (
      <Box>
        <Button
          variant="contained"
          disabled={disabled}
          color="primary"
          size="medium"
          className={props.classes.button}
          onClick={handleClick}
          endIcon={<PlayCircleOutlineIcon/>}
        >{t('commoncomponents.button.run.scenario.text', 'Run scenario')}</Button>
      </Box>
  )
}

ButtonRunSimulation.propTypes = {
  classes: PropTypes.any,
  onSimulationStarted: PropTypes.func,
  simulationName: PropTypes.string.isRequired,
  simulatorName: PropTypes.string.isRequired,
  apiConfig: PropTypes.shape({
    simulator: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(ButtonRunSimulation)
