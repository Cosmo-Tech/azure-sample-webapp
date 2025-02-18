// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/styles';
import Graph from 'graphology';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import random from 'graphology-layout/random';
import Sigma from 'sigma';
import { CurrentScenarioSelector } from '../../components';
import { AppInsights } from '../../services/AppInsights';
import { STATUSES } from '../../state/commons/Constants';
// import { useSetApplicationErrorMessage } from '../../state/hooks/ApplicationHooks';
// import { parseError } from '../../utils/ErrorsUtils';
import { useInstance } from './InstanceHook';
import { fetchData } from './data';
import useStyles from './style';

const SIGMA_OPTIONS = {
  autoCenter: true,
  autoRescale: true,
  hideEdgesOnMove: false,
  hideLabelsOnMove: false,
  labelColor: { color: 'grey' },
};

const appInsights = AppInsights.getInstance();

const Instance = () => {
  const classes = useStyles();
  const theme = useTheme();
  // const setApplicationErrorMessage = useSetApplicationErrorMessage();

  const {
    datasets,
    organizationId,
    workspaceId,
    currentScenario,
    useRedirectionToScenario,
    useRedirectFromDisabledView,
    instanceViewConfig,
  } = useInstance();

  const sigmaContainerRef = useRef(null);
  const [graph, setGraph] = useState(new Graph());
  const [sigmaInstance, setSigmaInstance] = useState(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const redrawSigmaInstance = useCallback(
    (newGraph, clear = false) => {
      if (!sigmaContainerRef.current) return;

      if (sigmaInstance != null) {
        if (clear) sigmaInstance.graph.clear();
        if (newGraph) {
          setGraph(newGraph);
          sigmaInstance.setGraph(newGraph);
        }
        sigmaInstance.refresh();
      } else {
        setSigmaInstance(new Sigma(newGraph ?? graph, sigmaContainerRef.current, SIGMA_OPTIONS));
        if (newGraph) setGraph(newGraph);
      }
    },
    [graph, sigmaInstance]
  );

  // TODO: this code may content duplicated code from the Scenario view, refactoring might be needed
  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  const noScenario = currentScenario.data === null;
  const isSwitchingScenario = currentScenario.status === STATUSES.LOADING;

  useRedirectionToScenario();
  useRedirectFromDisabledView('instance');

  useEffect(() => {
    // Note that the "active" variable is necessary to prevent race conditions when the effect is called several times
    // (see https://stackoverflow.com/questions/61751728 for more info)
    let active = true;
    setIsLoadingData(true);
    loadData();
    return () => {
      active = false;
    };

    async function loadData() {
      if (noScenario) {
        setGraph(new Graph());
      } else {
        try {
          if (!currentScenario.data) return;

          const scenario = await fetchData(
            instanceViewConfig,
            organizationId,
            workspaceId,
            currentScenario.data,
            datasets
          );
          if (!active) return;
          if (scenario.error) throw Error(scenario.error);

          random.assign(scenario.data);
          forceAtlas2.assign(scenario.data, { iterations: 35 });
          redrawSigmaInstance(scenario.data, true);
        } catch (error) {
          console.error(error);
          // FIXME: show error in application error banner
          // setApplicationErrorMessage(parseError(error));
        }
      }
      setIsLoadingData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario.data?.id, theme]);

  useEffect(() => {
    redrawSigmaInstance(null, false);
  }, [redrawSigmaInstance, sigmaContainerRef, graph]);

  // useEffect(() => {
  //   redrawSigmaInstance(null, true);
  // }, [currentScenario.id]);

  return (
    <>
      <div className={classes.mainGrid}>
        <div className={classes.scenarioSelectGridItem}>
          <CurrentScenarioSelector />
        </div>
        <div className={classes.cytoscapeGridItem}>
          <Backdrop open={isLoadingData || isSwitchingScenario} className={classes.backdrop}>
            <CircularProgress data-cy="charts-loading-spinner" size={24} color="inherit" />
          </Backdrop>
          <div id="sigmaContainer" style={{ width: '100%', height: '100%' }} ref={sigmaContainerRef} />
        </div>
      </div>
    </>
  );
};

export default Instance;
