// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Container, Graphics, GraphicsContext, Rectangle, Sprite, Point } from 'pixi.js';
import { NODE_TYPES } from '../constants/nodeLabels';

const MINIMAP_SIZE = { width: 260, height: 150 };
const MINIMAP_MARGINS = 20;
const MARGIN_FACTOR = 1 + MINIMAP_MARGINS / 100;

export class MinimapContainer extends Container {
  constructor(minimapAppRef, sceneContainerRef, graphCanvasRef) {
    super();

    this.minimapAppRef = minimapAppRef;
    this.sceneContainerRef = sceneContainerRef;
    this.graphCanvasRef = graphCanvasRef;
    this.dragTarget = null;
  }

  renderElements() {
    this.removeChildren().forEach((child) => child.destroy({ children: true }));
    this.miniSceneContainer = this.forgeContainer(this.sceneContainerRef.current);

    this.addChild(this.miniSceneContainer);

    this.position.set(0, 0);
    this.createScreenCursor();
    this.updateSceneView();

    const stage = this.minimapAppRef.current.stage;
    stage.eventMode = 'static';
    stage.hitArea = this.minimapAppRef.current.screen;
    stage.on('pointerup', this.onDragEnd);
    stage.on('pointerupoutside', this.onDragEnd);
    stage.on('wheel', this.onWheel);
    stage.on('mousedown', this.onClick);
  }

  createNodeTextures() {
    const createNodeTexture = (fillColor) => {
      const nodeGraphicsContext = new GraphicsContext().rect(0, 0, 2, 2).fill(fillColor);
      return this.minimapAppRef.current.renderer.generateTexture(new Graphics(nodeGraphicsContext));
    };

    this.textures = {
      [NODE_TYPES.STOCK]: createNodeTexture('#48C0DB'),
      [NODE_TYPES.STOCK_SHORTAGE]: createNodeTexture('#DF3537'),
      [NODE_TYPES.PRODUCTION_RESOURCE]: createNodeTexture('#48C0DB'),
      [NODE_TYPES.PRODUCTION_RESOURCE_BOTTLENECK]: createNodeTexture('#DF3537'),
    };
  }

  updateMiniScene() {
    if (!this.miniSceneContainer) return;

    const ratio = this.getSceneRatio();

    // NOTE:
    // This assumes that miniSceneContainer has the exact same structure and
    // child order as sceneContainerRef. If in the future we decide to skip
    // elements (like labels or links) in the minimap, this will break and
    // should be refactored to use an ID-based lookup instead of index matching.
    const updateChildren = (sourceChildren, miniChildren) => {
      for (let i = 0; i < sourceChildren.length; i++) {
        const source = sourceChildren[i];
        const mini = miniChildren[i];

        if (!source || !mini) continue;

        if (Object.values(NODE_TYPES).includes(source.label)) {
          mini.position.set(source.x * ratio, source.y * ratio);

          const newTexture = this.textures[source.label];
          if (mini.texture !== newTexture) {
            mini.texture = newTexture;
          }
        } else if (source.children?.length > 0 && mini.children?.length > 0) {
          updateChildren(source.children, mini.children);
        }
      }
    };

    updateChildren(this.sceneContainerRef.current.children, this.miniSceneContainer.children);
  }

  createScreenCursor() {
    if (this.screenCursor != null) {
      this.removeChild(this.screenCursor);
      this.screenCursor.destroy({ children: true });
    }

    this.screenCursor = new Graphics();
    this.screenCursor.eventMode = 'static';
    this.screenCursor.cursor = 'pointer';

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.onClick = this.onClick.bind(this);

    this.screenCursor.on('pointerdown', this.onDragStart);

    this.addChild(this.screenCursor);

    this.updateScreenCursor();
  }

  updateScreenCursor() {
    const ratio = this.getScreenCursorRatio();
    const screenSize = {
      width: this.graphCanvasRef.current.clientWidth,
      height: this.graphCanvasRef.current.clientHeight,
    };
    const screenCursor = this.screenCursor;
    screenCursor.clear();
    screenCursor
      .rect(0, 0, screenSize.width / ratio, screenSize.height / ratio)
      .stroke({ pixelLine: true, color: 0xffb039, width: 1 });
    screenCursor.pivot.set(screenCursor.width / 2, screenCursor.height / 2);

    const bounds = screenCursor.getBounds();
    screenCursor.hitArea = new Rectangle(0, 0, bounds.width, bounds.height);

    const newX = this.miniSceneContainer.x + screenCursor.pivot.x - this.sceneContainerRef.current.position.x / ratio;
    const newY = this.miniSceneContainer.y + screenCursor.pivot.y - this.sceneContainerRef.current.position.y / ratio;

    screenCursor.position.set(newX, newY);
  }

  updateScene() {
    const ratio = this.getScreenCursorRatio();
    const newX = (this.miniSceneContainer.x + this.screenCursor.pivot.x - this.screenCursor.x) * ratio;
    const newY = (this.miniSceneContainer.y + this.screenCursor.pivot.y - this.screenCursor.y) * ratio;
    this.sceneContainerRef.current.position.set(newX, newY);
  }

  updateSceneView() {
    if (!this.miniSceneContainer) return;

    const miniSceneContainerBounds = this.miniSceneContainer.getBounds();
    const centerX = MINIMAP_SIZE.width / 2 - miniSceneContainerBounds.width / 2;
    const centerY = MINIMAP_SIZE.height / 2 - miniSceneContainerBounds.height / 2;

    this.miniSceneContainer.position.set(centerX, centerY);
    this.updateScreenCursor();
  }

  getScreenCursorRatio() {
    const sceneBoundsWidthAtCurrentZoomLevel =
      5 * this.sceneContainerRef.current.getBoundsFromCache().width * this.sceneContainerRef.current.zoom;

    return sceneBoundsWidthAtCurrentZoomLevel / this.miniSceneContainer.getBounds().width;
  }

  getSceneRatio() {
    const { width, height } = this.sceneContainerRef.current.getLocalBoundsFromCache();
    return width / MINIMAP_SIZE.width > height / MINIMAP_SIZE.height
      ? MINIMAP_SIZE.width / (width * MARGIN_FACTOR)
      : MINIMAP_SIZE.height / (height * MARGIN_FACTOR);
  }

  onWheel(event) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    this.sceneContainerRef.current.zoomOnPoint(zoomDirection);
  }

  onDragStart(event) {
    this.sceneContainerRef.current.stopUpdatePosition();
    this.dragTarget = this.screenCursor;
    const localPosition = this.toLocal(event.global);
    this.dragOffset = new Point(this.screenCursor.x - localPosition.x, this.screenCursor.y - localPosition.y);
    this.minimapAppRef.current.stage.on('pointermove', this.onDragMove);
  }

  onDragMove(event) {
    if (!this.dragTarget || !this.dragTarget.position) return;

    const localPosition = this.toLocal(event.global);
    this.dragTarget.x = localPosition.x + this.dragOffset.x;
    this.dragTarget.y = localPosition.y + this.dragOffset.y;

    this.updateScene();
  }

  onDragEnd() {
    if (!this.dragTarget) return;

    this.minimapAppRef.current.stage.off('pointermove', this.onDragMove);
    this.sceneContainerRef.current.checkBounds();
    this.dragTarget = null;
  }

  onClick(event) {
    if (this.dragTarget) return;

    this.sceneContainerRef.current.stopUpdatePosition();
    const clickPosition = this.toLocal(event.global);
    this.screenCursor.x = clickPosition.x;
    this.screenCursor.y = clickPosition.y;
    this.updateScene();
    this.sceneContainerRef.current.checkBounds();
    this.onDragStart(event);
  }

  forgeContainer(containerSource) {
    const containerForged = new Container();
    const ratio = this.getSceneRatio();

    containerSource.children.forEach((child) => {
      if (Object.values(NODE_TYPES).includes(child.label)) {
        const nodeSprite = new Sprite(this.textures[child.label]);
        nodeSprite.position.set(child.x * ratio, child.y * ratio);
        containerForged.addChild(nodeSprite);
      } else {
        const childContainer = this.forgeContainer(child);
        containerForged.addChild(childContainer);
      }
    });

    return containerForged;
  }

  static getMinimapSize() {
    return MINIMAP_SIZE;
  }
}
