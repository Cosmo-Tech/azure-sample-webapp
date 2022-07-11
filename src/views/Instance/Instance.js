// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CytoViz, HierarchicalComboBox } from '@cosmotech/ui';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { sortScenarioList } from '../../utils/SortScenarioListUtils';
import { parseError } from '../../utils/ErrorsUtils';
import { STATUSES } from '../../state/commons/Constants';
import { AppInsights } from '../../services/AppInsights';
import { fetchData, processGraphElements } from './data';
import useStyles from './style';

const EXTRA_LAYOUTS = {
  breadthfirst: null,
};
const appInsights = AppInsights.getInstance();

const Instance = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { currentScenario, scenarioList, findScenarioById, workspace } = props;
  const [graphElements, setGraphElements] = useState([]);
  const [cytoscapeStylesheet, setCytoscapeStylesheet] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [errorBannerMessage, setErrorBannerMessage] = useState(null);

  // TODO: this code may content duplicated code from the Scenario view, refactoring might be needed
  useEffect(() => {
    appInsights.setScenarioData(currentScenario.data);
  }, [currentScenario]);
  const workspaceId = workspace.data.id;
  const handleScenarioChange = (event, scenario) => {
    if (scenario.id !== currentScenario.data?.id) {
      setIsLoadingData(true);
    }
    findScenarioById(workspaceId, scenario.id);
  };
  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = scenarioList === null || noScenario;
  const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');
  const showBackdrop = currentScenario.status === STATUSES.LOADING;

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
          const scenario = await fetchData(currentScenario.data?.id);
          const { graphElements: newGraphElements, stylesheet } = await processGraphElements(scenario.data);

          if (active) {
            setGraphElements(newGraphElements);
            setCytoscapeStylesheet(stylesheet);
            setErrorBannerMessage(null);
            setIsLoadingData(false);
          }
        } catch (error) {
          setErrorBannerMessage(parseError(error));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario.data?.id]);

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
    },
    elementData: {
      dictKey: t('commoncomponents.cytoviz.elementData.dictKey', 'Key'),
      dictValue: t('commoncomponents.cytoviz.elementData.dictValue', 'Value'),
      noData: t('commoncomponents.cytoviz.elementData.noData', 'No data to display for this element.'),
      attributes: {},
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
      <Backdrop className={classes.backdrop} open={showBackdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className={classes.mainGrid}>
        <div className={classes.scenarioSelectGridItem}>
          <HierarchicalComboBox
            value={currentScenario.data}
            values={sortedScenarioList}
            label={scenarioListLabel}
            handleChange={handleScenarioChange}
            disabled={scenarioListDisabled}
          />
        </div>
        <div className={classes.cytoscapeGridItem}>
          <CytoViz
            cytoscapeStylesheet={cytoscapeStylesheet}
            elements={graphElements}
            error={errorBannerMessage}
            labels={cytoVizLabels}
            loading={isLoadingData}
            extraLayouts={EXTRA_LAYOUTS}
            defaultSettings={defaultSettings}
            placeholderMessage={cytoVizPlaceholderMessage}
          />
        </div>
      </div>
    </>
  );
};

Instance.propTypes = {
  currentScenario: PropTypes.object.isRequired,
  findScenarioById: PropTypes.func.isRequired,
  scenarioList: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
};

export default Instance;
