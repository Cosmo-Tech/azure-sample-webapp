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
    }

    // Bind methods
    this.startSimulation = this.startSimulation.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick () {
    this.startSimulation()
  }

  startSimulation () {
    // Check mandatory parameters
    if (this.props.apiConfig.url === undefined ||
        this.props.apiConfig.url.length === 0) {
      console.error('REST API url is empty or undefined, ' +
        'can\'t run simulation')
      return
    }
    if (this.props.apiConfig.key === undefined ||
        this.props.apiConfig.key.length === 0) {
      console.error('REST API key is empty or undefined, ' +
        'can\'t run simulation')
      return
    }
    if (this.props.apiConfig.simulator === undefined ||
        this.props.apiConfig.simulator.length === 0) {
      console.error('Simulator parameter is empty or undefined, ' +
        'can\'t run simulation')
      return
    }
    if (this.props.apiConfig.driverConnection === undefined ||
        this.props.apiConfig.driverConnection.length === 0) {
      console.error('Driver connection parameter is empty or undefined, ' +
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
    const newSimEndpoint = 'simulations/new'
    let url = this.props.apiConfig.url + '/' + newSimEndpoint + '?'
    // Mandatory REST API key
    url += 'key=' + this.props.apiConfig.key
    // Mandatory simulator parameter
    url += '&simulator=' + this.props.apiConfig.simulator
    // SimulatorRunArgs
    const simulatorRunArgs = []
    simulatorRunArgs.push('--custom-driver')
    simulatorRunArgs.push(this.props.driverName)
    simulatorRunArgs.push('--custom-driver-connection')
    simulatorRunArgs.push(this.props.apiConfig.driverConnection)

    for (const i in simulatorRunArgs) {
      url += '&runArgs=' + simulatorRunArgs[i]
    }

    // Debug log
    console.log(url)

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

        // Debug log
        console.log('Simulation started:')
        console.log(' - data: ')
        console.log(data)
        // console.log(' - jobName: ' + data.jobName)
        // console.log(' - sagaId: ' + data.sagaId)

      // Send saga id to the "scenario manager"
      // this.props.onSimulationStarted(data.sagaId, scenarioId)
      })
  }

  render () {
    const { classes } = this.props
    return (
      <Box>
        <Button
          variant="contained"
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
  driverName: PropTypes.string.isRequired,
  apiConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    simulator: PropTypes.string.isRequired,
    driverConnection: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(ButtonRunProtocol)
