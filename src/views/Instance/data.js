// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import axios from 'axios';
import { getAuthenticationHeaders } from '../../services/ClientApi.js';
import { Api } from '../../services/config/Api';
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

async function _fetchDataFromAzureFunction(organizationId, workspaceId, scenarioId, dataSource) {
  const headers = await getAuthenticationHeaders(false); // Do not accept API key as token for Azure Functions
  headers['x-functions-key'] = dataSource.functionKey;

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

async function _fetchTwingraphDatasetContent(organizationId, datasetId, dataSource) {
  const sendQuery = async (query) => (await Api.Datasets.twingraphQuery(organizationId, datasetId, { query })).data;
  let nodes = [];
  let edges = [];

  const nodeCategories = await sendQuery(
    'MATCH (n) RETURN distinct labels(n)[0] as label, count(*) as count, keys(n) as keys'
  );
  for (const nodeCategory of nodeCategories) {
    const nodeProperties = nodeCategory.keys.map((propertyName) => `n.${propertyName} as ${propertyName}`).join(', ');
    // FIXME: label is lost here
    nodes = nodes.concat(await sendQuery(`MATCH (n:${nodeCategory.label}) RETURN ${nodeProperties}`));
  }

  const edgeCategories = await sendQuery(
    'MATCH ()-[r]->() RETURN distinct type(r) as type, count(*) as count, keys(r) as keys'
  );
  for (const edgeCategory of edgeCategories) {
    const edgeProperties = edgeCategory.keys.map((propertyName) => `${propertyName}: r.${propertyName}`).join(', ');
    // FIXME: label is lost here
    edges = edges.concat(
      await sendQuery(
        `MATCH (src)-[r:${edgeCategory.type}]->(dst) WITH src, dst, { ${edgeProperties} } as properties RETURN ` +
          'properties, src.id as src, dst.id as dst'
      )
    );
  }
  return { nodes, edges, nodeCategories, edgeCategories };
}

async function _fetchDataFromTwingraphDatasets(organizationId, datasets) {
  const content = {};
  const nodesKeys = {};
  const edgesKeys = {};
  let allNodes = [];
  let allEdges = [];
  for (const datasetId of datasets) {
    const { nodes, edges, nodeCategories, edgeCategories } = await _fetchTwingraphDatasetContent(
      organizationId,
      datasetId
    );
    allNodes = allNodes.concat(nodes);
    allEdges = allEdges.concat(edges);
    nodeCategories.forEach((nodeCategory) => (nodesKeys[nodeCategory.label] = nodeCategory.keys));
    edgeCategories.forEach((edgeCategory) => (edgesKeys[edgeCategory.type] = edgeCategory.keys));

    allNodes = allNodes.map((node) => ({ id: node.id }));
    allEdges = allEdges.map((edge, index) => ({
      id: edge.properties.id ?? `${edge.properties.name}_${index}`,
      source: edge.src,
      target: edge.dst,
    }));
  }

  return { data: { nodes: allNodes, edges: allEdges }, graphItemsAttributes: { nodes: nodesKeys, edges: edgesKeys } };
}

export async function fetchData(instanceViewConfig, organizationId, workspaceId, scenario, datasets) {
  const scenarioId = scenario.id;
  if (!ConfigUtils.isInstanceViewConfigValid(instanceViewConfig)) {
    return {
      error:
        'Instance view Azure Function is not configured properly. Please check the Azure Function URL and secret key.',
    };
  }

  switch (instanceViewConfig.dataSource.type) {
    case 'adt':
      console.warn('The dataSource type "adt" is deprecated, please use value "azure_function" instead.');
    // fallthrough: adt and azure_function are equivalent
    case 'azure_function':
      return _fetchDataFromAzureFunction(organizationId, workspaceId, scenarioId, instanceViewConfig.dataSource);
    case 'twingraph_dataset':
      if (
        !datasets
          .filter((dataset) => scenario.datasetList.includes(dataset.id))
          .some((dataset) => dataset.twingraphId != null)
      )
        return {
          error:
            "Can't fetch dataset content because it is not of type twingraph. Please select a scenario that " +
            'has at least one twingraph dataset.',
        };
      return _fetchDataFromTwingraphDatasets(organizationId, scenario.datasetList);
    default:
      return {
        error:
          `Data source type "${instanceViewConfig.dataSource.type}" is not supported in Instance view.` +
          ' Supported types are "azure_function" and "twingraph_dataset"',
      };
  }
}
