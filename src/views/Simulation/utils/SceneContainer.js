// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const FOCUS_ZOOM = 1;
const ANIMATION_DURATION_IN_MS = 400;
const MIN_SCENE_ON_SCREEN_RATIO = 0.1;

const interpolateSmooth = (a, b, t) => a + (b - a) * Math.sin((t * Math.PI) / 2);

export class SceneContainer extends Container {
  constructor(sceneApp, canvasSceneRef, zoomOption = { minZoom: 0.1, maxZoom: 2, defaultZoom: 0.2, zoomSpeed: 0.2 }) {
    super();
    this.canvasScene = canvasSceneRef.current;
    this.minZoom = zoomOption.minZoom;
    this.maxZoom = zoomOption.maxZoom;
    this.defaultZoom = zoomOption.defaultZoom;
    this.zoomSpeed = zoomOption.zoomSpeed;

    this.bounds = null;
    this.localBounds = null;

    this.setZoom(this.defaultZoom);
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
    this.setZoom(this.defaultZoom);
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
    if (canvasSceneRef.current == null) return;
    canvasSceneRef.current.removeEventListener('wheel', this.onWheel);
    canvasSceneRef.current.removeEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.removeEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointerout', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  interpolateZoomAndPosition() {
    this.timeElapsedSinceAnimationStart += this.sceneApp.ticker.elapsedMS;
    const t = Math.min(1, this.timeElapsedSinceAnimationStart / ANIMATION_DURATION_IN_MS);

    this.x = interpolateSmooth(this.animationInitialX, this.animationTargetX, t);
    this.y = interpolateSmooth(this.animationInitialY, this.animationTargetY, t);
    this.setZoom(interpolateSmooth(this.animationInitialZoom, this.animationTargetZoom, t));
  }

  updatePositionAndScale() {
    this.interpolateZoomAndPosition();
    if (this.timeElapsedSinceAnimationStart >= ANIMATION_DURATION_IN_MS) {
      this.sceneApp.ticker.remove(this.updatePositionAndScale);
      this.checkBounds();
    } else if (this.minimapContainerRef != null) {
      this.minimapContainerRef.current.updateScreenCursor();
    }
  }

  setZoom(zoom) {
    this.scale.set(zoom);
    this.zoom = zoom;

    this.emit('zoomChanged', this.zoom);
  }

  translateTo(x, y, zoom = this.zoom) {
    this.animationInitialX = this.x;
    this.animationInitialY = this.y;
    this.animationInitialZoom = this.zoom;
    this.animationTargetX = x;
    this.animationTargetY = y;
    this.animationTargetZoom = zoom;
    this.timeElapsedSinceAnimationStart = 0;
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
    this.translateTo(this.origin.x, this.origin.y, this.defaultZoom);
  }

  stopUpdatePosition() {
    this.sceneApp.ticker.remove(this.updatePositionAndScale);
  }

  zoomOnPoint(zoomDirection, zoomPoint, { immediate = false } = {}) {
    const point = zoomPoint ?? this.getScreenCenterPoint();

    const mouseWorldPosition = this.toLocal(point);
    const newZoom = Math.min(
      this.maxZoom,
      Math.max(this.minZoom, this.zoom + zoomDirection * this.zoom * this.zoomSpeed)
    );

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

      if (this.minimapContainerRef != null) this.minimapContainerRef.current.updateScreenCursor();
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
    const farRight = this.canvasScene.clientWidth * (1 - MIN_SCENE_ON_SCREEN_RATIO);
    const farLeft = this.canvasScene.clientWidth * MIN_SCENE_ON_SCREEN_RATIO;
    const farTop = this.canvasScene.clientHeight * MIN_SCENE_ON_SCREEN_RATIO;
    const farBottom = this.canvasScene.clientHeight * (1 - MIN_SCENE_ON_SCREEN_RATIO);

    const bounds = this.getBounds();
    const deltaX = bounds.minX - this.x;
    const deltaY = bounds.minY - this.y;

    const isOutOfBoundLeft = Math.round(bounds.maxX) < Math.round(farLeft);
    const isOutOfBoundRight = Math.round(bounds.minX) > Math.round(farRight);
    const isOutOfBoundBottom = Math.round(bounds.minY) > Math.round(farBottom);
    const isOutOfBoundTop = Math.round(bounds.maxY) < Math.round(farTop);

    const outOfBounds = isOutOfBoundLeft || isOutOfBoundRight || isOutOfBoundBottom || isOutOfBoundTop;
    if (!outOfBounds) return;

    let returnToX, returnToY;
    if (isOutOfBoundRight) returnToX = farRight - deltaX;
    else if (isOutOfBoundLeft) returnToX = farLeft - (this.width + deltaX);
    else returnToX = this.x;

    if (isOutOfBoundBottom) returnToY = farBottom - deltaY;
    else if (isOutOfBoundTop) returnToY = farTop - (this.height + deltaY);
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

    if (this.minimapContainerRef != null) this.minimapContainerRef.current.updateScreenCursor();
  }

  onDragEnd() {
    this.isPointerDown = false;
    if (!this.dragging) return;
    this.dragging = false;
    this.checkBounds();
  }
}
