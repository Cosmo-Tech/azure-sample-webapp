// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { Auth } from '@cosmotech/core';
import { getDefaultEdgeStyle, getDefaultNodeStyle, getDefaultComboStyle } from './styleG6Viz';
import { ConfigUtils } from '../../../utils';

const _formatLabelWithNewlines = (label) => label?.replace(/[_|\s]/g, '\n') || '';

const _forgeG6NodeData = (node) => {
  return {
    ...node,
    label: _formatLabelWithNewlines(node.id),
  };
};

const _forgeG6EdgeData = (edge) => {
  return {
    ...edge,
  };
};

const _processGraphCompounds = (processedData, datasetContent, compoundsGroups) => {
  Object.entries(compoundsGroups).forEach(([compoundsGroupName, compoundsGroupMetadata]) => {
    const compoundsGroupFromDataset = datasetContent[compoundsGroupName] || [];
    compoundsGroupFromDataset.forEach((compound) => {
      // move source to combo from node if not exist
      if (!processedData.graphElements.combos.some((c) => c.id === compound.source)) {
        const idxNodeSource = processedData.graphElements.nodes.findIndex((n) => n.id === compound.source);
        if (idxNodeSource !== -1) {
          const comboToPush = processedData.graphElements.nodes[idxNodeSource];
          comboToPush.parentId = comboToPush.comboId;
          delete comboToPush.comboId;
          processedData.graphElements.combos.push(processedData.graphElements.nodes[idxNodeSource]);
          processedData.graphElements.nodes.splice(idxNodeSource, 1);
        }
      }

      // assign target to comboId / parentId
      const idxNodeTarget = processedData.graphElements.nodes.findIndex((n) => n.id === compound.target);
      if (idxNodeTarget !== -1) {
        processedData.graphElements.nodes[idxNodeTarget].comboId = compound.source;
      } else {
        const idxComboTarget = processedData.graphElements.combos.findIndex((c) => c.id === compound.target);
        if (idxComboTarget !== -1) {
          processedData.graphElements.combos[idxComboTarget].parentId = compound.source;
        }
      }
    });
  });
};

const _processGraphNodes = (processedData, datasetContent, nodesGroups) => {
  Object.entries(nodesGroups).forEach(([nodesGroupName, nodesGroupMetadata]) => {
    // Nodes data
    const nodesGroupFromDataset = datasetContent[nodesGroupName] || [];
    nodesGroupFromDataset.forEach((node) => {
      processedData.graphElements.nodes.push(_forgeG6NodeData(node));
    });
  });
};

const _processGraphEdges = (processedData, datasetContent, edgesGroups) => {
  Object.entries(edgesGroups).forEach(([edgesGroupName, edgesGroupMetadata]) => {
    // Edges data
    const edgesGroupFromDataset = datasetContent[edgesGroupName] || [];
    edgesGroupFromDataset.forEach((edge) => {
      processedData.graphElements.edges.push(_forgeG6EdgeData(edge));
    });
  });
};

const _processGraphProps = (processedData, theme) => {
  processedData.graphProps.defaultNode = getDefaultNodeStyle(theme);
  processedData.graphProps.defaultEdge = getDefaultEdgeStyle(theme);
  processedData.graphProps.defaultCombo = getDefaultComboStyle(theme);
};

export const processGraphElements = (instanceViewConfig, scenario, theme) => {
  const processedData = {
    graphElements: {
      nodes: [],
      edges: [],
      combos: [],
    },
    graphProps: {},
  };

  _processGraphProps(processedData, theme);

  const scenarioDatasets = scenario.datasets || [{ content: scenario }];
  for (const dataset of Object.values(scenarioDatasets)) {
    const datasetContent = dataset.content;
    _processGraphNodes(processedData, datasetContent, instanceViewConfig.dataContent.nodes);
    _processGraphEdges(processedData, datasetContent, instanceViewConfig.dataContent.edges);
    _processGraphCompounds(processedData, datasetContent, instanceViewConfig.dataContent.compounds || {});
  }

  console.log(processedData);

  return processedData;
};

async function _fetchDataFromADT(organizationId, workspaceId, scenarioId, dataSource) {
  const tokens = await Auth.acquireTokens();
  const headers = { 'x-functions-key': dataSource.functionKey };
  if (tokens?.accessToken) {
    headers.common = {};
    headers.common.Authorization = 'Bearer ' + tokens.accessToken;
  }
  return axios({
    method: 'post',
    url: dataSource.functionUrl,
    headers,
    params: {
      'organization-id': organizationId,
      'workspace-id': workspaceId,
      'scenario-id': scenarioId,
      'user-token': tokens.accessToken,
    },
  });
}

export async function fetchData(instanceViewConfig, organizationId, workspaceId, scenarioId) {
  if (!ConfigUtils.isInstanceViewConfigValid(instanceViewConfig)) {
    return {
      error:
        'Instance view Azure Function is not configured properly. Please check the Azure Function URL and secret key.',
    };
  }

  switch (instanceViewConfig.dataSource.type) {
    case 'adt':
      return _fetchDataFromADT(organizationId, workspaceId, scenarioId, instanceViewConfig.dataSource);
    default:
      return {
        error:
          `Data source type "${instanceViewConfig.dataSource.type}" is not supported in Instance view.` +
          ' The only currently supported type is "adt"',
      };
  }
}
