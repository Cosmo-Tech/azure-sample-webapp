// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { TextField } from '@material-ui/core'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { ScenarioUtils } from '@cosmotech/core'
import { useTranslation } from 'react-i18next'

const useStyles = theme => ({
  textfield: {
    borderColor: '#FFFFFF'
  }
})

const DropdownScenario = (props) => {
  const { t } = useTranslation()

  const scenarioOptions = []
  const getScenarioOption = (scenarioOptions, node, depth) => {
    for (const sc of node) {
      sc.optionLabel = '\xa0'.repeat(depth * 3) + t('commoncomponents.dropdown.scenario.label', 'Scenario ') + sc.id
      scenarioOptions.push(sc)
      if (sc.children.length > 0) {
        getScenarioOption(scenarioOptions, sc.children, depth + 1)
      }
    }
  }
  getScenarioOption(scenarioOptions, ScenarioUtils.getScenarioTree(), 0)

  return (
    <Autocomplete
      id="dd_scenario"
      onChange={(event, newScenario) => (props.setScenario(newScenario.type)) }
      options={scenarioOptions}
      getOptionLabel={(option) => option.optionLabel }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('commoncomponents.dropdown.scenario.label', 'Scenario ')}
          label={t('commoncomponents.dropdown.scenario.label', 'Scenario ')}
          variant="outlined"
        />
      )}
    />
  )
}

DropdownScenario.propTypes = {
  classes: PropTypes.any,
  setScenario: PropTypes.func
}

export default withStyles(useStyles)(DropdownScenario)
