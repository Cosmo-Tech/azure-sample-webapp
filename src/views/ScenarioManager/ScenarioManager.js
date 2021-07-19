// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { ScenarioManagerTreeList } from '@cosmotech/ui';

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
  console.log('Trying to move scenario ' + scenarioId + ' under scenario ' +
    newParentId + '. This feature is not implemented yet.');
}

const ScenarioManager = (props) => {
  const classes = useStyles();

  const {
    datasets,
    scenarios,
    currentScenario
  } = props;

  return (
    <div className={classes.root}>
      <ScenarioManagerTreeList
        datasets={ datasets }
        scenarios={ scenarios }
        currentScenarioId={ currentScenario?.id }
        moveScenario={ moveScenario }
      />
    </div>
  );
};

ScenarioManager.propTypes = {
  datasets: PropTypes.array.isRequired,
  scenarios: PropTypes.array.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioManager;
