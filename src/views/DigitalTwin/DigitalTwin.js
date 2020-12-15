import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Box } from '@material-ui/core'
import apiConfig from '../../service/api'
import {
  ButtonRunSimulation,
  ButtonRunProtocol
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
  }
})

class DigitalTwin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scenarioName: 'Simulation',
      driverName: 'custom-drivers/Supplychain.zip',
      popSize: 48,
      totalSimulations: 200
    }
  }

  render () {
    const { classes } = this.props
    return (
      <Box component='main' display='flex' flexDirection='column' height='100%'>
        <Box className={classes.toolbar}>
          <Box className={classes.toolbarActions}>
            <ButtonRunSimulation
              apiConfig={apiConfig}
              scenarioName={this.state.scenarioName}
            />
            <ButtonRunProtocol
              apiConfig={apiConfig}
              scenarioName={this.state.scenarioName}
              driverName={this.state.driverName}
              popSize={this.state.popSize}
              totalSimulations={this.state.totalSimulations}
            />
          </Box>
        </Box>
        <Box className={classes.digitalTwinPanel}>
        </Box>
      </Box>
    )
  }
}

DigitalTwin.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(DigitalTwin)
