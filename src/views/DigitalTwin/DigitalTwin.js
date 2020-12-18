import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Box, Grid } from '@material-ui/core'
import {
  CardSimulationParameters,
  CardProtocolParameters,
  IframeScenarioResults
} from '../../components'

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  digitalTwinPanel: {
    height: '100%',
    flexGrow: 1,
    paddingRight: '4px',
    display: 'flex',
    flexDirection: 'column',
    margin: '4px'
  },
  mainGrid: {
    margin: `${theme.spacing(1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px ${theme.spacing(-1)}px`,
    flexGrow: 1,
    height: '100%'
  },
  grid: {
    flexGrow: 1,
    height: '100%'
  }
})

class DigitalTwin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      simulationsList: ['Simulation'],
      driversList: ['Supplychain.zip'],
      simulationName: 'Simulation',
      driverName: 'Supplychain.zip',
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
      <Box component='main' display='flex' flexDirection='column'
          className={classes.root}>
        <Box className={classes.digitalTwinPanel}>
          <Grid container spacing={2} className={classes.mainGrid}>
            <Grid item xs={9}>
              <IframeScenarioResults
              cardStyle={ { height: '100%', width: '100%' } }
              iframeTitle="Supply Chain results"
              cardTitle="Results"
              src="https://app.powerbi.com/reportEmbed?reportId=018525c4-3fed-49e7-9048-6d6237e80145&autoAuth=true&ctid=e9641c78-d0d6-4d09-af63-168922724e7f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLWZyYW5jZS1jZW50cmFsLWEtcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D"
              frameBorder="0"
              allowFullScreen
              />
            </Grid>
            <Grid item xs={3}>
              <Grid container spacing={2} className={classes.grid}
                  direction="column">
                <Grid item>
                  <CardSimulationParameters
                    simulationsList={this.state.simulationsList}
                    simulationName={this.state.simulationName}
                    onSimulationNameChange={this.setSimulationName}
                  />
                </Grid>
                <Grid item>
                  <CardProtocolParameters
                    driversList={this.state.driversList}
                    simulationName={this.state.simulationName}
                    driverName={this.state.driverName}
                    popSize={this.state.popSize}
                    totalSimulations={this.state.totalSimulations}
                    onDriverNameChange={this.setDriverName}
                    onPopSizeChange={this.setPopSize}
                    onTotalSimulationsChange={this.setTotalSimulations}
                  />
                </Grid>
              </Grid>
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
