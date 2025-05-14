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

const makeStockTexture = (appRef) => {
  const graphics = new PIXI.Graphics();
  graphics.beginFill('#003d00');
  graphics.lineStyle(0.75, '#ffffff');
  graphics.moveTo(1, 1);
  graphics.lineTo(8 - 1, 1);
  graphics.lineTo(8 - 1, 8 - 1);
  graphics.lineTo(1, 8 - 1);
  graphics.lineTo(1, 1);
  graphics.endFill();
  return appRef.current.renderer.generateTexture(graphics, PIXI.SCALE_MODES.LINEAR, 2);
};

export const renderElements = (appRef, containerRef, instance, toggleInspectorDrawer) => {
  const stocks = [];
  const stockTexture = makeStockTexture(appRef);
  const width = containerRef.current.clientWidth;
  const height = containerRef.current.clientHeight;
  for (const [index, stock] of instance.stocks.entries()) {
    const sprite = new PIXI.Sprite(stockTexture);
    sprite.x = Math.random() * width;
    sprite.y = Math.random() * height;
    sprite.index = index;
    sprite.eventMode = 'static';
    sprite.buttonMode = true;
    sprite.scale.set((stock.initialStock / 500.0) * 0.5 + 0.8);
    // sprite.scale.set(Math.random() * 0.5 + 0.8);
    sprite.on('click', toggleInspectorDrawer);
    stocks.push(sprite);
    appRef.current.stage.addChild(sprite);
  }
};
