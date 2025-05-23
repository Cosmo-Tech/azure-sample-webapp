// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const X_MARGIN = 20;
const Y_MARGIN = 20;
const MAX_NODE_HEIGHT = 10;
const MAX_NODE_WIDTH = 10;
const getRandomXPosition = (width) => X_MARGIN + Math.random() * (width - 2 * X_MARGIN - MAX_NODE_WIDTH);
const getRandomYPosition = (height) => Y_MARGIN + Math.random() * (height - 2 * Y_MARGIN - MAX_NODE_HEIGHT);

const forgeElementData = (element, keysToHide = []) => {
  const data = { ...element };
  keysToHide.forEach((keyToHide) => {
    if (keyToHide in data) delete data[keyToHide];
  });
  return data;
};

const getGraphLinks = (instance, nodes) => {
  const instanceLinks = [
    ...instance.transports,
    ...instance.input,
    ...instance.output,
    // ...instance.compounds,
  ];
  const links = [];
  instanceLinks.forEach((link) => {
    const sourceId = link.src;
    const targetId = link.dest;
    const source = nodes.find((node) => node.id === sourceId);
    const target = nodes.find((node) => node.id === targetId);
    if (source == null) {
      console.warn(`Cannot find link source "${sourceId}"`);
      return;
    }
    if (target == null) {
      console.warn(`Cannot find link target "${targetId}"`);
      return;
    }
    links.push({ source, target, data: forgeElementData(link) });
  });

  return links;
};

export const getGraphFromInstance = (instance, width, height) => {
  const createNode = (node, type, x, y) => {
    return {
      id: node.id,
      type,
      x: x ?? getRandomXPosition(width),
      y: y ?? getRandomYPosition(height),
      data: forgeElementData(node, ['id', 'latitude', 'longitude']),
    };
  };

  const stocks = instance.stocks.map((stock) => createNode(stock, 'stock'));
  const productionResources = instance.production_resources.map((stock) => createNode(stock, 'productionResource'));
  const productionOperations = instance.production_operations.map((stock) => createNode(stock, 'productionOperation'));

  const nodes = [...stocks, ...productionResources, ...productionOperations];
  const links = getGraphLinks(instance, nodes);
  return { nodes, links };
};
