import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import { Box } from '@material-ui/core'
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline'

const useStyles = theme => ({
  button: {
  }
})

class ButtonRunSimulation extends React.Component {
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
    if (this.props.apiConfig.amqpConsumer === undefined ||
        this.props.apiConfig.amqpConsumer.length === 0) {
      console.error('AMQP parameter is empty or undefined, ' +
        'can\'t run simulation')
      return
    }

    if (this.props.scenarioName === undefined ||
        this.props.scenarioName.length === 0) {
      console.error('Scenario name parameter is empty or undefined, ' +
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
    simulatorRunArgs.push('--input')
    simulatorRunArgs.push(this.props.scenarioName)
    simulatorRunArgs.push('--amqp-consumer')
    simulatorRunArgs.push(this.props.apiConfig.amqpConsumer)

    console.log('test:')
    console.log(this.props.apiConfig.amqpConsumer)

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
        >Run simulation</Button>
      </Box>
    )
  }
}

ButtonRunSimulation.propTypes = {
  classes: PropTypes.any,
  scenarioName: PropTypes.string.isRequired,
  apiConfig: PropTypes.shape({
    url: PropTypes.string.isRequired,
    key: PropTypes.string.isRequired,
    simulator: PropTypes.string.isRequired,
    amqpConsumer: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(ButtonRunSimulation)
