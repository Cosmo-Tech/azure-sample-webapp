// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { Api } from '../../../services/config/Api';
import * as nodes from './sample/nodes.json';
import * as rels from './sample/rels.json';
import { getDefaultEdgeStyle, getDefaultComboStyle, getDefaultNodeStyle } from './styleG6Viz';

const tgParams = {
  organizationId: 'O-gZYpnd27G7',
  // graphId: 'Demo - Supplier crisis - 1_Baseline_SAS low demand',
  graphId: 'Demo_Twingraph_Supply_M',
};

const _formatLabelWithNewlines = (label) => label?.replace(/[_|\s]/g, '\n') || '';

const _processGraphProps = (processedData, theme) => {
  processedData.graphProps.defaultNode = getDefaultNodeStyle(theme);
  processedData.graphProps.defaultEdge = getDefaultEdgeStyle(theme);
  processedData.graphProps.defaultCombo = getDefaultComboStyle(theme);
};

const _processCombos = (processedData, scenario) => {
  scenario.rels.forEach((rel) => {
    if (
      rel.rel.label === 'contains' &&
      rel.src.label === 'ProductionResource' &&
      rel.dest.label === 'ProductionOperation'
    ) {
      const combo = processedData.graphElements.combos.find((combo) => combo.id === rel.src.id);
      if (!combo) {
        processedData.graphElements.combos.push({
          id: rel.src.id,
          destId: [rel.dest.id],
          properties: rel.src.properties,
        });
      } else {
        combo.destId.push(rel.dest.id);
      }
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
      // add combo to node
      const combo = processedData.graphElements.combos.find((combo) => combo.destId.includes(nodeData.id));

      processedData.graphElements.nodes.push({
        id: nodeData.id,
        type: nodeData.label,
        comboId: combo?.id,
        label: _formatLabelWithNewlines(nodeData.id),
        properties: nodeData.properties,
      });
    }
  });
};

export const processGraphElementsTG = (configG6, scenario, theme) => {
  const processedData = {
    graphElements: {
      nodes: [],
      edges: [],
      combos: [],
    },
    graphProps: {
      ...configG6.graphProps,
    },
  };

  console.log('nodes' + scenario.nodes.length);
  console.log('rels' + scenario.rels.length);

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
