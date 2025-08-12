// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Container, Graphics, GraphicsContext, Rectangle, Sprite } from 'pixi.js';
import { NODE_TYPES } from '../constants/nodeLabels';

const MINIMAP_SIZE = { width: 260, height: 150 };
const MINIMAP_MARGINS = 20;
const MARGIN_FACTOR = 1 + MINIMAP_MARGINS / 100;

export class MinimapContainer extends Container {
  constructor(minimapAppRef, sceneContainerRef, sceneCanvasRef) {
    super();

    this.minimapAppRef = minimapAppRef;
    this.sceneContainerRef = sceneContainerRef;
    this.sceneCanvasRef = sceneCanvasRef;
    this.dragTarget = null;
  }

  renderElements() {
    this.removeChildren();
    this.miniSceneContainer = this.forgeContainer(this.sceneContainerRef.current);

    const miniSceneContainerBounds = this.miniSceneContainer.getBounds();
    const centerX = MINIMAP_SIZE.width / 2 - miniSceneContainerBounds.width / 2;
    const centerY = MINIMAP_SIZE.height / 2 - miniSceneContainerBounds.height / 2;

    this.miniSceneContainer.position.set(centerX, centerY);
    this.addChild(this.miniSceneContainer);

    this.position.set(0, 0);
    this.createScreenCursor();
    this.minimapAppRef.current.stage.eventMode = 'static';
    this.minimapAppRef.current.stage.hitArea = this.minimapAppRef.current.screen;
    this.minimapAppRef.current.stage.on('pointerup', this.onDragEnd);
    this.minimapAppRef.current.stage.on('pointerupoutside', this.onDragEnd);
    this.minimapAppRef.current.stage.on('wheel', this.onWheel);
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

    this.screenCursor.on('pointerdown', this.onDragStart);

    this.addChild(this.screenCursor);

    this.updateScreenCursor();
  }

  updateScreenCursor() {
    const ratio = this.getScreenCursorRatio();
    const screenSize = {
      width: this.sceneCanvasRef.current.clientWidth,
      height: this.sceneCanvasRef.current.clientHeight,
    };
    this.screenCursor.clear();
    this.screenCursor
      .rect(0, 0, screenSize.width / ratio, screenSize.height / ratio)
      .stroke({ pixelLine: true, color: 0xffb039, width: 1 });
    this.screenCursor.pivot.set(this.screenCursor.width / 2, this.screenCursor.height / 2);

    const bounds = this.screenCursor.getBounds();
    this.screenCursor.hitArea = new Rectangle(0, 0, bounds.width, bounds.height);

    const newX =
      this.miniSceneContainer.x + this.screenCursor.pivot.x - this.sceneContainerRef.current.position.x / ratio;
    const newY =
      this.miniSceneContainer.y + this.screenCursor.pivot.y - this.sceneContainerRef.current.position.y / ratio;

    this.screenCursor.position.set(newX, newY);
  }

  updateScene() {
    const ratio = this.getScreenCursorRatio();
    const newX = (this.miniSceneContainer.x + this.screenCursor.pivot.x - this.screenCursor.x) * ratio;
    const newY = (this.miniSceneContainer.y + this.screenCursor.pivot.y - this.screenCursor.y) * ratio;
    this.sceneContainerRef.current.translateTo(newX, newY);
  }

  getScreenCursorRatio() {
    return this.sceneContainerRef.current.getBounds().width / this.miniSceneContainer.getBounds().width;
  }

  getSceneRatio() {
    const { width, height } = this.sceneContainerRef.current.getLocalBounds();
    return width / MINIMAP_SIZE.width > height / MINIMAP_SIZE.height
      ? MINIMAP_SIZE.width / (width * MARGIN_FACTOR)
      : MINIMAP_SIZE.height / (height * MARGIN_FACTOR);
  }

  onWheel(event) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    this.sceneContainerRef.current.zoomOnPoint(zoomDirection);
  }

  onDragStart() {
    this.dragTarget = this.screenCursor;
    this.minimapAppRef.current.stage.on('pointermove', this.onDragMove);
  }

  onDragMove(event) {
    if (!this.dragTarget) return;

    this.dragTarget.parent.toLocal(event.global, null, this.dragTarget);
    this.updateScene();
  }

  onDragEnd() {
    if (!this.dragTarget) return;

    this.minimapAppRef.current.stage.off('pointermove', this.onDragMove);
    this.dragTarget = null;
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
