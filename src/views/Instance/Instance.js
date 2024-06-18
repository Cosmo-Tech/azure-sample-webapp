// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/styles';
import { CytoViz } from '@cosmotech/ui';
import { CurrentScenarioSelector } from '../../components';
import { AppInsights } from '../../services/AppInsights';
import { STATUSES } from '../../state/commons/Constants';
import { parseError } from '../../utils/ErrorsUtils';
import { useInstance } from './InstanceHook';
import { fetchData, processGraphElements } from './data';
import useStyles from './style';

const EXTRA_LAYOUTS = {
  breadthfirst: null,
};
const appInsights = AppInsights.getInstance();

const Instance = () => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    datasets,
    organizationId,
    workspaceId,
    currentScenario,
    useRedirectionToScenario,
    useRedirectFromInstanceToScenarioView,
    instanceViewConfig,
  } = useInstance();

  const [graphElements, setGraphElements] = useState([]);
  const [cytoscapeStylesheet, setCytoscapeStylesheet] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorBannerMessage, setErrorBannerMessage] = useState(null);

  // TODO: this code may content duplicated code from the Scenario view, refactoring might be needed
  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);

  const noScenario = currentScenario.data === null;

  const isSwitchingScenario = currentScenario.status === STATUSES.LOADING;

  useRedirectionToScenario();
  useRedirectFromInstanceToScenarioView();

  useEffect(() => {
    // Note that the "active" variable is necessary to prevent race conditions when the effect is called several times
    // (see https://stackoverflow.com/questions/61751728 for more info)
    let active = true;
    setErrorBannerMessage(null);
    setIsLoadingData(true);
    loadData();
    return () => {
      active = false;
    };

    async function loadData() {
      if (noScenario) {
        setGraphElements([]);
        setErrorBannerMessage(null);
        setIsLoadingData(false);
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

          // TODO: (refactor) to improve performance, we don't need to recompute the whole graph elements set when the
          // theme is changed, we could rebuild only the stylesheet
          const { graphElements: newGraphElements, stylesheet } = processGraphElements(
            instanceViewConfig,
            scenario.data,
            theme
          );

          setGraphElements(newGraphElements);
          setCytoscapeStylesheet(stylesheet);
          setErrorBannerMessage(null);
          setIsLoadingData(false);
        } catch (error) {
          console.error(error);
          setErrorBannerMessage(parseError(error));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario.data?.id, theme]);

  const cytoVizLabels = {
    elementDetails: t('commoncomponents.cytoviz.elementDetails', 'Details'),
    loading: t('commoncomponents.cytoviz.loading', 'Loading...'),
    noSelectedElement: t('commoncomponents.cytoviz.noSelectedElement', 'Select a node or edge to show its data'),
    settings: {
      compactMode: t('commoncomponents.cytoviz.settings.compactMode', 'Compact layout'),
      layout: t('commoncomponents.cytoviz.settings.layout', 'Layout'),
      title: t('commoncomponents.cytoviz.settings.title', 'Settings'),
      spacingFactor: t('commoncomponents.cytoviz.settings.spacingFactor', 'Spacing factor'),
      zoomLimits: t('commoncomponents.cytoviz.settings.zoomLimits', 'Min & max zoom'),
      open: t('commoncomponents.cytoviz.settings.opensettings', 'Open settings'),
      close: t('commoncomponents.cytoviz.settings.closesettings', 'Close settings'),
      showStats: t('commoncomponents.cytoviz.settings.showStats', 'Cytoscape statistics'),
    },
    elementData: {
      dictKey: t('commoncomponents.cytoviz.elementData.dictKey', 'Key'),
      dictValue: t('commoncomponents.cytoviz.elementData.dictValue', 'Value'),
      noData: t('commoncomponents.cytoviz.elementData.noData', 'No data to display for this element.'),
      attributes: {},
    },
    accordion: {
      nodeDetails: t('commoncomponents.cytoviz.accordion.nodeDetails', 'Node details'),
      findNode: {
        headline: t('commoncomponents.cytoviz.accordion.findNode.headline', 'Find a node'),
        searchByID: t('commoncomponents.cytoviz.accordion.findNode.searchByID', 'Search by ID'),
      },
      exploreGraph: {
        headline: t('commoncomponents.cytoviz.accordion.exploreGraph.headline', 'Explore a subgraph'),
        startingNodes: t(
          'commoncomponents.cytoviz.accordion.exploreGraph.startingNodes',
          'Select the starting node(s)'
        ),
        startingNodesError: t(
          'commoncomponents.cytoviz.accordion.exploreGraph.startingNodesError',
          'Select at least one node'
        ),
        limitDepth: t('commoncomponents.cytoviz.accordion.exploreGraph.limitDepth', 'Limit the search depth'),
        limitDepthError: t(
          'commoncomponents.cytoviz.accordion.exploreGraph.limitDepthError',
          'Enter a positive integer'
        ),
        flowDirection: t('commoncomponents.cytoviz.accordion.exploreGraph.flowDirection', 'Choose the flow direction'),
        flowDirectionError: t(
          'commoncomponents.cytoviz.accordion.exploreGraph.flowDirectionError',
          'Select at least one'
        ),
        inEdges: t('commoncomponents.cytoviz.accordion.exploreGraph.inEdges', 'IN-Edges'),
        outEdges: t('commoncomponents.cytoviz.accordion.exploreGraph.outEdges', 'OUT-Edges'),
        excludeEdges: t('commoncomponents.cytoviz.accordion.exploreGraph.excludeEdges', 'Exclude relation types'),
        compoundNeighbors: t(
          'commoncomponents.cytoviz.accordion.exploreGraph.compoundNeighbors',
          'Include the other entities of a compound'
        ),
        launch: t('commoncomponents.cytoviz.accordion.exploreGraph.launch', 'Explore'),
      },
    },
    errorBanner: {
      dismissButtonText: t('commoncomponents.banner.button.dismiss', 'Dismiss'),
      tooLongErrorMessage: t(
        'commoncomponents.banner.tooLongErrorMessage',
        'Detailed error message is too long to be displayed. To read it, please use the COPY button and paste it ' +
          'in your favorite text editor.'
      ),
      secondButtonText: t('commoncomponents.banner.button.copy.label', 'Copy'),
      toggledButtonText: t('commoncomponents.banner.button.copy.copied', 'Copied'),
    },
  };

  const defaultSettings = {
    layout: 'breadthfirst',
    minZoom: 0.1,
    maxZoom: 1,
    useCompactMode: true,
    spacingFactor: 1,
  };

  let cytoVizPlaceholderMessage = null;
  if (noScenario) {
    cytoVizPlaceholderMessage = t(
      'commoncomponents.cytoviz.placeholder.noScenario',
      'No scenario. You can create a new scenario in the Scenario view.'
    );
  }
  if (errorBannerMessage) {
    cytoVizPlaceholderMessage = t(
      'commoncomponents.cytoviz.placeholder.error',
      'An error occured, cannot visualize data.'
    );
  }
  return (
    <>
      <div className={classes.mainGrid}>
        <div className={classes.scenarioSelectGridItem}>
          <CurrentScenarioSelector />
        </div>
        <div className={classes.cytoscapeGridItem}>
          <CytoViz
            cytoscapeStylesheet={cytoscapeStylesheet}
            elements={graphElements}
            error={errorBannerMessage}
            labels={cytoVizLabels}
            loading={isSwitchingScenario || isLoadingData}
            extraLayouts={EXTRA_LAYOUTS}
            defaultSettings={defaultSettings}
            placeholderMessage={cytoVizPlaceholderMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Instance;
