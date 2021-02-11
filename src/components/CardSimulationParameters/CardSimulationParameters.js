import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
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

class CardSimulationParameters extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sagaId: null,
      jobName: null,
      snackOpen: false
    }

    // Bind methods
    this.onSimulationNameChange = this.onSimulationNameChange.bind(this)
    this.onSimulatorNameChange = this.onSimulatorNameChange.bind(this)
    this.onSimulationStarted = this.onSimulationStarted.bind(this)
    this.handleSnackClose = this.handleSnackClose.bind(this)
  }

  handleSnackClose () {
    this.setState({ snackOpen: false })
  }

  onSimulationStarted (sagaId, jobName) {
    this.setState({
      sagaId: sagaId,
      jobName: jobName,
      snackOpen: true
    })
  }

  onSimulationNameChange (event) {
    this.props.onSimulationNameChange(event.target.value)
  }

  onSimulatorNameChange (event) {
    this.props.onSimulatorNameChange(event.target.value)
  }

  render () {
    const { classes } = this.props
    return (
      <Card className={classes.card} raised>
        <Typography variant='h5' component='h2' className={classes.title}>
          Simulation parameters
        </Typography>
        <div className={classes.parameter}>
          <Typography className={classes.label} component='span'>
            Simulator name:
          </Typography>
          <Select
            className={classes.select}
            labelId='simulators-parameters-simulators-name'
            id='simulators-name-select'
            value={ this.props.simulatorName }
            onChange={this.onSimulatorNameChange}>
            { generateMenuItems(this.props.simulatorsList) }
          </Select>
        </div>
        <div className={classes.parameter}>
          <Typography className={classes.label} component='span'>
            Simulation name:
          </Typography>
          <Select
            className={classes.select}
            labelId='simulation-parameters-simulation-name'
            id='simulation-name-select'
            value={ this.props.simulationName }
            onChange={this.onSimulationNameChange}>
            { generateMenuItems(this.props.simulationsList) }
          </Select>
        </div>
        <div className={classes.buttonContainer}>
          <ButtonRunSimulation
            apiConfig={apiConfig}
            simulationName={this.props.simulationName}
            simulatorName={this.props.simulatorName}
            onSimulationStarted={this.onSimulationStarted}
          />
        </div>
        <Snackbar open={this.state.snackOpen} autoHideDuration={20000} onClose={this.handleSnackClose}>
            <Alert severity="success" onClose={this.handleSnackClose}>
              Simulation successfully launched:<br/>{this.state.jobName}<br/>{this.state.sagaId}
            </Alert>
          </Snackbar>
      </Card>
    )
  }
}

function generateMenuItems (simulations) {
  return simulations.map(simulationName => {
    return (
      <MenuItem key={simulationName} value={simulationName}>
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
