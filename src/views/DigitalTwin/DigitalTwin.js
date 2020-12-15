import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Box, Grid } from '@material-ui/core'
import apiConfig from '../../service/api'
import {
  ButtonRunSimulation,
  ButtonRunProtocol,
  CardSimulationParameters
} from '../../components'

const useStyles = theme => ({
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    background: theme.palette.background.secondary,
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`,
    position: 'relative',
    zIndex: 11
  },
  toolbarActions: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0
  },
  digitalTwinPanel: {
    flexGrow: 1,
    padding: `0 ${theme.spacing(3)}px ${theme.spacing(2)}px ${theme.spacing(3)}px`,
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  grid: {
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${1.5 * theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    flexGrow: 1,
    minHeight: '350px'
  }
})

class DigitalTwin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      simulationsList: ['Simulation'],
      simulationName: 'Simulation',
      driverName: 'custom-drivers/Supplychain.zip',
      popSize: 48,
      totalSimulations: 200
    }

    this.setSimulationName = this.setSimulationName.bind(this)
    this.setDriverName = this.setDriverName.bind(this)
    this.setPopSize = this.setPopSize.bind(this)
    this.setTotalSimulations = this.setTotalSimulations.bind(this)
  }

  setSimulationName (newSimulationName) {
    this.setState({ simulationName: newSimulationName })
  }

  setDriverName (newDriverName) {
    this.setState({ driverName: newDriverName })
  }

  setPopSize (newPopSize) {
    this.setState({ popSize: newPopSize })
  }

  setTotalSimulations (newTotalSimulations) {
    this.setState({ totalSimulations: newTotalSimulations })
  }

  render () {
    const { classes } = this.props
    return (
      <Box component='main' display='flex' flexDirection='column' height='100%'>
        <Box className={classes.toolbar}>
          <Box className={classes.toolbarActions}>
            <ButtonRunSimulation
              apiConfig={apiConfig}
              simulationName={this.state.simulationName}
            />
            <ButtonRunProtocol
              apiConfig={apiConfig}
              simulationName={this.state.simulationName}
              driverName={this.state.driverName}
              popSize={this.state.popSize}
              totalSimulations={this.state.totalSimulations}
            />
          </Box>
        </Box>
        <Box className={classes.digitalTwinPanel}>
          <Grid container spacing={2} className={classes.grid}>
            <Grid item xs={4}>
              <CardSimulationParameters
                simulationsList={this.state.simulationsList}
                simulationName={this.state.simulationName}
                onSimulationNameChange={this.setSimulationName}
              />
            </Grid>
            <Grid item xs={8}>
            </Grid>
          </Grid>
        </Box>
      </Box>
    )
  }
}

DigitalTwin.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(DigitalTwin)
