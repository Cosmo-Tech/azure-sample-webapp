// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';

const HEIGHT_OFFSET_IN_PX = 4;

export const createApp = (appRef, canvasRef, containerRef, theme, toggleInspectorDrawer) => {
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
    renderElements(appRef, toggleInspectorDrawer);
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

export const renderElements = (appRef, toggleInspectorDrawer) => {
  // TODO replace placeholder rectangle
  const graphics = new PIXI.Graphics();
  graphics.beginFill('#228855');
  graphics.drawRect(0, 0, 300, 200);
  appRef.current.stage.addChild(graphics);

  graphics.eventMode = 'static';
  graphics.on('click', toggleInspectorDrawer);
};
