// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
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
  return { type, source, target, data: forgeElementData(link) };
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

const setStockShortages = (instance, stocks, shortages) => {
  let stocksNotFound = 0;
  for (const [stockId, stockShortages] of Object.entries(shortages)) {
    const stock = stocks.find((element) => element.id === stockId);
    if (!stocks.find((element) => element.id === stockId)) {
      stocksNotFound++;
      continue;
    }

    const newShortages = Object.entries(stockShortages).length;
    stock.shortagesCount = (stock.shortagesCount ?? 0) + newShortages;
  }

  if (stocksNotFound > 0) console.warn(`Shortages: ${stocksNotFound} stock ids not found in instance`);
};

const setResourceBottlenecks = (instance, productionResources, operations, bottlenecks) => {
  let operationsNotFound = 0;
  let parentResourcesNotFound = 0;
  for (const [operationId, operationBottlenecks] of Object.entries(bottlenecks)) {
    if (!operations.find((element) => element.id === operationId)) {
      operationsNotFound++;
      continue;
    }

    const parentResourceId = instance.compounds.find((relationship) => relationship.child === operationId)?.parent;
    if (parentResourceId == null) {
      parentResourcesNotFound++;
      continue;
    }

    const newBottlenecks = Object.entries(operationBottlenecks).length;
    const parentResource = productionResources.find((resource) => resource.id === parentResourceId);
    if (parentResource) parentResource.bottlenecksCount = (parentResource.bottlenecksCount ?? 0) + newBottlenecks;
  }

  if (operationsNotFound > 0) console.warn(`Bottlenecks: ${operationsNotFound} operation ids not found in instance`);
  if (parentResourcesNotFound > 0)
    console.warn(`Bottlenecks: ${parentResourcesNotFound} operations ids not found in links to parent resources`);
};

export const getGraphFromInstance = (instance, bottlenecks, shortages, settings) => {
  const createNode = (node, type) => {
    return {
      id: node.id,
      type,
      data: forgeElementData(node, ['id', 'latitude', 'longitude']),
    };
  };

  const stocks = instance.stocks.map((el) => createNode(el, 'stock'));
  const productionResources = instance.production_resources.map((el) => createNode(el, 'productionResource'));
  const operations = instance.production_operations.map((el) => createNode(el, 'productionOperation'));

  setStockShortages(instance, stocks, shortages);
  setResourceBottlenecks(instance, productionResources, operations, bottlenecks);

  const nodes = [...stocks, ...productionResources];
  const links = getGraphLinks(instance, nodes);
  applyDagreLayout(nodes, links, settings);
  return { nodes, operations, links };
};

export const resetGraphLayout = (graphRef, width, height, settings) => {
  if (graphRef.current == null) return;
  applyDagreLayout(graphRef.current.nodes, graphRef.current.links, settings);
};
