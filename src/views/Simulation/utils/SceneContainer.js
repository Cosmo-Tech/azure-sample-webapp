// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 0.05;
const MAX_ZOOM = 2;
const DEFAULT_ZOOM = 0.5;
const ZOOM_SPEED = 0.05;

const interpolateLinear = (a, b, t) => {
  return a + (b - a) * t;
};

export class SceneContainer extends Container {
  constructor(app, containerRef) {
    super();
    this.zoom = DEFAULT_ZOOM;
    this.scale.set(this.zoom);
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;
    // TODO: find a way to zoom automatically on a default point of interest
    this.position.set(250, -2100);

    this.tickerAttached = false;

    this.app = app;

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

    containerRef.current.addEventListener('wheel', this.zoomWithWheel);
    // Use window.addEventListener instead?
    containerRef.current.addEventListener('pointerdown', this.onDragStart);
    containerRef.current.addEventListener('pointerup', this.onDragEnd);
    containerRef.current.addEventListener('pointerupoutside', this.onDragEnd);
    containerRef.current.addEventListener('pointermove', this.onDragMove);
  }

  destroy(containerRef) {
    if (!containerRef.current) return;
    containerRef.current.removeEventListener('wheel', this.zoomWithWheel);
    containerRef.current.removeEventListener('pointerdown', this.onDragStart);
    containerRef.current.removeEventListener('pointerup', this.onDragEnd);
    containerRef.current.removeEventListener('pointerupoutside', this.onDragEnd);
    containerRef.current.removeEventListener('pointermove', this.onDragMove);
  }

  moveTowardTargetPosition() {
    this.x = interpolateLinear(this.x, this.targetX, 0.1);
    this.y = interpolateLinear(this.y, this.targetY, 0.1);
    const nearTarget = Math.abs(this.targetX - this.x) < 0.5 && Math.abs(this.targetY - this.y) < 0.5;
    if (nearTarget) {
      this.position.set(this.targetX, this.targetY);
      this.app.ticker.remove(this.moveTowardTargetPosition);
      this.tickerAttached = false;
    } else if (!this.tickerAttached) {
      this.tickerAttached = true;
      this.app.ticker.add(this.moveTowardTargetPosition);
    }
  }

  translateTo(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.moveTowardTargetPosition();
  }

  backToOrigin() {
    this.translateTo(0, 0);
  }

  zoomWithWheel(event) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    const mouseWorldPosition = this.toLocal(mouseScreenPosition);

    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom + zoomDirection * ZOOM_SPEED));
    const isZoomingOutToDefault = MIN_ZOOM === 1 && this.zoom > MIN_ZOOM;
    this.zoom = newZoom;

    this.scale.set(newZoom);
    const newScreenPos = this.toGlobal(mouseWorldPosition);

    this.x += mouseScreenPosition.x - newScreenPos.x;
    this.y += mouseScreenPosition.y - newScreenPos.y;

    if (isZoomingOutToDefault && !this.tickerAttached) {
      this.backToOrigin();
    } else if (this.tickerAttached && zoomDirection === 1) {
      this.app.ticker.remove(this.backToOrigin);
      this.tickerAttached = false;
    }
  }

  onDragStart(event) {
    this.dragging = true;
    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    this.dragStart = { x: mouseScreenPosition.x, y: mouseScreenPosition.y };
    this.containerStart = { x: this.x, y: this.y };
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
