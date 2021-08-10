// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { ScenarioManagerTreeList } from '@cosmotech/ui';
import { WORKSPACE_ID } from '../../config/AppInstance';

const useStyles = makeStyles(theme => ({
  root: {
    margin: 'auto',
    height: '100%',
    width: '100%'
  }
}));

function moveScenario (moveData) {
  const scenarioId = moveData.node?.id;
  const newParentId = moveData.nextParentNode?.id;
  console.warn('Trying to move scenario ' + scenarioId + ' under scenario ' +
    newParentId + '. This feature is not implemented yet.');
}

const ScenarioManager = (props) => {
  const classes = useStyles();

  const {
    currentScenario,
    datasets,
    deleteScenario,
    findScenarioById,
    scenarios,
    resetCurrentScenario,
    userId
  } = props;

  function onScenarioDelete (scenarioId) {
    const lastScenarioDelete = scenarios.length === 1;
    deleteScenario(WORKSPACE_ID, scenarioId);
    if (scenarioId === currentScenario.id) {
      if (lastScenarioDelete) {
        resetCurrentScenario();
      } else {
        findScenarioById(WORKSPACE_ID, scenarios[0].id);
      }
    }
  }

  return (
    <div className={classes.root}>
      <ScenarioManagerTreeList
        datasets={datasets}
        scenarios={scenarios}
        currentScenarioId={currentScenario?.id}
        userId={userId}
        deleteScenario={onScenarioDelete}
        moveScenario={moveScenario}
      />
    </div>
  );
};

ScenarioManager.propTypes = {
  currentScenario: PropTypes.object,
  datasets: PropTypes.array.isRequired,
  deleteScenario: PropTypes.func.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  scenarios: PropTypes.array.isRequired,
  resetCurrentScenario: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired
};

export default ScenarioManager;
