// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ScenarioUtils } from '@cosmotech/core';
import { makeStyles } from '@material-ui/core';
import { ScenarioManagerTreeList } from '@cosmotech/ui';
import { WORKSPACE_ID } from '../../config/GlobalConfiguration';
import { useTranslation } from 'react-i18next';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useHasUserPermissionOnScenario } from '../../state/hooks/SecurityHooks';
import { getFirstScenarioMaster } from '../../utils/SortScenarioListUtils';
import { getScenarioManagerLabels } from './labels';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'fixed',
    margin: 'auto',
    height: '100%',
    width: '100%',
  },
}));

function moveScenario(moveData) {
  const scenarioId = moveData.node?.id;
  const newParentId = moveData.nextParentNode?.id;
  console.warn(
    'Trying to move scenario ' +
      scenarioId +
      ' under scenario ' +
      newParentId +
      '. This feature is not implemented yet.'
  );
}

const ScenarioManager = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const hasUserPermissionOnScenario = useHasUserPermissionOnScenario();
  const labels = getScenarioManagerLabels(t);

  const {
    currentScenario,
    datasets,
    deleteScenario,
    renameScenario,
    findScenarioById,
    scenarios,
    resetCurrentScenario,
    setCurrentScenario,
    userId,
  } = props;

  const getScenariolistAfterDelete = (idOfScenarioToDelete) => {
    const scenarioListAfterDelete = scenarios
      .map((scenario) => {
        const newScenario = { ...scenario };
        if (newScenario.parentId === idOfScenarioToDelete) {
          newScenario.parentId = currentScenario.parentId;
        }
        return newScenario;
      })
      .filter((scenario) => scenario.id !== idOfScenarioToDelete);

    return scenarioListAfterDelete;
  };

  function onScenarioDelete(scenarioId) {
    const lastScenarioDelete = scenarios.length === 1;
    deleteScenario(WORKSPACE_ID, scenarioId);
    if (scenarioId === currentScenario.id) {
      if (lastScenarioDelete) {
        resetCurrentScenario();
      } else {
        setCurrentScenario(getFirstScenarioMaster(getScenariolistAfterDelete(scenarioId)));
      }
    }
  }

  function onScenarioRename(scenarioId, newScenarioName) {
    if (scenarioId === currentScenario.id) {
      setCurrentScenario({ name: newScenarioName });
    }
    renameScenario(WORKSPACE_ID, scenarioId, newScenarioName);
  }

  function checkScenarioNameValue(newScenarioName) {
    const errorKey = ScenarioUtils.scenarioNameIsValid(newScenarioName, scenarios);
    if (errorKey) {
      const errorLabel = labels.scenarioRename.errors[errorKey];
      if (!errorLabel) {
        console.warn('Scenario error label key is broken !');
        return 'Scenario name is invalid';
      }
      return errorLabel;
    }
    return null;
  }

  function buildDatasetLabel(datasetList) {
    return t('commoncomponents.scenariomanager.treelist.node.dataset', { count: datasetList?.length || 0 });
  }

  function buildScenarioNameToDelete(scenarioName) {
    return t('commoncomponents.dialog.confirm.delete.title', "Remove scenario '{{scenarioName}}'?", {
      scenarioName,
    });
  }

  const navigate = useNavigate();

  const isWaitingForRedirection = useRef(false);
  useEffect(() => {
    if (isWaitingForRedirection.current === true) {
      navigate('/scenario');
      isWaitingForRedirection.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario]);

  const onScenarioRedirect = (scenarioId) => {
    isWaitingForRedirection.current = true;
    findScenarioById(WORKSPACE_ID, scenarioId);
  };

  const canUserDeleteScenario = (scenario) => hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.DELETE, scenario);
  const canUserRenameScenario = (scenario) => hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.WRITE, scenario);

  return (
    <div className={classes.root}>
      <ScenarioManagerTreeList
        datasets={datasets}
        scenarios={scenarios}
        currentScenarioId={currentScenario?.id}
        userId={userId}
        onScenarioRedirect={onScenarioRedirect}
        deleteScenario={onScenarioDelete}
        onScenarioRename={onScenarioRename}
        checkScenarioNameValue={checkScenarioNameValue}
        moveScenario={moveScenario}
        buildDatasetInfo={buildDatasetLabel}
        labels={labels}
        buildScenarioNameToDelete={buildScenarioNameToDelete}
        canUserDeleteScenario={canUserDeleteScenario}
        canUserRenameScenario={canUserRenameScenario}
      />
    </div>
  );
};

ScenarioManager.propTypes = {
  currentScenario: PropTypes.object,
  datasets: PropTypes.array.isRequired,
  deleteScenario: PropTypes.func.isRequired,
  renameScenario: PropTypes.func.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  scenarios: PropTypes.array.isRequired,
  resetCurrentScenario: PropTypes.func.isRequired,
  setCurrentScenario: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default ScenarioManager;
