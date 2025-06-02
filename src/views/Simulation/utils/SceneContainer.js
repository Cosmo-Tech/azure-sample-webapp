// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Point, Container } from 'pixi.js';

const MIN_ZOOM = 1;
const MAX_ZOOM = 8;
const ZOOM_SPEED = 0.1;

export class SceneContainer extends Container {
  constructor(app, containerRef) {
    super();
    this.pivot.x = this.width / 2;
    this.pivot.y = this.height / 2;

    this.zoom = 1;
    this.tickerAttached = false;

    this.app = app;

    this.dragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.containerStart = { x: 0, y: 0 };

    this.interactive = true;

    containerRef.current.addEventListener('wheel', (event) => this.zoomWithWheel(event, app));
    containerRef.current.addEventListener('pointerdown', (event) => this.onDragStart(event));
    containerRef.current.addEventListener('pointerup', () => this.onDragEnd());
    containerRef.current.addEventListener('pointerupoutside', () => this.onDragEnd());
    containerRef.current.addEventListener('pointermove', (event) => this.onDragMove(event));

    this.backToOrigin = this.backToOrigin.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragMove = this.onDragMove.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }

  backToOrigin() {
    const interpolateLinear = (a, b, t) => {
      return a + (b - a) * t;
    };

    this.x = interpolateLinear(this.x, 0, 0.1);
    this.y = interpolateLinear(this.y, 0, 0.1);

    const nearZero = Math.abs(this.x) < 0.5 && Math.abs(this.y) < 0.5;
    if (nearZero) {
      this.position.set(0, 0);
      this.app.ticker.remove(this.backToOrigin);
      this.tickerAttached = false;
    }
  }

  zoomWithWheel(event, app) {
    const zoomDirection = event.deltaY < 0 ? 1 : -1;

    const mouseScreenPosition = new Point(event.offsetX, event.offsetY);
    const mouseWorldPosition = this.toLocal(mouseScreenPosition);

    const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, this.zoom + zoomDirection * ZOOM_SPEED));
    const isZoomingOutToDefault = newZoom === 1 && this.zoom > 1;
    this.zoom = newZoom;

    this.scale.set(newZoom);
    const newScreenPos = this.toGlobal(mouseWorldPosition);

    this.x += mouseScreenPosition.x - newScreenPos.x;
    this.y += mouseScreenPosition.y - newScreenPos.y;

    if (isZoomingOutToDefault && !this.tickerAttached) {
      this.tickerAttached = true;
      app.ticker.add(this.backToOrigin);
    } else if (this.tickerAttached && zoomDirection === 1) {
      app.ticker.remove(this.backToOrigin);
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
