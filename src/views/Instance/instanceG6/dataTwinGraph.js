// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Api } from '../../../services/config/Api';
import * as nodes from './sample/nodes.json';
import * as rels from './sample/rels.json';
import { getDefaultEdgeStyle, getDefaultNodeStyle, getDefaultComboStyle } from './styleG6Viz';

const tgParams = {
  organizationId: 'O-gZYpnd27G7',
  graphId: 'Demo - Supplier crisis - 1_Baseline_SAS low demand',
};

const _processGraphProps = (processedData, theme) => {
  processedData.graphProps.defaultNode = getDefaultNodeStyle(theme);
  processedData.graphProps.defaultEdge = getDefaultEdgeStyle(theme);
  processedData.graphProps.defaultCombo = getDefaultComboStyle(theme);
};

const _processCombos = (processedData, scenario) => {
  scenario.rels.forEach((rel) => {
    if (rel.rel.label === 'contains') {
      processedData.graphElements.combos.push({
        id: rel.src.id,
      });
    }
  });
};

const _processEdges = (processedData, scenario) => {
  scenario.rels.forEach((rel) => {
    if (rel.rel.label !== 'contains') {
      processedData.graphElements.edges.push({
        id: rel.rel.id,
        source: rel.src.id,
        target: rel.dest.id,
      });
    }
  });
};

const _processNodes = (processedData, scenario) => {
  scenario.nodes.forEach((node) => {
    // add node if is not a combo
    const nodeData = node.n;
    if (!processedData.graphElements.combos.some((combo) => combo.id === nodeData.id)) {
      processedData.graphElements.nodes.push({
        id: nodeData.id,
        type: nodeData.label,
        label: nodeData.properties.Label,
        ...nodeData.properties,
      });
    }
  });
};

export const processGraphElementsTG = (scenario, theme) => {
  const processedData = {
    graphElements: {
      nodes: [],
      edges: [],
      combos: [],
    },
    graphProps: {},
  };

  _processGraphProps(processedData, theme);
  _processCombos(processedData, scenario);
  _processEdges(processedData, scenario);
  _processNodes(processedData, scenario);

  return processedData;
};

export const fetchDataTG = async () => {
  const nodesRes = await Api.Twingraph.query(tgParams.organizationId, tgParams.graphId, {
    query: `MATCH (n) RETURN n`,
  });

  const relsRes = await Api.Twingraph.query(tgParams.organizationId, tgParams.graphId, {
    query: `MATCH(n)-[r]->(m) RETURN n as src, r as rel, m as dest`,
  });

  return { nodes: nodesRes.data, rels: relsRes.data };
};

export const fetchDataSample = () => {
  return { nodes, rels };
};
