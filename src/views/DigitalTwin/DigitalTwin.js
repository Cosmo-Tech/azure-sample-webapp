import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import apiConfig from '../../service/api'
import {
  ButtonRunSimulation,
  ButtonRunProtocol
} from '../../components'

const useStyles = theme => ({
  root: {
    margin: 'auto',
    width: '100%'
  }
})

class DigitalTwin extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      scenarioName: 'Simulation',
      driverName: 'custom-drivers/Supplychain.zip'
    }
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <ButtonRunSimulation
          apiConfig={apiConfig}
          scenarioName={this.state.scenarioName}/>
        <ButtonRunProtocol
          apiConfig={apiConfig}
          driverName={this.state.driverName}/>
      </div>
    )
  }
}

DigitalTwin.propTypes = {
  classes: PropTypes.any
}

export default withStyles(useStyles)(DigitalTwin)
