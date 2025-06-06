// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Application, Graphics, GraphicsContext, Container, Text } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { SceneContainer } from './SceneContainer';
import { PACKAGE_ICON_LINES, GEAR_ICON_LINES, FACTORY_ICON_LINES } from './shapes';

const GRAY_LINE_COLOR = 0xb9bac0;
const DEFAULT_TEXT_STYLE = { fontFamily: 'Arial', fontSize: 12, fill: 0xffffff, align: 'center' };

const createLabel = (value) => new Text({ text: value, style: DEFAULT_TEXT_STYLE, resolution: 2 });

const drawIcon = (graphicsContext, lines, xOffset, yOffset, width, height) => {
  lines.forEach((line) => {
    line.forEach((point, index) => {
      const x = xOffset + point[0] * width;
      const y = yOffset + point[1] * height;
      if (index === 0) graphicsContext.moveTo(x, y);
      else graphicsContext.lineTo(x, y);
    });
  });
};

const createStockGraphicsContext = (options) => {
  const graphicsContext = new GraphicsContext()
    .roundRect(0, 0, 48, 48, 8)
    .fill(options.fillColor)
    .stroke({ pixelLine: true, color: options.borderColor, width: 1.5 });
  drawIcon(graphicsContext, PACKAGE_ICON_LINES, 15, 14, 18, 20);
  graphicsContext.stroke({ pixelLine: true, color: options.iconColor, width: 1.5 });
  return graphicsContext;
};

const createProductionOperationGraphicsContext = (options) => {
  const graphicsContext = new GraphicsContext()
    .roundRect(0, 0, 48, 48, 8)
    .fill(options.fillColor)
    .stroke({ pixelLine: true, color: options.borderColor, width: 1.5 });
  drawIcon(graphicsContext, GEAR_ICON_LINES, 15, 14, 18, 20);
  graphicsContext
    .stroke({ pixelLine: true, color: options.iconColor, width: 1.5 })
    .circle(24, 24, 4)
    .stroke({ pixelLine: true, color: options.iconColor, width: 1.5 });
  return graphicsContext;
};

const createProductionResourceBorderGraphicsContext = (options) => {
  const radius = 8;
  const border = new GraphicsContext()
    .roundRect(0, 0, 80, 80, radius)
    .fill(options.fillColor)
    .moveTo(0, 80)
    .lineTo(0, 20)
    .arcTo(0, 0, 20, 0, radius)
    .lineTo(20, 0)
    .moveTo(60, 0)
    .arcTo(80, 0, 80, 80, radius)
    .lineTo(80, 80)
    .stroke({ pixelLine: true, color: options?.borderColor ?? GRAY_LINE_COLOR, width: 1.5 });
  return border;
};

const createFactoryIconBorderGraphicsContext = () => {
  const graphicsContext = new GraphicsContext();
  drawIcon(graphicsContext, FACTORY_ICON_LINES, 0, 0, 20, 20);
  graphicsContext.stroke({ pixelLine: true, color: GRAY_LINE_COLOR, width: 1.5 });
  return graphicsContext;
};

const createStockContainer = (graphicsContexts, name, color = 0x000000) => {
  const container = new Container();
  const stock = new Graphics(graphicsContexts.stock);
  const label = createLabel(name);
  label.anchor.set(0.5);
  label.position.set(40, 64);

  container.addChild(stock);
  container.addChild(label);
  return container;
};

const createProductionResourceContainer = (graphicsContexts, name, color = 0x000000) => {
  const container = new Container();
  const operation = new Graphics(graphicsContexts.productionOperation);
  operation.x = 16;
  operation.y = 30;
  const border = new Graphics(graphicsContexts.productionResourceBorder);
  border.y = 10;
  const factoryIcon = new Graphics(graphicsContexts.factoryIcon);
  factoryIcon.x = 30;
  const label = createLabel(name);
  label.anchor.set(0.5);
  label.position.set(40, 104);

  container.addChild(border);
  container.addChild(factoryIcon);
  container.addChild(operation);
  container.addChild(label);
  return container;
};

const createLinkGraphics = (links, setSelectedElement, isLayoutHorizontal) => {
  return links.map((link) => {
    const graphics = new Graphics();
    graphics.alpha = 0.25;
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    const { source, target } = link;
    const sourceOffset = { x: 0, y: 0 };
    const targetOffset = { x: 0, y: 0 };
    const controlPointsOffset = { x: 0, y: 0 };

    if (isLayoutHorizontal) {
      sourceOffset.x = link.source.type === 'stock' ? 24 : 40;
      targetOffset.x = link.target.type === 'stock' ? 24 : 40;
      controlPointsOffset.x = 80;
    } else {
      sourceOffset.y = link.source.type === 'stock' ? 24 : 40;
      targetOffset.y = link.target.type === 'stock' ? 24 : 60;
      controlPointsOffset.y = 80;
    }
    const controlPoint1 = {
      x: source.x + sourceOffset.x + controlPointsOffset.x,
      y: source.y + sourceOffset.y + controlPointsOffset.y,
    };
    const controlPoint2 = {
      x: target.x - targetOffset.x - controlPointsOffset.x,
      y: target.y - targetOffset.y - controlPointsOffset.y,
    };

    graphics.moveTo(source.x + sourceOffset.x, source.y + sourceOffset.y);
    graphics.bezierCurveTo(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      target.x - targetOffset.x,
      target.y - targetOffset.y
    );
    graphics.stroke({ pixelLine: true, width: 1, color: '#FFFFFF' });
    graphics.on('click', (event) => setSelectedElement(link));
    return graphics;
  });
};

const createNodeContainer = (graphicsContexts, node) => {
  const container =
    node.type === 'productionResource'
      ? createProductionResourceContainer(graphicsContexts, node.id)
      : createStockContainer(graphicsContexts, node.id);

  let centerOffset = { x: 24, y: 24 };
  if (node.type === 'productionResource') centerOffset = { x: 40, y: 54 };

  container.x = node.x - centerOffset.x;
  container.y = node.y - centerOffset.y;
  container.eventMode = 'static';
  container.cursor = 'pointer';
  return container;
};

export const renderElements = (sceneContainerRef, containerRef, graphRef, setSelectedElement, settings) => {
  if (!graphRef.current || !sceneContainerRef.current) return;
  const { nodes, links } = graphRef.current;

  const graphicsContexts = {
    stock: createStockGraphicsContext({ fillColor: '#20363D', borderColor: '#48C0DB52', iconColor: '#40B8D4' }),
    productionResourceBorder: createProductionResourceBorderGraphicsContext({ fillColor: '#121212' }),
    productionResource: createProductionOperationGraphicsContext({
      fillColor: '#20363D',
      borderColor: '#48C0DB52',
      iconColor: '#40B8D4',
    }),
    productionOperation: createProductionOperationGraphicsContext({
      fillColor: '#20363D',
      borderColor: '#48C0DB52',
      iconColor: '#40B8D4',
    }),
    factoryIcon: createFactoryIconBorderGraphicsContext(),
  };

  const isLayoutHorizontal = settings?.orientation === 'horizontal';
  const linkGraphics = createLinkGraphics(links, setSelectedElement, isLayoutHorizontal);
  linkGraphics.forEach((link) => sceneContainerRef.current.addChild(link));

  nodes.forEach((node) => {
    const container = createNodeContainer(graphicsContexts, node);
    container.on('click', (event) => setSelectedElement(node));
    sceneContainerRef.current.addChild(container);
  });
};

export const createApp = () => new Application();

export const initApp = async (
  appRef,
  containerRef,
  sceneContainerRef,
  graphRef,
  resetGraphLayout,
  theme,
  setSelectedElement,
  settings
) => {
  const app = appRef.current;
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
    if (!containerRef.current || !app?.renderer) return;
    app.renderer.resize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    resetGraphLayout(containerRef.current.clientWidth, containerRef.current.clientHeight);

    sceneContainerRef.current.removeChildren();
    renderElements(sceneContainerRef, containerRef, graphRef, setSelectedElement, settings);
  };
  window.addEventListener('resize', handleResize);
  renderElements(sceneContainerRef, containerRef, graphRef, setSelectedElement, settings);
};

export const destroyApp = (app) => {
  if (!app?.renderer) return;
  app.destroy(true, { children: true });
};
