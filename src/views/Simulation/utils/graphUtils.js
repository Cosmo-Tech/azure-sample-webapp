// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { GRAPH_VIEW_FILTER_VALUES } from '../constants/settings';
import { applyDagreLayout } from './layoutUtils';

const forgeElementData = (element, keysToHide = []) => {
  const data = { ...element };
  keysToHide.forEach((keyToHide) => {
    if (keyToHide in data) delete data[keyToHide];
  });
  return data;
};

const forgeLink = (nodes, link, type, sourceId, targetId) => {
  const source = nodes.find((node) => node.id === sourceId);
  const target = nodes.find((node) => node.id === targetId);
  if (source == null) return console.warn(`Transports: cannot find link source "${sourceId}"`);
  if (target == null) return console.warn(`Transports: cannot find link target "${targetId}"`);
  const isGrayedOut = source.isGrayedOut || target.isGrayedOut;
  return { isGrayedOut, type, source, target, data: forgeElementData(link) };
};

const getTransportLinks = (instance, nodes) => {
  const links = [];
  instance.transports.forEach((linkMetadata) => {
    const link = forgeLink(nodes, linkMetadata, 'transports', linkMetadata.src, linkMetadata.dest);
    if (link) links.push(link);
  });
  return links;
};

const getInputLinks = (instance, nodes) => {
  const links = [];
  instance.input.forEach((input) => {
    const target = instance.production_operations.find((element) => element.id === input.dest);
    if (!target) return console.warn(`Input: cannot find target Operation with id "${input.dest}"`);

    const targetResourceId = instance.compounds.find((relationship) => relationship.child === target.id)?.parent;
    if (!targetResourceId) return console.warn(`Input: cannot find compound link with child id "${target.id}"`);

    const link = forgeLink(nodes, input, 'input', input.src, targetResourceId);
    if (link) links.push(link);
  });
  return links;
};

const getOutputLinks = (instance, nodes) => {
  const links = [];
  instance.output.forEach((output) => {
    const source = instance.production_operations.find((element) => element.id === output.src);
    if (!source) return console.warn(`Output: cannot find source Operation with id "${output.src}"`);

    const sourceResourceId = instance.compounds.find((relationship) => relationship.child === source.id)?.parent;
    if (!sourceResourceId) return console.warn(`Output: cannot find compound link with child id "${source.id}"`);

    const link = forgeLink(nodes, output, 'output', sourceResourceId, output.dest);
    if (link) links.push(link);
  });
  return links;
};

const getGraphLinks = (instance, nodes) => {
  return [...getTransportLinks(instance, nodes), ...getInputLinks(instance, nodes), ...getOutputLinks(instance, nodes)];
};

const setStockShortages = (stocks, shortages, settings) => {
  const highlightShortages = settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.SHORTAGES);
  let stocksNotFound = 0;
  for (const [stockId, stockShortages] of Object.entries(shortages)) {
    const stock = stocks.find((element) => element.id === stockId);
    if (!stocks.find((element) => element.id === stockId)) {
      stocksNotFound++;
      continue;
    }

    const newShortages = Object.entries(stockShortages).length;
    stock.shortagesCount = (stock.shortagesCount ?? 0) + newShortages;
    if (highlightShortages && newShortages > 0) stock.isGrayedOut = false;
  }

  if (stocksNotFound > 0) console.warn(`Shortages: ${stocksNotFound} stock ids not found in instance`);
};

const setResourceBottlenecks = (productionResources, bottlenecks, settings) => {
  const highlightBottlenecks = settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS);
  let resourcesNotFound = 0;
  for (const [resourceId, resourceBottlenecks] of Object.entries(bottlenecks)) {
    const resource = productionResources.find((resource) => resource.id === resourceId);
    if (!resource) {
      resourcesNotFound++;
      continue;
    }

    const newBottlenecks = Object.entries(resourceBottlenecks).length;
    resource.bottlenecksCount = (resource.bottlenecksCount ?? 0) + newBottlenecks;
    if (highlightBottlenecks && newBottlenecks > 0) resource.isGrayedOut = false;
  }

  if (resourcesNotFound > 0) console.warn(`Bottlenecks: ${resourcesNotFound} resource ids not found in instance`);
};

const getHighlightSettings = (settings) => {
  return {
    highlightBottlenecks: settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS),
    highlightShortages: settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.SHORTAGES),
  };
};

const resetNodesHighlighting = (
  nodes,
  bottlenecks,
  shortages,
  highlightBottlenecks,
  highlightShortages,
  currentTimestep,
  defaultGrayedOutValue
) => {
  nodes.forEach((node) => {
    node.isGrayedOut = defaultGrayedOutValue;
    node.isSelected = false;

    if (currentTimestep == null) {
      node.isHighlighted =
        (highlightShortages && (node.shortagesCount ?? 0) > 0) ||
        (highlightBottlenecks && (node.bottlenecksCount ?? 0) > 0);
    } else {
      if (node.type === 'stock') {
        const shortagesAtStep = shortages?.[node.id]?.[currentTimestep] ?? 0;
        node.isHighlighted = highlightShortages && shortagesAtStep > 0;
      } else {
        const bottlenecksAtStep = bottlenecks?.[node.id]?.[currentTimestep] ?? 0;
        node.isHighlighted = highlightBottlenecks && bottlenecksAtStep > 0;
      }
    }
  });
};

export const resetGraphHighlighting = (graph, settings, selectedElementId, currentTimestep) => {
  const links = graph.links;
  const nodes = graph.nodes;
  const defaultGrayedOutValue = selectedElementId != null;
  const { highlightBottlenecks, highlightShortages } = getHighlightSettings(settings);

  links.forEach((link) => {
    link.isGrayedOut = defaultGrayedOutValue;
    link.isSelected = false;
    link.graphType = 'link';
  });
  resetNodesHighlighting(
    nodes,
    graph.bottlenecks,
    graph.shortages,
    highlightBottlenecks,
    highlightShortages,
    currentTimestep,
    defaultGrayedOutValue
  );

  if (!selectedElementId) return;

  const inputLevels = settings.showInput ? settings.inputLevels : 0;
  const outputLevels = settings.showOutput ? settings.outputLevels : 0;
  const selectedElement =
    links.find((link) => link.data.id === selectedElementId) ?? nodes.find((node) => node.id === selectedElementId);

  if (!selectedElement) return;

  selectedElement.isGrayedOut = false;
  selectedElement.isSelected = true;
  handleElementsHighlighting(links, nodes, selectedElement, inputLevels, outputLevels);
};

const handleElementsHighlighting = (links, nodes, startElement, inputLevels, outputLevels) => {
  const isLink = startElement.graphType === 'link';
  const inPropagationRemain = isLink ? inputLevels * 2 + 1 : inputLevels * 2;
  const outPropagationRemain = isLink ? outputLevels * 2 + 1 : outputLevels * 2;
  if (inPropagationRemain > 0) propagateElementHighlighting(links, nodes, startElement, 'in', inPropagationRemain);
  if (outPropagationRemain > 0) propagateElementHighlighting(links, nodes, startElement, 'out', outPropagationRemain);
};

const propagateElementHighlighting = (links, nodes, element, propagationDirection, propagationRemain) => {
  element.isGrayedOut = false;
  if (propagationRemain === 0) return;

  if (element.graphType === 'link') {
    const idToSearch = propagationDirection === 'in' ? element.source.id : element.target.id;
    const nextNode = nodes.find((node) => node.id === idToSearch);
    propagateElementHighlighting(links, nodes, nextNode, propagationDirection, propagationRemain - 1);
  } else {
    const nextLinks = links.filter((link) => {
      const idToSearch = propagationDirection === 'out' ? link.source.id : link.target.id;
      return idToSearch === element.id;
    });
    nextLinks.forEach((nextLink) =>
      propagateElementHighlighting(links, nodes, nextLink, propagationDirection, propagationRemain - 1)
    );
  }
};

export const getGraphFromInstance = (scenario, settings) => {
  const bottlenecks = scenario.bottlenecks;
  const configuration = scenario.configuration;
  const instance = scenario.instance;
  const kpis = scenario.kpis;
  const shortages = scenario.shortages;
  const stockDemands = scenario.stockDemands;
  const stockDemandSumTimeseries = scenario.stockDemandSumTimeseries;

  const createNode = (node, type) => {
    return {
      id: node.id,
      type,
      data: forgeElementData(node, ['id', 'latitude', 'longitude']),
    };
  };

  const stocks = instance.stocks.map((el) => createNode(el, 'stock'));
  const productionResources = instance.production_resources.map((el) => createNode(el, 'productionResource'));
  productionResources.forEach((resource) => {
    resource.operations = instance.compounds
      .filter((link) => link.parent === resource.id)
      .map((operation) => operation.child);
    resource.operationsCount = resource.operations.length;
  });
  const operations = instance.production_operations.map((el) => createNode(el, 'productionOperation'));

  setStockShortages(stocks, shortages, settings);
  setResourceBottlenecks(productionResources, bottlenecks, settings);

  const nodes = [...stocks, ...productionResources];
  const links = getGraphLinks(instance, nodes);

  const { highlightBottlenecks, highlightShortages } = getHighlightSettings(settings);
  resetNodesHighlighting(nodes, bottlenecks, shortages, highlightBottlenecks, highlightShortages, null, false);

  // TODO: search by run id when we support results from several simulations
  const simulationConfiguration = configuration?.[0];
  simulationConfiguration.timeSteps = simulationConfiguration.simulatedCycles * simulationConfiguration.stepsPerCycle;

  // Truncate demand data to the number of timesteps that have been simulated
  const truncatedStockDemand = stockDemandSumTimeseries.slice(0, simulationConfiguration.timeSteps);

  return {
    simulationConfiguration,
    nodes,
    operations,
    links,
    kpis,
    stockDemands,
    totalStockDemand: truncatedStockDemand,
    bottlenecks,
    shortages,
  };
};

export const resetGraphLayout = (graphRef, width, height, settings) => {
  if (graphRef.current == null) return;
  applyDagreLayout(graphRef.current.nodes, graphRef.current.links, settings);
};
