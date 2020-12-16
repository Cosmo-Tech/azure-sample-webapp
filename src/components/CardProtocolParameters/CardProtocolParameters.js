import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import {
  Card,
  // Grid,
  Input,
  MenuItem,
  Select,
  Slider,
  Typography
} from '@material-ui/core'

const useStyles = theme => ({
  card: {
    height: '100%',
    color: '#FFFFFF',
    backgroundColor: theme.palette.background.secondary,
    margin: '8px'
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
  slider: {
    marginRight: '16px',
    marginLeft: '16px',
    paddingTop: '0px',
    paddingBottom: '2px',
    width: 100
  },
  input: {
    width: 56
  }
})

const POP_SIZE_MIN = 1
const POP_SIZE_MAX = 1000
const TOTAL_SIMS_MIN = 1
const TOTAL_SIMS_MAX = 1000

class CardProtocolParameters extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
    }

    // Bind methods
    this.onDriverNameChange = this.onDriverNameChange.bind(this)
    this.onPopSizeSliderChange = this.onPopSizeSliderChange.bind(this)
    this.onPopSizeInputChange = this.onPopSizeInputChange.bind(this)
    this.onTotalSimulationsSliderChange =
      this.onTotalSimulationsSliderChange.bind(this)
    this.onTotalSimulationsInputChange =
      this.onTotalSimulationsInputChange.bind(this)
  }

  onDriverNameChange (event) {
    this.props.onDriverNameChange(event.target.value)
  }

  onPopSizeSliderChange (event, newValue) {
    this.props.onPopSizeChange(newValue)
  }

  onPopSizeInputChange (event) {
    this.props.onPopSizeChange(event.target.value === ''
      ? 48
      : Number(event.target.value))
  }

  onTotalSimulationsSliderChange (event, newValue) {
    this.props.onTotalSimulationsChange(newValue)
  }

  onTotalSimulationsInputChange (event) {
    this.props.onTotalSimulationsChange(event.target.value === ''
      ? 200
      : Number(event.target.value))
  }

  render () {
    const { classes } = this.props
    return (
      <Card className={classes.card} raised>
        <Typography variant='h5' component='h2' className={classes.title}>
          Protocol parameters
        </Typography>
        <div className={classes.parameter}>
          <Typography className={classes.label} component='span'>
            Driver name:
          </Typography>
          <Select
            className={classes.select}
            labelId='protocol-parameters-driver-name'
            id='driver-name-select'
            value={ this.props.driverName }
            onChange={this.onDriverNameChange}>
            { generateMenuItems(this.props.driversList) }
          </Select>
        </div>
        <div className={classes.parameter}>
          <Typography className={classes.label} component='span'>
            Population size:
          </Typography>
          <Slider
            className={classes.slider}
            value={this.props.popSize}
            min={POP_SIZE_MIN}
            max={POP_SIZE_MAX}
            onChange={this.onPopSizeSliderChange}
            aria-labelledby="protocol-parameters-population-size-slider"
          />
          <Input
            className={classes.input}
            value={this.props.popSize}
            margin="dense"
            onChange={this.onPopSizeInputChange}
            inputProps={{
              step: 10,
              min: POP_SIZE_MIN,
              max: POP_SIZE_MAX,
              type: 'number',
              'aria-labelledby': 'protocol-parameters-population-size-slider'
            }}
          />
        </div>
        <div className={classes.parameter}>
          <Typography className={classes.label} component='span'>
            Total simulations:
          </Typography>
          <Slider
            className={classes.slider}
            value={this.props.totalSimulations}
            min={TOTAL_SIMS_MIN}
            max={TOTAL_SIMS_MAX}
            onChange={this.onTotalSimulationsSliderChange}
            aria-labelledby="protocol-parameters-total-simulations-slider"
          />
          <Input
            className={classes.input}
            value={this.props.totalSimulations}
            margin="dense"
            onChange={this.onTotalSimulationsInputChange}
            inputProps={{
              step: 10,
              min: TOTAL_SIMS_MIN,
              max: TOTAL_SIMS_MAX,
              type: 'number',
              'aria-labelledby': 'protocol-parameters-total-simulations-slider'
            }}
          />
        </div>
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

CardProtocolParameters.propTypes = {
  classes: PropTypes.any,
  driversList: PropTypes.array.isRequired,
  driverName: PropTypes.string.isRequired,
  popSize: PropTypes.number.isRequired,
  totalSimulations: PropTypes.number.isRequired,
  onDriverNameChange: PropTypes.func.isRequired,
  onPopSizeChange: PropTypes.func.isRequired,
  onTotalSimulationsChange: PropTypes.func.isRequired
}

export default withStyles(useStyles)(CardProtocolParameters)
