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

class ButtonRunSimulation extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: false
    }

    // Bind methods
    this.startSimulation = this.startSimulation.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    // Disable button to prevent multiple clicks
    this.setState({
      disabled: true
    })
    // Start the simulation
    this.startSimulation()
    // Enable button after a delay
    // TODO: move disabled state attribute to a higher component
    window.setTimeout(() => {
      this.setState({
        disabled: false
      })
    }, 2000)
  }

  startSimulation () {
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

    // Forge request URL
    let url = '/api/RunSimulation?'
    // Mandatory simulator parameter
    url += '&simulator=' + this.props.apiConfig.simulator
    url += '&simulation=' + this.props.simulationName

    fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('authAccessToken')
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
        if (this.props.onSimulationStarted) {
          this.props.onSimulationStarted(data.sagaId, data.jobName)
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
        >Run simulation</Button>
      </Box>
    )
  }
}

ButtonRunSimulation.propTypes = {
  classes: PropTypes.any,
  onSimulationStarted: PropTypes.func,
  simulationName: PropTypes.string.isRequired,
  apiConfig: PropTypes.shape({
    simulator: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(ButtonRunSimulation)
