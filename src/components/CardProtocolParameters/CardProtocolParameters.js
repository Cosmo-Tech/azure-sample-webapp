// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Card, Input, MenuItem, Select, Slider, Typography } from '@material-ui/core'
import { ButtonRunProtocol } from '../../components'
import API_CONFIG from '../../configs/Api.config'
import { useTranslation } from 'react-i18next'

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
  slider: {
    marginRight: '16px',
    marginLeft: '16px',
    paddingTop: '0px',
    paddingBottom: '2px',
    width: 100
  },
  input: {
    width: 56
  },
  buttonContainer: {
    marginTop: '16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  }
})

const CardProtocolParameters = (props) => {
  const { t } = useTranslation()

  const onDriverNameChange = (event) => { props.onDriverNameChange(event.target.value) }

  const onPopSizeSliderChange = (event, newValue) => { props.onPopSizeChange(newValue) }

  const onPopSizeInputChange = (event) => {
    props.onPopSizeChange(
      event.target.value === ''
        ? props.popDefaultValue
        : Number(event.target.value))
  }

  const onTotalSimulationsSliderChange = (event, newValue) => { props.onTotalSimulationsChange(newValue) }

  const onTotalSimulationsInputChange = (event) => {
    props.onTotalSimulationsChange(
      event.target.value === ''
        ? props.totalSimulationsDefaultValue
        : Number(event.target.value))
  }

  return (
      <Card className={props.classes.card} raised>
        <Typography variant='h5' component='h2' className={props.classes.title}>
          {t('commoncomponents.card.protocol.parameters.title.protocol.parameters', 'Protocol parameters')}
        </Typography>
        <div className={props.classes.parameter}>
          <Typography className={props.classes.label} component='span'>
            {t('commoncomponents.card.protocol.parameters.text.driver.name', 'Driver name')}:
          </Typography>
          <Select
            className={props.classes.select}
            labelId='protocol-parameters-driver-name'
            id='driver-name-select'
            value={ props.driverName }
            onChange={onDriverNameChange}>
            { generateMenuItems(props.driversList) }
          </Select>
        </div>
        {/* TODO create a custom component "Typography-Slider-Input" */}
        <div className={props.classes.parameter}>
          <Typography className={props.classes.label} component='span'>
            {t('commoncomponents.card.protocol.parameters.text.population.size', 'Population size')}:
          </Typography>
          <Slider
            className={props.classes.slider}
            value={props.popSize}
            min={props.popMin}
            max={props.popMax}
            onChange={onPopSizeSliderChange}
            aria-labelledby="protocol-parameters-population-size-slider"
          />
          <Input
            className={props.classes.input}
            value={props.popSize}
            margin="dense"
            onChange={onPopSizeInputChange}
            inputProps={{
              step: 10,
              min: props.popMin,
              max: props.popMax,
              type: 'number',
              'aria-labelledby': 'protocol-parameters-population-size-slider'
            }}
          />
        </div>
        {/* TODO create a custom component "Typography-Slider-Input" */}
        <div className={props.classes.parameter}>
          <Typography className={props.classes.label} component='span'>
            {t('commoncomponents.card.protocol.parameters.text.total.simulations', 'Total simulations')}:
          </Typography>
          <Slider
            className={props.classes.slider}
            value={props.totalSimulations}
            min={props.totalSimulationsMin}
            max={props.totalSimulationsMax}
            onChange={onTotalSimulationsSliderChange}
            aria-labelledby="protocol-parameters-total-simulations-slider"
          />
          <Input
            className={props.classes.input}
            value={props.totalSimulations}
            margin="dense"
            onChange={onTotalSimulationsInputChange}
            inputProps={{
              step: 10,
              min: props.totalSimulationsMin,
              max: props.totalSimulationsMax,
              type: 'number',
              'aria-labelledby': 'protocol-parameters-total-simulations-slider'
            }}
          />
        </div>
        <div className={props.classes.buttonContainer}>
          <ButtonRunProtocol
            apiConfig={API_CONFIG}
            simulationName={props.simulationName}
            driverName={props.driverName}
            popSize={props.popSize}
            totalSimulations={props.totalSimulations}
          />
        </div>
      </Card>
  )
}
// TODO handle ref component correctly to avoid error message in console
function generateMenuItems (simulations) {
  return simulations.map((simulationName, index) => {
    return (
      <MenuItem key={index} value={simulationName}>
        {simulationName}
      </MenuItem>
    )
  })
}

CardProtocolParameters.propTypes = {
  classes: PropTypes.any,
  simulationName: PropTypes.string.isRequired,
  driversList: PropTypes.array.isRequired,
  driverName: PropTypes.string.isRequired,
  popSize: PropTypes.number.isRequired,
  totalSimulations: PropTypes.number.isRequired,
  onDriverNameChange: PropTypes.func.isRequired,
  onPopSizeChange: PropTypes.func.isRequired,
  onTotalSimulationsChange: PropTypes.func.isRequired,
  totalSimulationsMin: PropTypes.number,
  totalSimulationsMax: PropTypes.number,
  totalSimulationsDefaultValue: PropTypes.number,
  popMin: PropTypes.number,
  popMax: PropTypes.number,
  popDefaultValue: PropTypes.number
}

export default withStyles(useStyles)(CardProtocolParameters)
