// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import JSONscenario from '../../views/Scenario/GetScenariosTree.json'

const useStyles = theme => ({
  button: {
    margin: '2px'
  }
})

const DropdownScenario = (props) => {
  JSONscenario.sort()
  const scenarioTree = []
  for (const scParent of JSONscenario) {
    if (scParent.parentId === undefined) {
      scenarioTree.push(scParent)
    }
    scParent.children = []
    for (const scChild of JSONscenario) {
      if (scChild.parentId === scParent.id) {
        scParent.children.push(scChild)
      }
    }
  }

  const scenarioOptions = []
  const getScenarioOption = (scenarioOptions, node, depth) => {
    for (const sc of node) {
      sc.optionLabel = '\xa0'.repeat(depth * 3) + 'Scenario ' + sc.id
      scenarioOptions.push(sc)
      if (sc.children.length > 0) {
        getScenarioOption(scenarioOptions, sc.children, depth + 1)
      }
    }
  }
  getScenarioOption(scenarioOptions, scenarioTree, 0)

  const [selectedScenario, setSelectedScenario] = useState(null)

  return (
    <Autocomplete
      id="dd_scenario"
      value={selectedScenario}
      onChange={(event, newScenario) => setSelectedScenario(newScenario)}
      options={scenarioOptions}
      getOptionLabel={(option) => option.optionLabel }
      style={{ width: '100%', marginLeft: '20px', paddingRight: '30px', borderColor: '#FFFFFF' }}
      renderInput={(params) => (
        <TextField {...params} placeholder="Scenario" label="Scenario" variant="outlined"/>
      )}
    />
  )
}

DropdownScenario.propTypes = {
  classes: PropTypes.any,
  onSimulationStarted: PropTypes.func,
  simulationName: PropTypes.string.isRequired,
  simulatorName: PropTypes.string.isRequired,
  apiConfig: PropTypes.shape({
    simulator: PropTypes.string.isRequired
  })
}

export default withStyles(useStyles)(DropdownScenario)
