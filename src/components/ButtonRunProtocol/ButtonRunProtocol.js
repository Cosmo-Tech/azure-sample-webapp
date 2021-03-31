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

const ButtonRunProtocol = (props) => {
  const [disabled, setDisabled] = useState(false)
  const { t } = useTranslation()

  const handleClick = () => {
    // Disable button to prevent multiple clicks
    setDisabled(true)
    // Start the protocol
    startProtocol()
    // Enable button after a delay
    // TODO: move disabled state attribute to a higher component
    window.setTimeout(() => {
      setDisabled(false)
    }, 2000)
  }

  // TODO extract the api call into a core library function in order to abstract the url construction
  const startProtocol = () => {
    // Check mandatory parameters
    if (props.apiConfig.simulator === undefined || props.apiConfig.simulator.length === 0) {
      console.error('Simulator parameter is empty or undefined, can\'t run simulation')
      return
    }
    if (props.simulationName === undefined || props.simulationName.length === 0) {
      console.error('Simulation name parameter is empty or undefined, can\'t run simulation')
      return
    }
    if (props.driverName === undefined || props.driverName.length === 0) {
      console.error('Driver name parameter is empty or undefined, can\'t run simulation')
      return
    }

    // Forge request URL
    let url = '/api/RunProtocol?'
    // Mandatory simulator parameter
    url += '&simulator=' + props.apiConfig.simulator
    url += '&simulation=' + props.simulationName
    url += '&driverName=' + 'custom-drivers/' + props.driverName
    if (props.popSize !== undefined) {
      url += '&popSize=' + props.popSize
    }
    if (props.totalSimulations !== undefined) {
      url += '&totalSimulations=' + props.totalSimulations
    }

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json'
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
        if (props.onProtocolStarted) {
          props.onProtocolStarted(data.sagaId, data.jobName)
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
        >{t('commoncomponents.button.run.protocol.text', 'Run protocol')}</Button>
      </Box>
  )
}

ButtonRunProtocol.propTypes = {
  classes: PropTypes.any,
  onProtocolStarted: PropTypes.func,
  simulationName: PropTypes.string.isRequired,
  driverName: PropTypes.string.isRequired,
  popSize: PropTypes.number,
  totalSimulations: PropTypes.number,
  apiConfig: PropTypes.shape({
    simulator: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(ButtonRunProtocol)
