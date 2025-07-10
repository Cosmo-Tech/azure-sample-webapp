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

const isShowingAllElements = (settings) => settings.graphViewFilters.length === 0;

const setStockShortages = (instance, stocks, shortages, settings) => {
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

const setResourceBottlenecks = (instance, productionResources, bottlenecks, settings) => {
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

export const resetGraphHighlighting = (graph, settings) => {
  const defaultGrayedOutValue = !isShowingAllElements(settings);

  graph.links.forEach((link) => (link.isGrayedOut = defaultGrayedOutValue));
  graph.nodes.forEach((node) => (node.isGrayedOut = defaultGrayedOutValue));
  if (isShowingAllElements(settings)) return;

  const highlightBottlenecks = settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.BOTTLENECKS);
  const highlightShortages = settings.graphViewFilters.includes(GRAPH_VIEW_FILTER_VALUES.SHORTAGES);
  graph.nodes.forEach((node) => {
    if (highlightShortages && (node.shortagesCount ?? 0) > 0) node.isGrayedOut = false;
    if (highlightBottlenecks && (node.bottlenecksCount ?? 0) > 0) node.isGrayedOut = false;
  });

  const inPropagationLevel = settings.showInput ? settings.inputLevels : 0;
  const outPropagationLevel = settings.showOutput ? settings.outputLevels : 0;
  propagateElementsHighlighting(graph.links, inPropagationLevel, outPropagationLevel);
};

const propagateElementsHighlighting = (links, inPropagationLevel, outPropagationLevel) => {
  links.forEach((link) => {
    if (inPropagationLevel > 0 && !link.target.isGrayedOut) link.source.isGrayedOut = false;
    if (outPropagationLevel > 0 && !link.source.isGrayedOut) link.target.isGrayedOut = false;
    if (!link.source.isGrayedOut && !link.target.isGrayedOut) link.isGrayedOut = false;
  });

  // TODO: replace by iterative algorithm to improve performance
  if (inPropagationLevel > 1 || outPropagationLevel > 1)
    propagateElementsHighlighting(links, inPropagationLevel - 1, outPropagationLevel - 1);
};

export const getGraphFromInstance = (scenario, settings) => {
  const bottlenecks = scenario.bottlenecks;
  const configuration = scenario.configuration;
  const instance = scenario.instance;
  const kpis = scenario.kpis;
  const shortages = scenario.shortages;
  const stockDemands = scenario.stockDemands;

  const defaultGrayedOutValue = !isShowingAllElements(settings);
  const createNode = (node, type) => {
    return {
      id: node.id,
      isGrayedOut: defaultGrayedOutValue,
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

  setStockShortages(instance, stocks, shortages, settings);
  setResourceBottlenecks(instance, productionResources, bottlenecks, settings);

  const nodes = [...stocks, ...productionResources];
  const links = getGraphLinks(instance, nodes);

  const inPropagationLevel = settings.showInput ? settings.inputLevels : 0;
  const outPropagationLevel = settings.showOutput ? settings.outputLevels : 0;
  if (isShowingAllElements(settings)) propagateElementsHighlighting(links, inPropagationLevel, outPropagationLevel);

  // TODO: search by run id when we support results from several simulations
  const simulationConfiguration = configuration?.[0];
  simulationConfiguration.timeSteps = simulationConfiguration.simulatedCycles * simulationConfiguration.stepsPerCycle;
  return { simulationConfiguration, nodes, operations, links, kpis, stockDemands, shortages };
};

export const resetGraphLayout = (graphRef, width, height, settings) => {
  if (graphRef.current == null) return;
  applyDagreLayout(graphRef.current.nodes, graphRef.current.links, settings);
};
