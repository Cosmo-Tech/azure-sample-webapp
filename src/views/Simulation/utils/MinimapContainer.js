// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Container, Graphics, Rectangle } from 'pixi.js';

const MINIMAP_SIZE = { width: 200, height: 100 };
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
    this.miniSceneContainer = this.cloneContainer(this.sceneContainerRef.current);

    const ratio = this.getSceneRatio();
    this.miniSceneContainer.scale.set(ratio);
    const miniSceneContainerBounds = this.miniSceneContainer.getBounds();
    const centerX = MINIMAP_SIZE.width / 2 - miniSceneContainerBounds.width / 2;
    const centerY = MINIMAP_SIZE.height / 2 - miniSceneContainerBounds.height / 2;

    this.miniSceneContainer.position.set(centerX, centerY);
    this.addChild(this.miniSceneContainer);

    this.screenCursor = new Graphics();
    this.createScreenCursor();

    this.position.set(0, 0);
    this.minimapAppRef.current.stage.eventMode = 'static';
    this.minimapAppRef.current.stage.hitArea = this.minimapAppRef.current.screen;
    this.minimapAppRef.current.stage.on('pointerup', this.onDragEnd);
    this.minimapAppRef.current.stage.on('pointerupoutside', this.onDragEnd);
    this.minimapAppRef.current.stage.on('wheel', this.onWheel);
  }

  createScreenCursor() {
    if (this.screenCursor instanceof Graphics) {
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
      .stroke({ pixelLine: true, color: 0xff0000, width: 1 });
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

    return width > height
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

  cloneContainer(containerSource) {
    const containerClone = new Container();

    containerSource.children.forEach((child) => {
      if (child instanceof Graphics) {
        const childClone = child.clone(true);
        childClone.position.set(child.x, child.y);
        containerClone.addChild(childClone);
      } else if (child instanceof Container) {
        const childClone = this.cloneContainer(child);
        childClone.position.set(child.x, child.y);
        containerClone.addChild(childClone);
      }
    });

    return containerClone;
  }

  static getMinimapSize() {
    return MINIMAP_SIZE;
  }
}
