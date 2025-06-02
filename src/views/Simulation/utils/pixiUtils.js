// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Application, Graphics, GraphicsContext } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { SceneContainer } from './SceneContainer';
import { getGraphFromInstance } from './graphUtils';

const createGraphicsContext = (options) => {
  return new GraphicsContext()
    .rect(0, 0, 8, 8)
    .fill(options.fillColor)
    .stroke({ color: options.lineColor, width: 0.75 });
};

const createLinkGraphics = (links, setSelectedElement) => {
  return links.map((link) => {
    const graphics = new Graphics();
    graphics.alpha = 0.25;
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    const { source, target } = link;
    graphics.moveTo(source.x + 4, source.y + 4);

    graphics.lineTo(target.x + 4, target.y + 4);
    graphics.stroke({ width: 1, color: '#FFFFFF' });
    graphics.on('click', (event) => setSelectedElement(link));
    return graphics;
  });
};

export const renderElements = (sceneContainerRef, containerRef, instance, setSelectedElement) => {
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  const graphicsContexts = {
    stock: createGraphicsContext({ fillColor: '#003d00', lineColor: '#ffffff' }),
    productionResource: createGraphicsContext({ fillColor: '#3d0000', lineColor: '#ff0000' }),
    productionOperation: createGraphicsContext({ fillColor: '#00003d', lineColor: '#4444ff' }),
  };

  const { nodes, links } = getGraphFromInstance(instance, width, height);

  const linkGraphics = createLinkGraphics(links, setSelectedElement);
  linkGraphics.forEach((link) => sceneContainerRef.current.addChild(link));

  nodes.forEach((node) => {
    const graphics = new Graphics(graphicsContexts[node.type]);
    graphics.x = node.x;
    graphics.y = node.y;
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';
    graphics.on('click', (event) => setSelectedElement(node));
    sceneContainerRef.current.addChild(graphics);
  });
};

export const createApp = async (containerRef, sceneContainerRef, instance, theme, setSelectedElement) => {
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
  containerRef.current.hitArea = app.screen;
  containerRef.current.eventMode = 'static';

  sceneContainerRef.current = new SceneContainer(app, containerRef);
  app.stage.addChild(sceneContainerRef.current);

  const handleResize = () => {
    if (!containerRef.current || !app) return;
    app.renderer.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    sceneContainerRef.current.removeChildren();
    renderElements(sceneContainerRef, containerRef, instance, setSelectedElement);
  };
  window.addEventListener('resize', handleResize);

  renderElements(sceneContainerRef, containerRef, instance, setSelectedElement);
  return app;
};

export const destroyApp = (app) => {
  app.destroy(true, { children: true });
};
