// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 0.2;
const ZOOM_SPEED = 0.5;

const interpolateLinear = (a, b, t) => {
  return a + (b - a) * t;
};

export class SceneContainer extends Container {
  constructor(sceneApp, canvasSceneRef) {
    super();
    this.canvasScene = canvasSceneRef.current;

    this.zoom = DEFAULT_ZOOM;
    this.scale.set(this.zoom);
    // TODO: find a way to zoom automatically on a default point of interest
    const bounds = this.getBounds();
    this.origin = new Point(bounds.maxX / 2, bounds.maxY / 2);
    this.position = this.origin;

    this.sceneApp = sceneApp;

    this.dragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.containerStart = { x: 0, y: 0 };

    this.interactive = true;

    this.translateTo = this.translateTo.bind(this);
    this.moveTowardTargetPosition = this.moveTowardTargetPosition.bind(this);
    this.zoomWithWheel = this.zoomWithWheel.bind(this);

    this.backToOrigin = this.backToOrigin.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    canvasSceneRef.current.addEventListener('wheel', this.zoomWithWheel);
    canvasSceneRef.current.addEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.addEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointerout', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointermove', this.onDragMove);
  }

  destroy(canvasSceneRef) {
    if (!canvasSceneRef.current) return;
    canvasSceneRef.current.removeEventListener('wheel', this.zoomWithWheel);
    canvasSceneRef.current.removeEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.removeEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointerout', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  moveTowardTargetPosition() {
    const nearTargetZoom = Math.abs(this.targetZoom - this.zoom) < 0.0005;
    const nearTargetPosition = Math.abs(this.targetX - this.x) < 0.05 && Math.abs(this.targetY - this.y) < 0.05;

    if (nearTargetPosition && nearTargetZoom) {
      this.position.set(this.targetX, this.targetY);
      this.scale.set(this.targetZoom);
      this.sceneApp.ticker.remove(this.moveTowardTargetPosition);
      this.checkBounds();
    } else {
      this.x = interpolateLinear(this.x, this.targetX, 0.1);
      this.y = interpolateLinear(this.y, this.targetY, 0.1);

      const newZoom = interpolateLinear(this.zoom, this.targetZoom, 0.1);
      this.zoom = newZoom;
      this.scale.set(newZoom);
    }
  }

  translateTo(x, y, zoom) {
    this.targetX = x;
    this.targetY = y;
    this.targetZoom = zoom;
    this.sceneApp.ticker.add(this.moveTowardTargetPosition);
  }

  backToOrigin() {
    this.translateTo(this.origin.x, this.origin.y, DEFAULT_ZOOM);
  }

  stopBackToOrigin() {
    this.sceneApp.ticker.remove(this.moveTowardTargetPosition);
  }

  zoomOnPoint(zoomDirection, zoomPoint) {
    if (!zoomPoint) {
      zoomPoint = new Point(this.canvasScene.clientWidth / 2, this.canvasScene.clientHeight / 2);
    }

    const mouseWorldPosition = this.toLocal(zoomPoint);
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom + zoomDirection * this.zoom * ZOOM_SPEED));
    const scaleRatio = newZoom / this.zoom;
    const targetX = this.x - mouseWorldPosition.x * (scaleRatio - 1) * this.zoom;
    const targetY = this.y - mouseWorldPosition.y * (scaleRatio - 1) * this.zoom;

    this.translateTo(targetX, targetY, newZoom);
  }

  zoomWithWheel(event) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    const zoomPoint = new Point(event.offsetX, event.offsetY);

    this.zoomOnPoint(zoomDirection, zoomPoint);
  }

  checkBounds() {
    const farRight = this.canvasScene.clientWidth * 0.9;
    const farLeft = this.canvasScene.clientWidth * 0.1;
    const farTop = this.canvasScene.clientHeight * 0.2;
    const farBottom = this.canvasScene.clientHeight * 0.8;

    const sceneBounds = this.getBounds();
    const outOfBounds =
      sceneBounds.minX > farRight ||
      sceneBounds.maxX < farLeft ||
      sceneBounds.minY > farBottom ||
      sceneBounds.maxY < farTop;

    if (!outOfBounds) return;

    let returnToX, returnToY;

    if (sceneBounds.minX > farRight) {
      returnToX = farRight;
      returnToY = this.y;
    } else if (sceneBounds.maxX < farLeft) {
      returnToX = farLeft - sceneBounds.width;
      returnToY = this.y;
    }
    if (sceneBounds.minY > farBottom) {
      returnToY = farBottom;
      returnToX = this.x;
    } else if (sceneBounds.maxY < farTop) {
      returnToY = farTop - sceneBounds.height;
      returnToX = this.x;
    }

    this.translateTo(returnToX, returnToY, this.zoom);
  }

  onDragStart(event) {
    this.dragging = true;
    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    this.dragStart = { x: mouseScreenPosition.x, y: mouseScreenPosition.y };
    this.containerStart = { x: this.x, y: this.y };

    this.stopBackToOrigin();
  }

  onDragMove(event) {
    if (!this.dragging) return;

    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    const dragX = mouseScreenPosition.x - this.dragStart.x;
    const dragY = mouseScreenPosition.y - this.dragStart.y;

    this.position.set(this.containerStart.x + dragX, this.containerStart.y + dragY);
  }

  onDragEnd() {
    this.dragging = false;
    this.checkBounds();
  }
}
