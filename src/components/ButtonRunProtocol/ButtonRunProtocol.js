// copyright (c) cosmo tech corporation.
// licensed under the mit license.

import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { Box } from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'

const useStyles = theme => ({
  button: {
    margin: '2px'
  }
})

class ButtonRunProtocol extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false
    }

    // Bind methods
    this.startProtocol = this.startProtocol.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    // Disable button to prevent multiple clicks
    this.setState({
      disabled: true
    })
    // Start the protocol
    this.startProtocol()
    // Enable button after a delay
    // TODO: move disabled state attribute to a higher component
    window.setTimeout(() => {
      this.setState({
        disabled: false
      })
    }, 2000)
  }

  startProtocol () {
    // Check mandatory parameters
    if (this.props.apiConfig.simulator === undefined ||
        this.props.apiConfig.simulator.length === 0) {
      console.error('Simulator parameter is empty or undefined, ' +
        'can\'t run simulation')
      return
    }
    if (this.props.simulationName === undefined ||
        this.props.simulationName.length === 0) {
      console.error('Simulation name parameter is empty or undefined, ' +
        'can\'t run simulation')
      return
    }
    if (this.props.driverName === undefined ||
        this.props.driverName.length === 0) {
      console.error('Driver name parameter is empty or undefined, ' +
        'can\'t run simulation')
      return
    }

    // Forge request URL
    let url = '/api/RunProtocol?'
    // Mandatory simulator parameter
    url += '&simulator=' + this.props.apiConfig.simulator
    url += '&simulation=' + this.props.simulationName
    url += '&driverName=' + 'custom-drivers/' + this.props.driverName
    if (this.props.popSize !== undefined) {
      url += '&popSize=' + this.props.popSize
    }
    if (this.props.totalSimulations !== undefined) {
      url += '&totalSimulations=' + this.props.totalSimulations
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
        if (this.props.onProtocolStarted) {
          this.props.onProtocolStarted(data.sagaId, data.jobName)
        }
      })
  }

  render () {
    const { classes } = this.props
    return (
      <Box>
        <Button
          variant="contained"
          disabled={this.state.disabled}
          color="primary"
          size="medium"
          className={classes.button}
          onClick={this.handleClick}
          endIcon={<PlayCircleOutlineIcon/>}
        >Run protocol</Button>
      </Box>
    )
  }
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
