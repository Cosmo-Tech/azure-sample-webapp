// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';
import { getGraphFromInstance } from './graphUtils';

const createTexture = (appRef, options) => {
  const graphics = new PIXI.Graphics();
  graphics.beginFill(options.fillColor);
  graphics.lineStyle(0.75, options.lineColor);
  graphics.drawRect(0, 0, 8, 8);
  graphics.endFill();
  return appRef.current.renderer.generateTexture(graphics, PIXI.SCALE_MODES.LINEAR, 2);
};

const createLinkGraphics = (nodes, links) => {
  const graphics = new PIXI.Graphics();
  graphics.alpha = 0.25;
  graphics.lineStyle(1, '#FFFFFF');
  links.forEach((link) => {
    const { source, target } = link;
    graphics.moveTo(source.x + 4, source.y + 4);
    graphics.lineTo(target.x + 4, target.y + 4);
  });
  return graphics;
};

export const renderElements = (appRef, containerRef, instance, toggleInspectorDrawer) => {
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;

  const textures = {
    stock: createTexture(appRef, { fillColor: '#003d00', lineColor: '#ffffff' }),
    productionResource: createTexture(appRef, { fillColor: '#3d0000', lineColor: '#ff0000' }),
    productionOperation: createTexture(appRef, { fillColor: '#00003d', lineColor: '#4444ff' }),
  };

  const { nodes, links } = getGraphFromInstance(instance, width, height);

  const linkGraphics = createLinkGraphics(nodes, links);
  appRef.current.stage.addChild(linkGraphics);

  nodes.forEach((node) => {
    const sprite = new PIXI.Sprite(textures[node.type]);
    sprite.x = node.x;
    sprite.y = node.y;
    sprite.eventMode = 'static';
    sprite.buttonMode = true;
    sprite.on('click', toggleInspectorDrawer);
    appRef.current.stage.addChild(sprite);
  });
};

export const createApp = (appRef, canvasRef, containerRef, instance, theme, toggleInspectorDrawer) => {
  const app = new PIXI.Application({
    width: containerRef.current.clientWidth,
    height: containerRef.current.clientHeight,
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
