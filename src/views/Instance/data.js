// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import axios from 'axios';
import { Auth } from '@cosmotech/core';
import {
  getDefaultEdgeStyle,
  getDefaultNodeStyle,
  getDefaultSelectedEdgeStyle,
  getDefaultSelectedNodeStyle,
  getDefaultInEdgeStyle,
  getDefaultHiddenStyle,
} from './styleCytoViz';
import { ORGANIZATION_ID, WORKSPACE_ID } from '../../config/GlobalConfiguration';
import instanceViewData from '../../config/InstanceVisualization.js';

const IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID = !(instanceViewData.dataSource == null);
export { IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID };

const _formatLabelWithNewlines = (label) => label?.replace(/[_|\s]/g, '\n') || '';

const _forgeCytoscapeNodeData = (node, classes, nodesGroupMetadata = {}, nodesParentsDict = {}) => {
  const parent = nodesParentsDict[node.id];
  const { style, ...otherMetadata } = nodesGroupMetadata;
  return {
    group: 'nodes',
    data: { ...node, label: _formatLabelWithNewlines(node.id), parent: parent },
    classes: classes,
    ...otherMetadata,
  };
};

const _forgeCytoscapeEdgeData = (edge, classes, edgesGroupMetadata = {}) => {
  const { style, ...otherMetadata } = edgesGroupMetadata;
  return {
    group: 'edges',
    data: edge,
    classes: classes,
    ...otherMetadata,
  };
};

const _processGraphCompounds = (datasetContent, compoundsGroups) => {
  const nodesParentsDict = {};

  Object.entries(compoundsGroups).forEach(([compoundsGroupName, compoundsGroupMetadata]) => {
    const compoundsGroupFromDataset = datasetContent[compoundsGroupName] || [];
    compoundsGroupFromDataset.forEach((compound) => {
      if (nodesParentsDict[compound.target] == null) nodesParentsDict[compound.target] = [];
      nodesParentsDict[compound.target].push(compound.source);
    });
  });
  return nodesParentsDict;
};

const _processGraphNodes = (processedData, nodesParentsDict, datasetContent, nodesGroups, theme) => {
  Object.entries(nodesGroups).forEach(([nodesGroupName, nodesGroupMetadata]) => {
    // Nodes data
    const nodesGroupFromDataset = datasetContent[nodesGroupName] || [];
    nodesGroupFromDataset.forEach((node) => {
      processedData.graphElements.push(
        _forgeCytoscapeNodeData(node, [nodesGroupName], nodesGroupMetadata, nodesParentsDict)
      );
    });
    // Nodes style
    processedData.stylesheet.push({
      selector: `node.${nodesGroupName}`,
      style: { ...getDefaultNodeStyle(theme), ...nodesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: `node.${nodesGroupName}:selected`,
      style: { ...getDefaultSelectedNodeStyle(theme), ...nodesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: 'node[?hidden]',
      style: { ...getDefaultHiddenStyle(theme) },
    });
  });
};

const _processGraphEdges = (processedData, datasetContent, edgesGroups, theme) => {
  Object.entries(edgesGroups).forEach(([edgesGroupName, edgesGroupMetadata]) => {
    // Edges data
    const edgesGroupFromDataset = datasetContent[edgesGroupName] || [];
    edgesGroupFromDataset.forEach((edge) => {
      processedData.graphElements.push(_forgeCytoscapeEdgeData(edge, [edgesGroupName], edgesGroupMetadata));
    });
    // Edges style
    processedData.stylesheet.push({
      selector: `edge.${edgesGroupName}`,
      style: { ...getDefaultEdgeStyle(theme), ...edgesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: `edge.${edgesGroupName}:selected`,
      style: { ...getDefaultSelectedEdgeStyle(theme), ...edgesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: 'edge[?asInEdgeHighlighted]',
      style: { ...getDefaultInEdgeStyle(theme), ...edgesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: 'edge[?asOutEdgeHighlighted]',
      style: { ...getDefaultSelectedEdgeStyle(theme), ...edgesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: 'edge[?hidden]',
      style: { ...getDefaultHiddenStyle(theme) },
    });
  });
};

export const processGraphElements = (scenario, theme) => {
  if (!IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID) return [];
  const processedData = {
    graphElements: [],
    stylesheet: [],
  };
  // - ScenarioDownload Function Apps return an object with the following shape:
  //     {
  //       datasets: { content: <DATASET_CONTENT> },
  //       parameters: <SCENARIO_PARAMETERS>
  //     }
  // - DatasetDownload Function Apps will only return the content of a single dataset
  const scenarioDatasets = scenario.datasets || [{ content: scenario }];
  for (const dataset of Object.values(scenarioDatasets)) {
    const datasetContent = dataset.content;
    const nodesParentsDict = _processGraphCompounds(datasetContent, instanceViewData.dataContent.compounds || {});
    _processGraphNodes(
      processedData,
      nodesParentsDict,
      datasetContent,
      instanceViewData.dataContent.nodes,
      theme || {}
    );
    _processGraphEdges(processedData, datasetContent, instanceViewData.dataContent.edges, theme || {});
  }
  return processedData;
};

async function _fetchDataFromADT(scenarioId, dataSource) {
  const tokens = await Auth.acquireTokens();
  const headers = { 'x-functions-key': dataSource.functionKey };
  if (tokens?.accessToken) {
    headers.common = {};
    headers.common.Authorization = 'Bearer ' + tokens.accessToken;
  }
  return axios({
    method: 'post',
    url: dataSource.functionUrl,
    headers: headers,
    params: {
      'organization-id': ORGANIZATION_ID,
      'workspace-id': WORKSPACE_ID,
      'scenario-id': scenarioId,
    },
  });
}

export async function fetchData(scenarioId) {
  if (!IS_INSTANCE_VIEW_FUNCTION_CONFIG_VALID) {
    return {
      error:
        'Instance view Azure Function is not configured properly. Please check the Azure Function URL and secret key.',
    };
  }

  switch (instanceViewData.dataSource.type) {
    case 'adt':
      return _fetchDataFromADT(scenarioId, instanceViewData.dataSource);
    default:
      return {
        error:
          `Data source type "${instanceViewData.dataSource.type}" is not supported in Instance view.` +
          ' The only currently supported type is "adt"',
      };
  }
}
