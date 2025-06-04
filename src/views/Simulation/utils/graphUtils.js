// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const X_MARGIN = 20;
const Y_MARGIN = 20;
const MAX_NODE_HEIGHT = 10;
const MAX_NODE_WIDTH = 10;
const getAbsoluteXPosition = (width, x) => X_MARGIN + x * (width - 2 * X_MARGIN - MAX_NODE_WIDTH);
const getAbsoluteYPosition = (height, y) => Y_MARGIN + y * (height - 2 * Y_MARGIN - MAX_NODE_HEIGHT);

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
    const target = instance.production_operations.find((el) => el.id === input.dest);
    if (!target) return console.warn(`Input: cannot find target Operation with id "${input.dest}"`);

    const targetResourceId = instance.compounds.find((rel) => rel.child === target.id)?.parent;
    if (!targetResourceId) return console.warn(`Input: cannot find compound link with child id "${target.id}"`);

    const link = forgeLink(nodes, input, 'input', input.src, targetResourceId);
    if (link) links.push(link);
  });
  return links;
};

const getOutputLinks = (instance, nodes) => {
  const links = [];
  instance.output.forEach((output) => {
    const source = instance.production_operations.find((el) => el.id === output.src);
    if (!source) return console.warn(`Output: cannot find source Operation with id "${output.src}"`);

    const sourceResourceId = instance.compounds.find((rel) => rel.child === source.id)?.parent;
    if (!sourceResourceId) return console.warn(`Output: cannot find compound link with child id "${source.id}"`);

    const link = forgeLink(nodes, output, 'output', sourceResourceId, output.dest);
    if (link) links.push(link);
  });
  return links;
};

const getGraphLinks = (instance, nodes) => {
  return [...getTransportLinks(instance, nodes), ...getInputLinks(instance, nodes), ...getOutputLinks(instance, nodes)];
};

export const getGraphFromInstance = (instance) => {
  const createNode = (node, type, x, y) => {
    return {
      id: node.id,
      type,
      xRelative: x ?? Math.random(),
      yRelative: y ?? Math.random(),
      data: forgeElementData(node, ['id', 'latitude', 'longitude']),
    };
  };

  const createSubElement = (subElement, type) => {
    return {
      id: subElement.id,
      type,
      data: forgeElementData(subElement, ['id', 'latitude', 'longitude']),
    };
  };

  const stocks = instance.stocks.map((el) => createNode(el, 'stock'));
  const productionResources = instance.production_resources.map((el) => createNode(el, 'productionResource'));
  const operations = instance.production_operations.map((el) => createSubElement(el, 'productionOperation'));

  const nodes = [...stocks, ...productionResources];
  const links = getGraphLinks(instance, nodes);
  return { nodes, operations, links };
};

export const resetGraphLayout = (graphRef, width, height) => {
  if (graphRef.current == null) return;

  graphRef.current.nodes.forEach((node) => {
    node.x = getAbsoluteXPosition(width, node.xRelative);
    node.y = getAbsoluteYPosition(height, node.yRelative);
  });
};
