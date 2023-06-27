// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { HierarchicalComboBox, BasicToggleInput } from '@cosmotech/ui';
import { sortScenarioList } from '../../../utils/SortScenarioListUtils';
import { fetchData, processGraphElements } from './data';
import { fetchDataTG, fetchDataSample, processGraphElementsTG } from './dataTwinGraph';
import useStyles from './style';
import { useTheme } from '@mui/styles';
import { useInstance } from './InstanceHook';
import G6Viz from './G6Viz';

const Instance = ({ setG6Viz }) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    organizationId,
    workspaceId,
    scenarioList,
    currentScenario,
    findScenarioById,
    useRedirectionToScenario,
    instanceViewConfig,
  } = useInstance();

  const [graphData, setGraphData] = useState(null);

  const handleScenarioChange = (event, scenario) => {
    findScenarioById(scenario.id);
  };
  const sortedScenarioList = sortScenarioList(scenarioList.data.slice());
  const noScenario = currentScenario.data === null;
  const scenarioListDisabled = scenarioList === null || noScenario;
  const scenarioListLabel = noScenario ? null : t('views.scenario.dropdown.scenario.label', 'Scenario');

  useRedirectionToScenario(sortedScenarioList);

  useEffect(() => {
    loadData();

    async function loadData() {
      if (noScenario) {
        setGraphData(null);
      } else {
        /*
        const scenario = await fetchData(instanceViewConfig, organizationId, workspaceId, currentScenario.data?.id);
        // TODO: (refactor) to improve performance, we don't need to recompute the whole graph elements set when the
        // theme is changed, we could rebuild only the stylesheet
        const processedGraphData = processGraphElements(instanceViewConfig, scenario.data, theme);
        setGraphData(processedGraphData);
        */
        const scenario = await fetchDataTG();
        const processedGraphData = processGraphElementsTG(instanceViewConfig.configG6, scenario, theme);
        setGraphData(processedGraphData);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario.data?.id, theme]);

  return (
    <>
      <div className={classes.mainGrid}>
        <div className={classes.scenarioSelectGridItem}>
          <div style={{ width: '400px' }}>
            <HierarchicalComboBox
              value={currentScenario.data}
              values={sortedScenarioList}
              label={scenarioListLabel}
              handleChange={handleScenarioChange}
              disabled={scenarioListDisabled}
            />
          </div>
          <div style={{ flex: 1, paddingLeft: '15px' }}>
            <BasicToggleInput
              key="G6VizToogle"
              id="G6VizToogle"
              label="Use G6"
              value={true}
              changeSwitchType={setG6Viz}
              switchProps={{ id: 'toggle-input-g6viz' }}
            />
          </div>
        </div>
        <div className={classes.cytoscapeGridItem}>
          <G6Viz graphData={graphData} />
        </div>
      </div>
    </>
  );
};

Instance.propTypes = {
  setG6Viz: PropTypes.func,
};

export default Instance;
