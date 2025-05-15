// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';

const HEIGHT_OFFSET_IN_PX = 4;

export const createApp = (appRef, canvasRef, containerRef, instance, theme, toggleInspectorDrawer) => {
  const app = new PIXI.Application({
    width: containerRef.current.clientWidth,
    height: containerRef.current.clientHeight - HEIGHT_OFFSET_IN_PX,
    backgroundColor: theme.palette.background.default,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });

  appRef.current = app;
  canvasRef.current.appendChild(app.view);
  app.view.style.width = '100%';
  app.view.style.height = '100%';
  app.view.style.display = 'block';

  const handleResize = () => {
    if (!containerRef.current || !appRef.current) return;
    appRef.current.renderer.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    appRef.current.stage.removeChildren();
    renderElements(appRef, containerRef, instance, toggleInspectorDrawer);
  };

  window.addEventListener('resize', handleResize);

  const canvasToCleanup = canvasRef.current;
  const appToCleanup = appRef.current;

  return () => {
    window.removeEventListener('resize', handleResize);
    app.destroy(true, true);
    if (canvasToCleanup && appToCleanup?.view) {
      canvasToCleanup.removeChild(appToCleanup.view);
    }
  };
};

const createTexture = (appRef, options) => {
  const graphics = new PIXI.Graphics();
  graphics.beginFill(options.fillColor);
  graphics.lineStyle(0.75, options.lineColor);
  graphics.moveTo(1, 1);
  graphics.lineTo(8 - 1, 1);
  graphics.lineTo(8 - 1, 8 - 1);
  graphics.lineTo(1, 8 - 1);
  graphics.lineTo(1, 1);
  graphics.endFill();
  return appRef.current.renderer.generateTexture(graphics, PIXI.SCALE_MODES.LINEAR, 2);
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
    links.push({ source, target });
  });

  return links;
};

const createLinkGraphics = (nodes, links) => {
  const graphics = new PIXI.Graphics();
  graphics.alpha = 0.25;
  graphics.lineStyle(1, '#FFFFFF');
  links.forEach((link) => {
    const { source, target } = link;
    graphics.moveTo(source.x, source.y);
    graphics.lineTo(target.x, target.y);
  });
  return graphics;
};

export const renderElements = (appRef, containerRef, instance, toggleInspectorDrawer) => {
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  const stocks = [];
  const stockTexture = createTexture(appRef, { fillColor: '#003d00', lineColor: '#ffffff' });
  for (const [index, stock] of instance.stocks.entries()) {
    const sprite = new PIXI.Sprite(stockTexture);
    sprite.id = stock.id;
    sprite.x = Math.random() * width;
    sprite.y = Math.random() * height;
    sprite.index = index;
    sprite.eventMode = 'static';
    sprite.buttonMode = true;
    sprite.scale.set((stock.initialStock / 500.0) * 0.5 + 0.8);

    sprite.on('click', toggleInspectorDrawer);
    stocks.push(sprite);
  }

  const productionResources = [];
  const productionResourceTexture = createTexture(appRef, { fillColor: '#3d0000', lineColor: '#ff0000' });
  for (const [index, resource] of instance.production_resources.entries()) {
    const sprite = new PIXI.Sprite(productionResourceTexture);
    sprite.id = resource.id;
    sprite.x = Math.random() * width;
    sprite.y = Math.random() * height;
    sprite.index = index;
    sprite.eventMode = 'static';
    sprite.buttonMode = true;
    sprite.scale.set(Math.random() * 0.7 + 1.3);

    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    sprite.rotation = Math.PI / 4;

    sprite.on('click', toggleInspectorDrawer);
    productionResources.push(sprite);
  }

  const productionOperations = [];
  const productionOperationTexture = createTexture(appRef, { fillColor: '#00003d', lineColor: '#4444ff' });
  for (const [index, operation] of instance.production_operations.entries()) {
    const sprite = new PIXI.Sprite(productionOperationTexture);
    sprite.id = operation.id;
    sprite.x = Math.random() * width;
    sprite.y = Math.random() * height;
    sprite.index = index;
    sprite.eventMode = 'static';
    sprite.buttonMode = true;
    sprite.scale.set(Math.random() * 0.7 + 1.3);

    sprite.on('click', toggleInspectorDrawer);
    productionOperations.push(sprite);
  }

  const nodes = [...stocks, ...productionResources, ...productionOperations];
  const links = getGraphLinks(instance, nodes);

  const linkGraphics = createLinkGraphics(nodes, links);
  appRef.current.stage.addChild(linkGraphics);
  nodes.forEach((node) => appRef.current.stage.addChild(node));

  return { stocks, productionResources, productionOperations };
};
