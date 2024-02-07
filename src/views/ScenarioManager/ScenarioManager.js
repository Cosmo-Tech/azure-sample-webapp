// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { ScenarioUtils, ResourceUtils } from '@cosmotech/core';
import { ScenarioManagerTreeList } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../services/config/accessControl';
import { useScenarioManager } from './ScenarioManagerHook';
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
    `Trying to move scenario "${scenarioId}" under scenario "${newParentId}". This feature is not implemented yet.`
  );
}

const ScenarioManager = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const labels = getScenarioManagerLabels(t);

  const {
    scenarios,
    datasets,
    currentScenarioData,
    userId,
    hasUserPermissionOnScenario,
    setCurrentScenario,
    deleteScenario,
    renameScenario,
    resetCurrentScenario,
    workspaceId,
  } = useScenarioManager();

  const getScenarioListAfterDelete = useCallback(
    (idOfScenarioToDelete) => {
      const scenarioListAfterDelete = scenarios
        .map((scenario) => {
          const newScenario = { ...scenario };
          if (newScenario.parentId === idOfScenarioToDelete) {
            newScenario.parentId = currentScenarioData.parentId;
          }
          return newScenario;
        })
        .filter((scenario) => scenario.id !== idOfScenarioToDelete);

      return scenarioListAfterDelete;
    },
    [currentScenarioData?.parentId, scenarios]
  );

  const onScenarioDelete = useCallback(
    (scenarioId) => {
      const lastScenarioDelete = scenarios.length === 1;
      deleteScenario(scenarioId);
      if (scenarioId === currentScenarioData?.id) {
        if (lastScenarioDelete) {
          resetCurrentScenario();
        } else {
          setCurrentScenario(ResourceUtils.getFirstRootResource(getScenarioListAfterDelete(scenarioId)));
        }
      }
    },
    [
      currentScenarioData?.id,
      deleteScenario,
      getScenarioListAfterDelete,
      resetCurrentScenario,
      scenarios.length,
      setCurrentScenario,
    ]
  );

  const onScenarioRename = useCallback(
    (scenarioId, newScenarioName) => {
      if (scenarioId === currentScenarioData?.id) {
        setCurrentScenario({ name: newScenarioName });
      }
      renameScenario(scenarioId, newScenarioName);
    },
    [currentScenarioData?.id, renameScenario, setCurrentScenario]
  );

  const checkScenarioNameValue = useCallback(
    (newScenarioName) => {
      const errorKey = ScenarioUtils.scenarioNameIsValid(newScenarioName, scenarios);
      if (errorKey) {
        const errorLabel = labels.scenarioRename.errors[errorKey];
        if (!errorLabel) {
          console.warn('Scenario error label key is broken!');
          return 'Scenario name is invalid';
        }
        return errorLabel;
      }
      return null;
    },
    [labels.scenarioRename.errors, scenarios]
  );

  const buildDatasetLabel = useCallback(
    (datasetList) => {
      return t('commoncomponents.scenariomanager.treelist.node.dataset', { count: datasetList?.length || 0 });
    },
    [t]
  );

  const buildScenarioNameToDelete = useCallback(
    (scenarioName) => {
      return t('commoncomponents.dialog.confirm.delete.title', "Remove scenario '{{scenarioName}}'?", {
        scenarioName,
      });
    },
    [t]
  );

  const navigate = useNavigate();
  const onScenarioRedirect = useCallback(
    (scenarioId) => {
      navigate(`/${workspaceId}/scenario/${scenarioId}`);
    },
    [navigate, workspaceId]
  );

  const canUserDeleteScenario = useCallback(
    (scenario) => hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.DELETE, scenario),
    [hasUserPermissionOnScenario]
  );
  const canUserRenameScenario = useCallback(
    (scenario) => hasUserPermissionOnScenario(ACL_PERMISSIONS.SCENARIO.WRITE, scenario),
    [hasUserPermissionOnScenario]
  );

  return (
    <div className={classes.root}>
      <ScenarioManagerTreeList
        datasets={datasets}
        scenarios={scenarios}
        currentScenarioId={currentScenarioData?.id}
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

ScenarioManager.propTypes = {};

export default ScenarioManager;
