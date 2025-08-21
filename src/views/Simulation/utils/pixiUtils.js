// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { AdvancedBloomFilter, GlowFilter } from 'pixi-filters';
import { AlphaFilter, Application, BitmapText, Container, Graphics, GraphicsContext, Sprite } from 'pixi.js';
import 'pixi.js/unsafe-eval';
import { NODE_TYPES } from '../constants/nodeLabels';
import { MinimapContainer } from './MinimapContainer';
import { SceneContainer } from './SceneContainer';
import { PACKAGE_ICON_LINES, GEAR_ICON_LINES, FACTORY_ICON_LINES } from './shapes';

const GRAY_LINE_COLOR = 0xb9bac0;
const LINK_COLOR = 0xf5f3f3;
const HIDDEN_LINK_COLOR = 0x636363;
const RED_LINE_COLOR = 0xdf3537;
const DEFAULT_TEXT_STYLE = { fontFamily: 'Arial', fontSize: 12, fill: 0xffffff, align: 'center' };
const BLOOM_FILTER = new AdvancedBloomFilter({ blur: 1, quality: 16, bloomScale: 1.8, brightness: 1 });
const SELECTED_LINK_FILTER = new GlowFilter({ distance: 10, outerStrength: 6, color: 0xffffff });
const SELECTED_NODE_FILTER = new AdvancedBloomFilter({
  threshold: 0.1,
  bloomScale: 1.2,
  brightness: 1.5,
  blur: 1,
  quality: 20,
});
const NODE_LABEL_LINE_LENGTH = 24;

const createLabel = (value, forceSplit = true) => {
  const splitLabel = (str) => {
    let result = '';
    let start = 0;
    while (start < str.length) {
      const end = Math.min(start + NODE_LABEL_LINE_LENGTH, str.length);
      const slice = str.slice(start, end);
      const breakIndex = Math.max(slice.lastIndexOf('_'), slice.lastIndexOf(' '));

      if (end !== str.length && breakIndex > -1 && start + breakIndex + 1 < str.length) {
        result += str.slice(start, start + breakIndex) + '\n';
        start += breakIndex + 1;
      } else {
        result += slice + (end < str.length ? '\n' : '');
        start = end;
      }
    }
    return result;
  };

  const maxLabelLength = 3 * NODE_LABEL_LINE_LENGTH;
  let label = value;
  if (label.length > maxLabelLength) label = label.substring(0, maxLabelLength) + '...';
  if (forceSplit) label = splitLabel(label);

  return new BitmapText({ text: label, style: DEFAULT_TEXT_STYLE });
};

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

const createStockContainer = (textures, name, isHighlighted = false) => {
  const container = new Container();
  container.label = isHighlighted ? NODE_TYPES.STOCK_SHORTAGE : NODE_TYPES.STOCK;
  const stockTextureKey = isHighlighted ? 'stockLevel1' : 'stockLevel0';
  if (isHighlighted) {
    const stockHalo = new Sprite(textures[stockTextureKey]);
    stockHalo.filters = [BLOOM_FILTER];
    stockHalo.position.set(-10, -10);
    container.addChild(stockHalo);
  }
  const stock = new Sprite(textures[stockTextureKey]);
  stock.position.set(-10, -10);
  const iconTextureKey = isHighlighted ? 'packageIconLevel1' : 'packageIconLevel0';
  const packageIcon = new Sprite(textures[iconTextureKey]);
  packageIcon.anchor.set(0.5);
  packageIcon.position.set(24, 24);
  const label = createLabel(name);
  label.anchor.set(0.5);
  label.position.set(24, 67);

  container.addChild(stock);
  container.addChild(packageIcon);
  container.addChild(label);
  return container;
};

const createProductionResourceContainer = (textures, name, isHighlighted, operationsCount) => {
  const borderTextureKey = isHighlighted ? 'productionResourceBorderLevel1' : 'productionResourceBorderLevel0';
  const border = new Sprite(textures[borderTextureKey]);
  if (isHighlighted) border.filters = [BLOOM_FILTER];
  const iconTextureKey = isHighlighted ? 'factoryIconLevel1' : 'factoryIconLevel0';
  const factoryIcon = new Sprite(textures[iconTextureKey]);
  factoryIcon.x = 40;

  const borderContainer = new Container();
  borderContainer.setSize(100, 100);
  borderContainer.addChild(border);

  const container = new Container();
  container.label = isHighlighted ? NODE_TYPES.PRODUCTION_RESOURCE_BOTTLENECK : NODE_TYPES.PRODUCTION_RESOURCE;

  const background = new Sprite(textures.productionResourceBackground);
  background.x = 10;
  background.y = 10;
  const resource = new Sprite(textures.productionResource);
  resource.x = 26;
  resource.y = 30;
  const operationsBadge = new Sprite(textures.operationsCountBadge);
  operationsBadge.anchor.set(0.5);
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

const createLinkGraphics = (links, setSelectedElementId, settings) => {
  const isLayoutHorizontal = settings?.orientation === 'horizontal';
  const spacingFactor = settings.spacing / 100.0;

  return links.map((link) => {
    const graphics = new Graphics();
    graphics.eventMode = 'static';
    graphics.cursor = 'pointer';

    const { source, target } = link;
    const sourceOffset = { x: 0, y: 0 };
    const targetOffset = { x: 0, y: 0 };
    const controlPointsOffset = { x: 0, y: 0 };

    if (isLayoutHorizontal) {
      sourceOffset.x = link.source.type === 'stock' ? 30 : 40;
      targetOffset.x = link.target.type === 'stock' ? 30 : 48;
      controlPointsOffset.x = 10 + 600 * spacingFactor;
    } else {
      sourceOffset.y = link.source.type === 'stock' ? 58 : 66;
      targetOffset.y = link.target.type === 'stock' ? 30 : 60;
      controlPointsOffset.y = 10 + 600 * spacingFactor;
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
    graphics.stroke({
      pixelLine: true,
      width: 1,
      color: link.isGrayedOut ? HIDDEN_LINK_COLOR : LINK_COLOR,
    });
    graphics.on('click', (event) => setSelectedElementId(link.data.id));
    graphics.filters = link.isSelected ? [SELECTED_LINK_FILTER] : [];
    graphics.elementId = link.data.id;
    return graphics;
  });
};

const createNodeContainer = (textures, node) => {
  const container =
    node.type === 'productionResource'
      ? createProductionResourceContainer(textures, node.id, node.isHighlighted, node.operationsCount)
      : createStockContainer(textures, node.id, node.isHighlighted);

  let centerOffset = { x: 24, y: 24 };
  if (node.type === 'productionResource') centerOffset = { x: 50, y: 54 };

  container.x = node.x - centerOffset.x;
  container.y = node.y - centerOffset.y;
  container.eventMode = 'static';
  container.cursor = 'pointer';
  container.elementId = node.id;
  container.filters = node.isSelected ? [SELECTED_NODE_FILTER] : [];
  return container;
};

const generateTextures = (app) => {
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

  const textures = {};
  for (const [key, graphicsContext] of Object.entries(graphicsContexts)) {
    textures[key] = app.renderer.generateTexture(new Graphics(graphicsContext));
  }
  return textures;
};

export const renderElements = (sceneContainerRef, graphRef, setSelectedElementId, settings) => {
  if (!graphRef.current || !sceneContainerRef.current?.textures) return;

  const { nodes, links } = graphRef.current;
  const textures = sceneContainerRef.current.textures;

  const backContainer = new Container();
  backContainer.filters = new AlphaFilter({ alpha: 0.25 });
  const frontContainer = new Container();
  sceneContainerRef.current.addChild(backContainer);
  sceneContainerRef.current.addChild(frontContainer);

  const linkGraphics = createLinkGraphics(links, setSelectedElementId, settings);
  linkGraphics.forEach((link) => frontContainer.addChild(link));

  nodes.forEach((node) => {
    const container = createNodeContainer(textures, node);
    container.on('click', (event) => setSelectedElementId(node.id));
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
  setSelectedElementId,
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
  sceneContainerRef.current.textures = generateTextures(app);
  app.stage.addChild(sceneContainerRef.current);

  const handleResize = () => {
    if (!canvas || !app?.renderer) return;
    app.renderer.resize(canvas.clientWidth, canvas.clientHeight);
    resetGraphLayout(canvas.clientWidth, canvas.clientHeight);

    sceneContainerRef.current.removeChildren().forEach((child) => {
      child.destroy({ children: true, texture: false, baseTexture: false });
    });
    renderElements(sceneContainerRef, graphRef, setSelectedElementId, settings);
    sceneContainerRef.current.setOrigin();
  };
  window.addEventListener('resize', handleResize);

  renderElements(sceneContainerRef, graphRef, setSelectedElementId, settings);
  sceneContainerRef.current.setOrigin();
};

export const destroyApp = (app) => {
  if (!app?.renderer) return;
  app.destroy(true, { children: true, texture: true, baseTexture: true });
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
  minimapContainer.createNodeTextures();

  const handleResizeMinimap = () => {
    if (!minimapContainer || !minimapApp?.renderer) return;
    minimapContainer.updateSceneView();
  };
  window.addEventListener('resize', handleResizeMinimap);
  minimapContainer.renderElements();
};
