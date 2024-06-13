// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import axios from 'axios';
import { Auth } from '@cosmotech/core';
import { ConfigUtils } from '../../utils';
import {
  getDefaultEdgeStyle,
  getDefaultNodeStyle,
  getDefaultSelectedEdgeStyle,
  getDefaultSelectedNodeStyle,
  getDefaultInEdgeStyle,
  getDefaultHiddenStyle,
} from './styleCytoViz';

const _formatLabelWithNewlines = (label) => String(label ?? '').replace(/[_|\s]/g, '\n');

const _forgeCytoscapeNodeData = (node, classes, nodesGroupMetadata = {}, nodesParentsDict = {}) => {
  const parent = nodesParentsDict[node.id];
  const { style, ...otherMetadata } = nodesGroupMetadata;
  return {
    group: 'nodes',
    data: { ...node, label: _formatLabelWithNewlines(node.id), parent },
    classes,
    ...otherMetadata,
  };
};

const _forgeCytoscapeEdgeData = (edge, classes, edgesGroupMetadata = {}) => {
  const { style, ...otherMetadata } = edgesGroupMetadata;
  return {
    group: 'edges',
    data: edge,
    classes,
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

    // Nodes style by node type
    processedData.stylesheet.push({
      selector: `node.${nodesGroupName}`,
      style: { ...getDefaultNodeStyle(theme), ...nodesGroupMetadata.style },
    });
    processedData.stylesheet.push({
      selector: `node.${nodesGroupName}:selected`,
      style: { ...getDefaultSelectedNodeStyle(theme), ...nodesGroupMetadata.style },
    });
  });

  // Generic nodes styles
  processedData.stylesheet.push({
    selector: 'node[?hidden]',
    style: { ...getDefaultHiddenStyle(theme) },
  });
};

const _processGraphEdges = (processedData, datasetContent, edgesGroups, theme) => {
  Object.entries(edgesGroups).forEach(([edgesGroupName, edgesGroupMetadata]) => {
    // Edges data
    const edgesGroupFromDataset = datasetContent[edgesGroupName] || [];
    edgesGroupFromDataset.forEach((edge) => {
      processedData.graphElements.push(_forgeCytoscapeEdgeData(edge, [edgesGroupName], edgesGroupMetadata));
    });

    // Edges style by edge type
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
  });

  // Generic edges types
  processedData.stylesheet.push({
    selector: 'edge[?hidden]',
    style: { ...getDefaultHiddenStyle(theme) },
  });
};

export const processGraphElements = (instanceViewConfig, scenario, theme) => {
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
    const nodesParentsDict = _processGraphCompounds(datasetContent, instanceViewConfig.dataContent?.compounds ?? {});
    _processGraphNodes(
      processedData,
      nodesParentsDict,
      datasetContent,
      instanceViewConfig.dataContent?.nodes ?? {},
      theme || {}
    );
    _processGraphEdges(processedData, datasetContent, instanceViewConfig.dataContent?.edges ?? {}, theme || {});
  }
  return processedData;
};

async function _fetchDataFromADT(organizationId, workspaceId, scenarioId, dataSource) {
  const tokens = await Auth.acquireTokens();
  const headers = { 'x-functions-key': dataSource.functionKey };
  if (tokens?.accessToken) {
    headers.Authorization = 'Bearer ' + tokens.accessToken;
  }
  return axios({
    method: 'post',
    url: dataSource.functionUrl,
    headers,
    params: {
      'organization-id': organizationId,
      'workspace-id': workspaceId,
      'scenario-id': scenarioId,
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
