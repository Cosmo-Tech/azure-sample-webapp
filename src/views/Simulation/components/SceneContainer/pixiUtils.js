// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Application, Graphics, GraphicsContext } from 'pixi.js';
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

export const renderElements = (app, containerRef, instance, setSelectedElement) => {
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  const graphicsContexts = {
    stock: createGraphicsContext({ fillColor: '#003d00', lineColor: '#ffffff' }),
    productionResource: createGraphicsContext({ fillColor: '#3d0000', lineColor: '#ff0000' }),
    productionOperation: createGraphicsContext({ fillColor: '#00003d', lineColor: '#4444ff' }),
  };

  const { nodes, links } = getGraphFromInstance(instance, width, height);

  const linkGraphics = createLinkGraphics(links);
  app.stage.addChild(linkGraphics);

  nodes.forEach((node) => {
    const graphics = new Graphics(graphicsContexts[node.type]);
    graphics.x = node.x;
    graphics.y = node.y;
    graphics.eventMode = 'static';

    graphics.cursor = 'pointer';
    graphics.on('click', (event) => {
      event.stopPropagation();
      setSelectedElement(node);
    });
    app.stage.addChild(graphics);
  });
};

export const createApp = async (containerRef, instance, theme, setSelectedElement) => {
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

  const handleResize = () => {
    if (!containerRef.current || !app) return;
    app.renderer.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    app.stage.removeChildren();
    renderElements(app, containerRef, instance, setSelectedElement);
  };
  window.addEventListener('resize', handleResize);

  renderElements(app, containerRef, instance, setSelectedElement);
  return app;
};

export const destroyApp = (app) => {
  app.destroy(true, { children: true });
};
