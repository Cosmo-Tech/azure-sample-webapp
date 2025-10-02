// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 0.2;
const ZOOM_SPEED = 0.5;
const FOCUS_ZOOM = 1;

const interpolateLinear = (a, b, t) => {
  return a + (b - a) * t;
};

export class SceneContainer extends Container {
  constructor(sceneApp, canvasSceneRef) {
    super();
    this.canvasScene = canvasSceneRef.current;

    this.bounds = null;
    this.localBounds = null;

    this.setZoom(DEFAULT_ZOOM);
    // TODO: find a way to zoom automatically on a default point of interest

    this.sceneApp = sceneApp;

    this.isPointerDown = false;
    this.dragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.containerStart = { x: 0, y: 0 };

    this.interactive = true;

    this.translateTo = this.translateTo.bind(this);
    this.updatePositionAndScale = this.updatePositionAndScale.bind(this);

    this.onWheel = this.onWheel.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

    canvasSceneRef.current.addEventListener('wheel', this.onWheel);
    canvasSceneRef.current.addEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.addEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointerout', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointermove', this.onDragMove);
  }

  resetBounds() {
    this.bounds = null;
    this.localBounds = null;
  }

  getBoundsFromCache() {
    if (this.bounds == null) this.bounds = this.getBounds();
    return this.bounds;
  }

  getLocalBoundsFromCache() {
    if (this.localBounds == null) this.localBounds = this.getLocalBounds();
    return this.localBounds;
  }

  setOrigin() {
    this.sceneApp.ticker.remove(this.updatePositionAndScale);
    this.setZoom(DEFAULT_ZOOM);
    const sceneWidth = this.width;
    const sceneHeight = this.height;
    const screenWidth = this.canvasScene.clientWidth;
    const screenHeight = this.canvasScene.clientHeight;
    this.origin = new Point(-sceneWidth / 2 + screenWidth / 2, -sceneHeight / 2 + screenHeight / 2);
    this.position.set(this.origin.x, this.origin.y);
  }

  setMinimapContainer(minimapContainerRef) {
    this.minimapContainerRef = minimapContainerRef;
  }

  destroy(canvasSceneRef) {
    if (!canvasSceneRef.current) return;
    canvasSceneRef.current.removeEventListener('wheel', this.onWheel);
    canvasSceneRef.current.removeEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.removeEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointerout', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  updatePositionAndScale() {
    const nearTargetZoom = Math.abs(this.targetZoom - this.zoom) < 0.0005;
    const nearTargetPosition = Math.abs(this.targetX - this.x) < 0.05 && Math.abs(this.targetY - this.y) < 0.05;

    if (nearTargetPosition && nearTargetZoom) {
      this.position.set(this.targetX, this.targetY);
      this.setZoom(this.targetZoom);
      this.sceneApp.ticker.remove(this.updatePositionAndScale);
      this.checkBounds();
    } else {
      this.x = interpolateLinear(this.x, this.targetX, 0.1);
      this.y = interpolateLinear(this.y, this.targetY, 0.1);

      const newZoom = interpolateLinear(this.zoom, this.targetZoom, 0.1);
      this.setZoom(newZoom);
      this.minimapContainerRef.current.updateScreenCursor();
    }
  }

  setZoom(zoom) {
    this.scale.set(zoom);
    this.zoom = zoom;
  }

  translateTo(x, y, zoom = this.zoom) {
    this.targetX = x;
    this.targetY = y;
    this.targetZoom = zoom;
    this.sceneApp.ticker.add(this.updatePositionAndScale);
  }

  findElementById(elementId) {
    const recurseSearch = (elements) => {
      if (!Array.isArray(elements) || elements.length === 0) return null;
      let elementFound = elements.find((child) => child.elementId === elementId);
      if (elementFound != null) return elementFound;

      for (const child of elements) {
        elementFound = recurseSearch(child.children);
        if (elementFound != null) return elementFound;
      }
    };

    return recurseSearch(this.children);
  }

  getScreenCenterPoint() {
    return new Point(this.canvasScene.clientWidth / 2, this.canvasScene.clientHeight / 2);
  }

  getPointWithZoomOffset(x, y, zoom = this.zoom) {
    return new Point(x * zoom, y * zoom);
  }

  isLinkElement(element) {
    return element.label === 'Graphics';
  }

  centerOnElement(element) {
    if (element == null) return;

    const elementCenter = this.isLinkElement(element)
      ? {
          x: (element.bounds.minX + element.bounds.maxX) / 2,
          y: (element.bounds.minY + element.bounds.maxY) / 2,
        }
      : {
          x: element.x + element.width / 2,
          y: element.y + element.height / 2,
        };
    const screenCenterPoint = this.getScreenCenterPoint();
    const nodeCenterPoint = this.getPointWithZoomOffset(elementCenter.x, elementCenter.y, FOCUS_ZOOM);
    this.translateTo(-nodeCenterPoint.x + screenCenterPoint.x, -nodeCenterPoint.y + screenCenterPoint.y, FOCUS_ZOOM);
  }

  backToOrigin() {
    this.translateTo(this.origin.x, this.origin.y, DEFAULT_ZOOM);
  }

  stopUpdatePosition() {
    this.sceneApp.ticker.remove(this.updatePositionAndScale);
  }

  zoomOnPoint(zoomDirection, zoomPoint, { immediate = false } = {}) {
    const point = zoomPoint ?? this.getScreenCenterPoint();

    const mouseWorldPosition = this.toLocal(point);
    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom + zoomDirection * this.zoom * ZOOM_SPEED));

    const scaleRatio = newZoom / this.zoom;
    const targetX = this.x - mouseWorldPosition.x * (scaleRatio - 1) * this.zoom;
    const targetY = this.y - mouseWorldPosition.y * (scaleRatio - 1) * this.zoom;

    if (!immediate) {
      this.translateTo(targetX, targetY, newZoom);
    } else {
      this.position.set(targetX, targetY);
      this.setZoom(newZoom);

      const dragDeltaX = point.x - this.dragStart.x;
      const dragDeltaY = point.y - this.dragStart.y;
      this.containerStart.x = targetX - dragDeltaX;
      this.containerStart.y = targetY - dragDeltaY;

      this.minimapContainerRef.current.updateScreenCursor();
    }
  }

  onWheel(event) {
    event.preventDefault();

    const zoomDirection = event.deltaY < 0 ? 1 : -1;
    const zoomPoint = new Point(event.offsetX, event.offsetY);
    this.zoomOnPoint(zoomDirection, zoomPoint, {
      immediate: this.isPointerDown,
    });
  }

  checkBounds() {
    const farRight = this.canvasScene.clientWidth * 0.9;
    const farLeft = this.canvasScene.clientWidth * 0.1;
    const farTop = this.canvasScene.clientHeight * 0.2;
    const farBottom = this.canvasScene.clientHeight * 0.8;

    const sceneBounds = this.getBoundsFromCache();
    const outOfBounds =
      sceneBounds.minX > farRight ||
      sceneBounds.maxX < farLeft ||
      sceneBounds.minY > farBottom ||
      sceneBounds.maxY < farTop;

    if (!outOfBounds) return;

    let returnToX, returnToY;

    if (sceneBounds.minX > farRight) returnToX = farRight;
    else if (sceneBounds.maxX < farLeft) returnToX = farLeft - sceneBounds.width;
    else returnToX = this.x;

    if (sceneBounds.minY > farBottom) returnToY = farBottom;
    else if (sceneBounds.maxY < farTop) returnToY = farTop - sceneBounds.height;
    else returnToY = this.y;

    this.translateTo(returnToX, returnToY);
  }

  onDragStart(event) {
    this.isPointerDown = true;
    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    this.dragStart = { x: mouseScreenPosition.x, y: mouseScreenPosition.y };
    this.containerStart = { x: this.x, y: this.y };

    this.stopUpdatePosition();
  }

  onDragMove(event) {
    if (!this.isPointerDown) return;
    this.dragging = true;

    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    const dragX = mouseScreenPosition.x - this.dragStart.x;
    const dragY = mouseScreenPosition.y - this.dragStart.y;

    this.position.set(this.containerStart.x + dragX, this.containerStart.y + dragY);
    this.minimapContainerRef.current.updateScreenCursor();
  }

  onDragEnd() {
    this.isPointerDown = false;
    if (!this.dragging) return;
    this.dragging = false;
    this.checkBounds();
  }
}
