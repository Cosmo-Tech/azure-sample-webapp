// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Application, Graphics, GraphicsContext, Container } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { getGraphFromInstance } from './graphUtils';

const createGraphicsContext = (options) => {
  return new GraphicsContext()
    .rect(0, 0, 8, 8)
    .fill(options.fillColor)
    .stroke({ color: options.lineColor, width: 0.75 });
};

const createLinkGraphics = (links) => {
  const graphics = new Graphics();
  graphics.alpha = 0.25;
  links.forEach((link) => {
    const { source, target } = link;
    graphics.moveTo(source.x + 4, source.y + 4);
    graphics.lineTo(target.x + 4, target.y + 4);
  });
  graphics.stroke({ width: 1, color: '#FFFFFF' });
  return graphics;
};

export const renderElements = (mainContainer, containerRef, instance, toggleInspectorDrawer) => {
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  const graphicsContexts = {
    stock: createGraphicsContext({ fillColor: '#003d00', lineColor: '#ffffff' }),
    productionResource: createGraphicsContext({ fillColor: '#3d0000', lineColor: '#ff0000' }),
    productionOperation: createGraphicsContext({ fillColor: '#00003d', lineColor: '#4444ff' }),
  };

  const { nodes, links } = getGraphFromInstance(instance, width, height);

  const linkGraphics = createLinkGraphics(links);
  mainContainer.addChild(linkGraphics);

  nodes.forEach((node) => {
    const graphics = new Graphics(graphicsContexts[node.type]);
    graphics.x = node.x;
    graphics.y = node.y;
    graphics.eventMode = 'static';

    graphics.cursor = 'pointer';
    graphics.on('click', (event) => {
      event.stopPropagation();
      toggleInspectorDrawer();
    });
    mainContainer.addChild(graphics);
  });
};

export const createApp = async (containerRef, instance, theme, toggleInspectorDrawer) => {
  const app = new Application();
  await app.init({
    width: containerRef.current.clientWidth,
    height: containerRef.current.clientHeight,
    backgroundColor: theme.palette.background.default,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });

  containerRef.current.appendChild(app.canvas);
  app.canvas.style.width = '100%';
  app.canvas.style.height = '100%';
  app.canvas.style.display = 'block';

  const mainContainer = new Container();
  app.stage.addChild(mainContainer);

  renderElements(mainContainer, containerRef, instance, toggleInspectorDrawer);
  return app;
};

export const destroyApp = (app) => {
  if (app.view && app.view.parentNode) {
    app.view.parentNode.removeChild(app.view);
  }
  app.destroy(true, { children: true });
};
