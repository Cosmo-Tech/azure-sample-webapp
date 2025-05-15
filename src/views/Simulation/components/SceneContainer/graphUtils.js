// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

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
    links.push({ source, target });
  });

  return links;
};

export const getGraphFromInstance = (instance, width, height) => {
  const createNode = (node, type, x, y) => ({
    id: node.id,
    type,
    x: x ?? Math.random() * width,
    y: y ?? Math.random() * height,
  });
  const stocks = instance.stocks.map((stock) => createNode(stock, 'stock'));
  const productionResources = instance.production_resources.map((stock) => createNode(stock, 'productionResource'));
  const productionOperations = instance.production_operations.map((stock) => createNode(stock, 'productionOperation'));

  const nodes = [...stocks, ...productionResources, ...productionOperations];
  const links = getGraphLinks(instance, nodes);
  return { nodes, links };
};
