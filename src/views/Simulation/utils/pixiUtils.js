// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AdvancedBloomFilter } from 'pixi-filters';
import { AlphaFilter, Application, Graphics, GraphicsContext, Container, Text } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { MinimapContainer } from './MinimapContainer';
import { SceneContainer } from './SceneContainer';
import { PACKAGE_ICON_LINES, GEAR_ICON_LINES, FACTORY_ICON_LINES } from './shapes';

const GRAY_LINE_COLOR = 0xb9bac0;
const RED_LINE_COLOR = 0xdf3537;
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

const createPackageIconGraphicsContext = (options) => {
  const graphicsContext = new GraphicsContext();
  drawIcon(graphicsContext, PACKAGE_ICON_LINES, 25, 24, 18, 20);
  graphicsContext.stroke({ pixelLine: true, color: options?.lineColor ?? '#48C0DB', width: 1.5 });
  return graphicsContext;
};

const createOperationsCountBadgeGraphicsContext = () => {
  return new GraphicsContext().circle(0, 0, 10).fill('#2F6A79');
};

const createStockGraphicsContext = (options) => {
  const graphicsContext = new GraphicsContext()
    .rect(0, 0, 68, 68)
    .fill('#00000000')
    .roundRect(10, 10, 48, 48, 8)
    .fill(options.fillColor)
    .stroke({ pixelLine: true, color: options.borderColor, width: 1.5 });
  return graphicsContext;
};

const createProductionResourceGraphicsContext = (options) => {
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

const createProductionResourceBackgroundGraphicsContext = () => {
  const radius = 8;
  const background = new GraphicsContext().roundRect(0, 0, 80, 100, radius).fill('#121212');
  return background;
};

const createProductionResourceBorderGraphicsContext = (options) => {
  const radius = 8;
  const halfWidth = 28;
  const margin = 10;
  const border = new GraphicsContext()
    .rect(0, 0, 100, 100)
    .fill('#00000000')
    .roundRect(margin, margin, margin + 80, margin + 80, radius)
    .fill('#121212')
    .moveTo(margin, margin + 80)
    .lineTo(margin, margin + halfWidth)
    .arcTo(margin, margin, margin + halfWidth, margin, radius)
    .lineTo(margin + halfWidth, margin)
    .moveTo(margin + 80 - halfWidth, margin)
    .arcTo(margin + 80, margin, margin + 80, margin + 80, radius)
    .lineTo(margin + 80, margin + 80)
    .stroke({
      pixelLine: options?.borderWidth == null,
      color: options?.borderColor ?? GRAY_LINE_COLOR,
      width: options?.borderWidth ?? 1.5,
    });
  return border;
};

const createFactoryIconGraphicsContext = (options) => {
  const graphicsContext = new GraphicsContext();
  drawIcon(graphicsContext, FACTORY_ICON_LINES, 0, 0, 20, 20);
  graphicsContext.stroke({ pixelLine: true, color: options?.lineColor ?? GRAY_LINE_COLOR, width: 1.5 });
  return graphicsContext;
};

const createStockContainer = (graphicsContexts, name, hasShortages = false) => {
  const container = new Container();
  const stockContextKey = hasShortages ? 'stockLevel1' : 'stockLevel0';
  if (hasShortages) {
    const stockHalo = new Graphics(graphicsContexts[stockContextKey]);
    stockHalo.filters = [new AdvancedBloomFilter({ blur: 1, quality: 32, bloomScale: 1, brightness: 1 })];
    stockHalo.position.set(-10, -10);
    container.addChild(stockHalo);
  }
  const stock = new Graphics(graphicsContexts[stockContextKey]);
  stock.position.set(-10, -10);
  const iconContextKey = hasShortages ? 'packageIconLevel1' : 'packageIconLevel0';
  const packageIcon = new Graphics(graphicsContexts[iconContextKey]);
  packageIcon.position.set(-10, -10);
  const label = createLabel(name);
  label.anchor.set(0.5);
  label.position.set(34, 64);

  container.addChild(stock);
  container.addChild(packageIcon);
  container.addChild(label);
  return container;
};

const createProductionResourceContainer = (graphicsContexts, name, hasBottlenecks, operationsCount) => {
  const borderContextKey = hasBottlenecks ? 'productionResourceBorderLevel1' : 'productionResourceBorderLevel0';
  const border = new Graphics(graphicsContexts[borderContextKey]);
  if (hasBottlenecks)
    border.filters = [new AdvancedBloomFilter({ blur: 1, quality: 32, bloomScale: 1.5, brightness: 1 })];
  const iconContextKey = hasBottlenecks ? 'factoryIconLevel1' : 'factoryIconLevel0';
  const factoryIcon = new Graphics(graphicsContexts[iconContextKey]);
  factoryIcon.x = 40;

  const borderContainer = new Container();
  borderContainer.setSize(100, 100);
  borderContainer.addChild(border);

  const container = new Container();

  const background = new Graphics(graphicsContexts.productionResourceBackground);
  background.x = 10;
  background.y = 10;
  const resource = new Graphics(graphicsContexts.productionResource);
  resource.x = 26;
  resource.y = 30;
  const operationsBadge = new Graphics(graphicsContexts.operationsCountBadge);
  operationsBadge.x = 70;
  operationsBadge.y = 34;
  const operationsBadgeText = createLabel(`${operationsCount ?? 0}`);
  operationsBadgeText.anchor.set(0.5);
  operationsBadgeText.position.set(operationsBadge.x, operationsBadge.y);

  const label = createLabel(name);
  label.anchor.set(0.5);
  label.position.set(50, 104);

  container.addChild(borderContainer);
  container.addChild(background);
  container.addChild(factoryIcon);
  container.addChild(resource);
  container.addChild(operationsBadge);
  container.addChild(operationsBadgeText);
  container.addChild(label);
  return container;
};

const createLinkGraphics = (links, setSelectedElement, settings) => {
  const isLayoutHorizontal = settings?.orientation === 'horizontal';
  const spacingFactor = settings.spacing / 100.0;

  return links.map((link) => {
    const graphics = new Graphics();
    graphics.alpha = link.isGrayedOut ? 0.15 : 0.8;
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    const { source, target } = link;
    const sourceOffset = { x: 0, y: 0 };
    const targetOffset = { x: 0, y: 0 };
    const controlPointsOffset = { x: 0, y: 0 };

    if (isLayoutHorizontal) {
      sourceOffset.x = link.source.type === 'stock' ? 24 : 40;
      targetOffset.x = link.target.type === 'stock' ? 24 : 40;
      controlPointsOffset.x = 10 + 150 * spacingFactor;
    } else {
      sourceOffset.y = link.source.type === 'stock' ? 24 : 40;
      targetOffset.y = link.target.type === 'stock' ? 24 : 60;
      controlPointsOffset.y = 10 + 150 * spacingFactor;
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
      ? createProductionResourceContainer(
          graphicsContexts,
          node.id,
          node.bottlenecksCount != null,
          node.operationsCount
        )
      : createStockContainer(graphicsContexts, node.id, node.shortagesCount != null);

  let centerOffset = { x: 24, y: 24 };
  if (node.type === 'productionResource') centerOffset = { x: 40, y: 54 };

  container.x = node.x - centerOffset.x;
  container.y = node.y - centerOffset.y;
  container.eventMode = 'static';
  container.cursor = 'pointer';
  return container;
};

export const renderElements = (mainContainer, graphRef, setSelectedElement, settings) => {
  if (!graphRef.current || !mainContainer) return;

  const { nodes, links } = graphRef.current;

  const graphicsContexts = {
    operationsCountBadge: createOperationsCountBadgeGraphicsContext(),
    stockLevel0: createStockGraphicsContext({ fillColor: '#20363D', borderColor: '#48C0DB52' }),
    stockLevel1: createStockGraphicsContext({ fillColor: '#DF3537', borderColor: '#DF3537' }),
    productionResourceBackground: createProductionResourceBackgroundGraphicsContext(),
    productionResourceBorderLevel0: createProductionResourceBorderGraphicsContext({ borderColor: GRAY_LINE_COLOR }),
    productionResourceBorderLevel1: createProductionResourceBorderGraphicsContext({
      borderColor: RED_LINE_COLOR,
      borderWidth: 4,
    }),
    productionResource: createProductionResourceGraphicsContext({
      fillColor: '#20363D',
      borderColor: '#48C0DB52',
      iconColor: '#40B8D4',
    }),
    factoryIconLevel0: createFactoryIconGraphicsContext(),
    factoryIconLevel1: createFactoryIconGraphicsContext({ lineColor: RED_LINE_COLOR }),
    packageIconLevel0: createPackageIconGraphicsContext(),
    packageIconLevel1: createPackageIconGraphicsContext({ lineColor: '#F7F7F8' }),
  };

  const backContainer = new Container();
  backContainer.filters = new AlphaFilter({ alpha: 0.5 });
  const frontContainer = new Container();
  mainContainer.addChild(backContainer);
  mainContainer.addChild(frontContainer);

  const linkGraphics = createLinkGraphics(links, setSelectedElement, settings);
  linkGraphics.forEach((link) => frontContainer.addChild(link));

  nodes.forEach((node) => {
    const container = createNodeContainer(graphicsContexts, node);
    container.on('click', (event) => setSelectedElement(node));
    if (node.isGrayedOut) backContainer.addChild(container);
    else frontContainer.addChild(container);
  });
};

export const createApp = () => new Application();

export const initApp = async (
  sceneAppRef,
  sceneCanvasRef,
  sceneContainerRef,
  graphRef,
  resetGraphLayout,
  theme,
  setSelectedElement,
  settings
) => {
  const app = sceneAppRef.current;
  const canvas = sceneCanvasRef.current;

  await app.init({
    width: canvas.clientWidth,
    height: canvas.clientHeight,
    backgroundColor: theme.palette.background.default,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });

  canvas.appendChild(app.canvas);
  app.canvas.style.width = '100%';
  app.canvas.style.height = '100%';
  app.canvas.style.display = 'block';
  canvas.hitArea = app.screen;
  canvas.eventMode = 'static';

  sceneContainerRef.current = new SceneContainer(app, sceneCanvasRef);
  app.stage.addChild(sceneContainerRef.current);

  const handleResize = () => {
    if (!canvas || !app?.renderer) return;
    app.renderer.resize(canvas.clientWidth, canvas.clientHeight);
    resetGraphLayout(canvas.clientWidth, canvas.clientHeight);

    sceneContainerRef.current.removeChildren();
    renderElements(sceneContainerRef.current, graphRef, setSelectedElement, settings);
  };
  window.addEventListener('resize', handleResize);

  renderElements(sceneContainerRef.current, graphRef, setSelectedElement, settings);
  sceneContainerRef.current.init();
};

export const destroyApp = (app) => {
  if (!app?.renderer) return;
  app.destroy(true, { children: true });
};

export const initMinimap = async (
  minimapAppRef,
  minimapContainerRef,
  minimapCanvasRef,
  sceneContainerRef,
  sceneCanvasRef,
  theme
) => {
  const minimapApp = minimapAppRef.current;
  const minimapCanvas = minimapCanvasRef.current;

  minimapContainerRef.current = new MinimapContainer(minimapAppRef, sceneContainerRef, sceneCanvasRef);
  sceneContainerRef.current.setMinimapContainer(minimapContainerRef);

  const minimapContainer = minimapContainerRef.current;

  minimapApp.stage.addChild(minimapContainer);

  await minimapAppRef.current.init({
    width: MinimapContainer.getMinimapSize().width,
    height: MinimapContainer.getMinimapSize().height,
    backgroundColor: theme.palette.background.default,
    resolution: window.devicePixelRatio || 1,
    autoDensity: true,
    antialias: true,
  });

  minimapCanvas.appendChild(minimapApp.canvas);
  minimapApp.canvas.style.width = '100%';

  minimapApp.canvas.style.height = '100%';
  minimapApp.canvas.style.display = 'block';

  const handleResizeMinimap = () => {
    if (!minimapContainer || !minimapApp?.renderer) return;
    minimapContainer.renderElements();
  };
  window.addEventListener('resize', handleResizeMinimap);
  minimapContainer.renderElements();
};
