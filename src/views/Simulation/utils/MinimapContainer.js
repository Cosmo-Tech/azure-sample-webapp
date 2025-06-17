// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Container, Graphics } from 'pixi.js';

const MINIMAP_SIZE = { width: 200, height: 100 };
const MINIMAP_MARGINS = 20;
const MARGIN_FACTOR = 1 + MINIMAP_MARGINS / 100;

export class MinimapContainer extends Container {
  constructor(sceneContainer) {
    super();

    this.sceneContainer = sceneContainer;

    this.renderElements();

    this.interactive = true;
    this.dragging = false;
    this.dragStart = { x: 0, y: 0 };
  }

  renderElements() {
    if (!this.position) return;

    this.removeChildren();
    this.addChild(...this.cloneContainer(this.sceneContainer).children);
    this.scale.set(this.getMapRatio());

    const centerX = MINIMAP_SIZE.width / 2 - this.getBounds().width / 2;
    const centerY = MINIMAP_SIZE.height / 2 - this.getBounds().height / 2;

    this.position.set(centerX, centerY);
  }

  getMapRatio() {
    const { width, height } = this.sceneContainer.getLocalBounds();

    return width > height
      ? MINIMAP_SIZE.width / (width * MARGIN_FACTOR)
      : MINIMAP_SIZE.height / (height * MARGIN_FACTOR);
  }

  onDragStart(event) {
    this.dragging = true;
    this.dragStart.x = event.data.global.x;
    this.dragStart.y = event.data.global.y;
  }

  onDragMove(event) {
    if (this.dragging) {
      const dx = event.data.global.x - this.dragStart.x;
      const dy = event.data.global.y - this.dragStart.y;
      this.position.set(this.x + dx, this.y + dy);
      this.dragStart.x = event.data.global.x;
      this.dragStart.y = event.data.global.y;
    }
  }

  onDragEnd() {
    this.dragging = false;
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

    containerClone.position.set(containerSource.x, containerSource.y);

    return containerClone;
  }

  static getMinimapSize() {
    return MINIMAP_SIZE;
  }
}
