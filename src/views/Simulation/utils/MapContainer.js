// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const DEFAULT_ZOOM = 1;
const ZOOM_SPEED = 0.2;
const FOCUS_ZOOM = 1;
const ANIMATION_DURATION_IN_MS = 400;

const interpolateSmooth = (a, b, t) => a + (b - a) * Math.sin((t * Math.PI) / 2);

export class MapContainer extends Container {
  constructor(mapApp, mapCanvasRef) {
    super();
    this.canvasScene = mapCanvasRef.current;

    this.bounds = null;
    this.localBounds = null;

    this.setZoom(DEFAULT_ZOOM);

    this.mapApp = mapApp;

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

    mapCanvasRef.current.addEventListener('wheel', this.onWheel);
    mapCanvasRef.current.addEventListener('pointerdown', this.onDragStart);
    mapCanvasRef.current.addEventListener('pointerup', this.onDragEnd);
    mapCanvasRef.current.addEventListener('pointerout', this.onDragEnd);
    mapCanvasRef.current.addEventListener('pointermove', this.onDragMove);
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
    this.mapApp.ticker.remove(this.updatePositionAndScale);
    this.setZoom(DEFAULT_ZOOM);
    const sceneWidth = this.width;
    const sceneHeight = this.height;
    const screenWidth = this.canvasScene.clientWidth;
    const screenHeight = this.canvasScene.clientHeight;
    this.origin = new Point(-sceneWidth / 2 + screenWidth / 2, -sceneHeight / 2 + screenHeight / 2);
    this.position.set(this.origin.x, this.origin.y);
  }

  destroy(mapCanvasRef) {
    if (mapCanvasRef.current == null) return;
    mapCanvasRef.current.removeEventListener('wheel', this.onWheel);
    mapCanvasRef.current.removeEventListener('pointerdown', this.onDragStart);
    mapCanvasRef.current.removeEventListener('pointerup', this.onDragEnd);
    mapCanvasRef.current.removeEventListener('pointerout', this.onDragEnd);
    mapCanvasRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  interpolateZoomAndPosition() {
    this.timeElapsedSinceAnimationStart += this.mapApp.ticker.elapsedMS;
    const t = Math.min(1, this.timeElapsedSinceAnimationStart / ANIMATION_DURATION_IN_MS);

    this.x = interpolateSmooth(this.animationInitialX, this.animationTargetX, t);
    this.y = interpolateSmooth(this.animationInitialY, this.animationTargetY, t);
    this.setZoom(interpolateSmooth(this.animationInitialZoom, this.animationTargetZoom, t));
  }

  updatePositionAndScale() {
    this.interpolateZoomAndPosition();
    if (this.timeElapsedSinceAnimationStart >= ANIMATION_DURATION_IN_MS) {
      this.mapApp.ticker.remove(this.updatePositionAndScale);
      this.checkBounds();
    }
  }

  setZoom(zoom) {
    this.scale.set(zoom);
    this.zoom = zoom;
  }

  translateTo(x, y, zoom = this.zoom) {
    this.animationInitialX = this.x;
    this.animationInitialY = this.y;
    this.animationInitialZoom = this.zoom;
    this.animationTargetX = x;
    this.animationTargetY = y;
    this.animationTargetZoom = zoom;
    this.timeElapsedSinceAnimationStart = 0;
    console.log('this.mapApp'); // NBO log to remove
    console.log(this.mapApp); // NBO log to remove
    this.mapApp.ticker.add(this.updatePositionAndScale);
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
    console.log('this.mapApp.ticker'); // NBO log to remove
    console.log(this.mapApp.ticker); // NBO log to remove
    this.mapApp.ticker.remove(this.updatePositionAndScale);
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
  }

  onDragEnd() {
    this.isPointerDown = false;
    if (!this.dragging) return;
    this.dragging = false;
    this.checkBounds();
  }
}
