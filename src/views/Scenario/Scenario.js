// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Box, Grid } from '@material-ui/core'
import {
  CardSimulationParameters,
  CardProtocolParameters,
  IframeScenarioResults
} from '../../components'
import { useTranslation } from 'react-i18next'

const useStyles = theme => ({
  root: {
    height: '100%'
  },
  scenarioPanel: {
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

const Scenario = ({
  classes,
  scenarioList,
  currentScenario,
  getScenarioListAction
}) => {
  useEffect(() => {
    getScenarioListAction()
  }, [getScenarioListAction])

  // TODO remove eslint warning when information will be retrieved from api calls
  // eslint-disable-next-line no-unused-vars
  const [simulators, setSimulators] = useState(['supplychain', 'supplychaindemo'])
  // eslint-disable-next-line no-unused-vars
  const [drivers, setDrivers] = useState(['Supplychain.zip'])
  const { t } = useTranslation()
  const [parameterInfo, setParameterInfo] = useState(
    {
      popSize: 48,
      popDefaultValue: 48,
      popMin: 1,
      popMax: 1000,
      totalSimulations: 200,
      totalSimulationsDefaultValue: 200,
      totalSimulationsMin: 1,
      totalSimulationsMax: 1000
    }
  )
  const [simulationInfo, setSimulationInfo] = useState(
    {
      simulationName: 'Simulation',
      simulatorName: 'supplychain',
      driverName: 'Supplychain.zip'
    }
  )

  const setSimulationName = (newSimulationName) => {
    setSimulationInfo({ ...simulationInfo, simulationName: newSimulationName })
  }

  const setSimulatorName = (newSimulatorName) => {
    setSimulationInfo({ ...simulationInfo, simulatorName: newSimulatorName })
  }

  const setDriverName = (newDriverName) => {
    setSimulationInfo({ ...simulationInfo, driverName: newDriverName })
  }

  const setPopSize = (newPopSize) => {
    setParameterInfo({ ...parameterInfo, popSize: newPopSize })
  }

  const setTotalSimulations = (newTotalSimulations) => {
    setParameterInfo({ ...parameterInfo, totalSimulations: newTotalSimulations })
  }

  return (
      <Box component='main' display='flex' flexDirection='column'
          className={classes.root}>
        <Box className={classes.scenarioPanel}>
          <Grid container spacing={2} className={classes.mainGrid}>
            <Grid item xs={9}>
              <IframeScenarioResults
              cardStyle={ { height: '100%', width: '100%' } }
              iframeTitle={t('commoncomponents.iframe.scenario.results.iframe.title', 'Supply Chain results')}
              cardTitle={t('commoncomponents.iframe.scenario.results.card.title', 'Results')}
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
                    simulatorsList={simulators}
                    simulationsList={scenarioList}
                    simulationName={simulationInfo.simulationName}
                    simulatorName={simulationInfo.simulatorName}
                    onSimulationNameChange={setSimulationName}
                    onSimulatorNameChange={setSimulatorName}
                  />
                </Grid>
                <Grid item>
                  <CardProtocolParameters
                    driversList={drivers}
                    simulationName={simulationInfo.simulationName}
                    driverName={simulationInfo.driverName}
                    popSize={parameterInfo.popSize}
                    popMin={parameterInfo.popMin}
                    popMax={parameterInfo.popMax}
                    popDefaultValue={parameterInfo.popDefaultValue}
                    totalSimulations={parameterInfo.totalSimulations}
                    totalSimulationsMin={parameterInfo.totalSimulationsMin}
                    totalSimulationsMax={parameterInfo.totalSimulationsMax}
                    totalSimulationsDefaultValue={parameterInfo.totalSimulationsDefaultValue}
                    onDriverNameChange={setDriverName}
                    onPopSizeChange={setPopSize}
                    onTotalSimulationsChange={setTotalSimulations}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Box>
  )
}

Scenario.propTypes = {
  classes: PropTypes.any,
  scenarioList: PropTypes.array.isRequired,
  currentScenario: PropTypes.object,
  getScenarioListAction: PropTypes.func.isRequired
}

export default withStyles(useStyles)(Scenario)
