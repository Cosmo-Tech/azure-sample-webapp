// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 0.5;
const ZOOM_SPEED = 0.05;
const ORIGIN = { x: 0, y: 0 };

const interpolateLinear = (a, b, t) => {
  return a + (b - a) * t;
};

export class SceneContainer extends Container {
  constructor(sceneApp, canvasSceneRef) {
    super();
    this.zoom = DEFAULT_ZOOM;
    this.scale.set(this.zoom);
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    // TODO: find a way to zoom automatically on a default point of interest
    this.position.set(250, -2100);

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
    // Use window.addEventListener instead?
    canvasSceneRef.current.addEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.addEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointerupoutside', this.onDragEnd);
    canvasSceneRef.current.addEventListener('pointermove', this.onDragMove);
  }

  destroy(canvasSceneRef) {
    if (!canvasSceneRef.current) return;
    canvasSceneRef.current.removeEventListener('wheel', this.zoomWithWheel);
    canvasSceneRef.current.removeEventListener('pointerdown', this.onDragStart);
    canvasSceneRef.current.removeEventListener('pointerup', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointerupoutside', this.onDragEnd);
    canvasSceneRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  moveTowardTargetPosition() {
    this.x = interpolateLinear(this.x, this.targetX, 0.1);
    this.y = interpolateLinear(this.y, this.targetY, 0.1);

    const newZoom = interpolateLinear(this.zoom, MIN_ZOOM, 0.1);
    this.zoom = newZoom;
    this.scale.set(newZoom);

    const nearTarget = Math.abs(this.targetX - this.x) < 0.5 && Math.abs(this.targetY - this.y) < 0.5;
    if (nearTarget) {
      this.position.set(this.targetX, this.targetY);
      this.sceneApp.ticker.remove(this.moveTowardTargetPosition);
    }
  }

  translateTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.sceneApp.ticker.add(this.moveTowardTargetPosition);
  }

  backToOrigin() {
    this.translateTo(ORIGIN.x, ORIGIN.y);
  }

  stopBackToOrigin() {
    this.sceneApp.ticker.remove(this.moveTowardTargetPosition);
  }

  zoomWithWheel(event) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    const mouseWorldPosition = this.toLocal(mouseScreenPosition);

    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom + zoomDirection * ZOOM_SPEED));
    this.zoom = newZoom;

    this.scale.set(newZoom);
    const newScreenPos = this.toGlobal(mouseWorldPosition);

    this.x += mouseScreenPosition.x - newScreenPos.x;
    this.y += mouseScreenPosition.y - newScreenPos.y;

    this.stopBackToOrigin();
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
  }
}
