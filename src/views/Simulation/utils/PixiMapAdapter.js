import '@pixi/unsafe-eval';
import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import { ensureStockNode, removeStockNode } from '../components/PixiComponents/components/pixiNode';
import { ensureTransportEdge, removeTransportEdge } from '../components/PixiComponents/components/pixiTransport';
import { SceneContainer } from './SceneContainer';

const NODE_RADIUS_PX = 6;
const CLUSTER_PADDING_PX = 2;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 8;
const DEFAULT_ZOOM = 1;
const ZOOM_SPEED = 0.2;

const CLUSTER_LABEL_STYLE = new PIXI.TextStyle({
  fontFamily: 'Inter, system-ui, sans-serif',
  fontSize: 12,
  fontWeight: '700',
  fill: 0x111111,
});

function makeApp(canvasEl) {
  const app = new PIXI.Application();
  app.init({
    backgroundAlpha: 0,
    antialias: true,
    resolution: devicePixelRatio || 1,
    autoDensity: true,
    resizeTo: canvasEl,
  });
  return app;
}

function lonLatToXY(projection, lon, lat) {
  const [x, y] = projection([lon, lat]);
  return { x, y };
}

function buildClusters(nodes, projection, scale, { cellSizePx = NODE_RADIUS_PX * 2 + CLUSTER_PADDING_PX } = {}) {
  const buckets = new Map();
  const getKey = (x, y) => {
    const gx = Math.floor(x / cellSizePx);
    const gy = Math.floor(y / cellSizePx);
    return `${gx}:${gy}`;
  };

  nodes.forEach((n) => {
    if (n.lon == null || n.lat == null) return;
    const { x, y } = lonLatToXY(projection, n.lon, n.lat);
    const sx = x * scale;
    const sy = y * scale;
    const k = getKey(sx, sy);
    let cell = buckets.get(k);
    if (!cell) {
      cell = { ids: [], xSum: 0, ySum: 0, count: 0 };
      buckets.set(k, cell);
    }
    cell.ids.push(n.id);
    cell.xSum += sx;
    cell.ySum += sy;
    cell.count += 1;
  });

  const clusters = [];
  for (const [key, cell] of buckets.entries()) {
    const cx = cell.xSum / cell.count;
    const cy = cell.ySum / cell.count;
    clusters.push({ key, ids: cell.ids, count: cell.count, sx: cx, sy: cy });
  }
  return clusters;
}

function ensureClusterSprite(root, cluster) {
  const name = `cluster-${cluster.key}`;
  let c = root.getChildByName(name);
  if (!c) {
    c = new PIXI.Container();
    c.name = name;
    const circle = new PIXI.Graphics();
    circle.name = 'circle';
    const label = new PIXI.Text(String(cluster.count), CLUSTER_LABEL_STYLE);
    label.anchor.set(0.5);
    label.name = 'label';
    c.addChild(circle, label);
    root.addChild(c);
  }
  const radius = Math.max(10, Math.min(28, 10 + Math.log2(cluster.count + 1) * 6));
  const circle = c.getChildByName('circle');
  circle.clear();
  circle.beginFill(0xffffff, 0.85);
  circle.lineStyle(1, 0x333333, 0.8);
  circle.drawCircle(0, 0, radius);
  circle.endFill();
  c.position.set(cluster.sx, cluster.sy);
  c.scale.set(1.0);
  const label = c.getChildByName('label');
  label.text = String(cluster.count);
  return c;
}

export async function createPixiMap({
  canvasRef,
  data,
  worldGeoJSON = null,
  onNodeClick = () => {},
  onClusterClick = () => {},
}) {
  const canvasEl = canvasRef.current;
  const app = await makeApp(canvasEl);

  const scene = new SceneContainer(app, canvasRef, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    defaultZoom: DEFAULT_ZOOM,
    zoomSpeed: ZOOM_SPEED,
  });
  app.stage.addChild(scene);

  const worldLayer = new PIXI.Container();
  const linksLayer = new PIXI.Container();
  const nodesLayer = new PIXI.Container();
  const clustersLayer = new PIXI.Container();

  scene.addChild(worldLayer, linksLayer, nodesLayer, clustersLayer);

  const view = { width: canvasEl.clientWidth, height: canvasEl.clientHeight };
  const projection = d3.geoMercator().scale(1).translate([0, 0]);
  const path = d3.geoPath(projection);
  if (worldGeoJSON) {
    const b = path.bounds(worldGeoJSON);
    const s = 0.95 / Math.max((b[1][0] - b[0][0]) / view.width, (b[1][1] - b[0][1]) / view.height);
    const t = [
      (view.width - s * (b[1][0] - b[0][0])) / 2 - s * b[0][0],
      (view.height - s * (b[1][1] - b[0][1])) / 2 - s * b[0][1],
    ];
    projection.scale(s).translate(t);
  }

  const nodeSprites = new Map();
  const edgeSprites = new Map();
  const clusterSprites = new Map();

  function nodeScreenPos(n, scale = scene.scale.x) {
    const { x, y } = lonLatToXY(projection, n.lon, n.lat);
    return { x: x * scale, y: y * scale };
  }

  function renderNodes(nodes) {
    nodes.forEach((n) => {
      const { x, y } = nodeScreenPos(n);
      if (!nodeSprites.has(n.id)) {
        const { container, update } = ensureStockNode(nodesLayer, n.id, { x, y }, { type: n.type || 'stock' });
        nodeSprites.set(n.id, { container, update });
        container.interactive = true;
        container.cursor = 'pointer';
        container.on('pointertap', () => onNodeClick(n));
      }
      nodeSprites.get(n.id).update({ x, y });
    });
    [...nodeSprites.keys()].forEach((id) => {
      if (!nodes.find((n) => n.id === id)) {
        removeStockNode(nodesLayer, id);
        nodeSprites.delete(id);
      }
    });
  }

  function renderEdges(links, nodesById) {
    links.forEach((e) => {
      const id = e.id || `${e.source}-${e.target}`;
      const a = nodesById.get(e.source);
      const b = nodesById.get(e.target);
      if (!a || !b) return;
      const P0 = nodeScreenPos(a);
      const P2 = nodeScreenPos(b);
      const spacingFactor = 0.5;
      const isLayoutHorizontal = Math.abs(P0.x - P2.x) >= Math.abs(P0.y - P2.y);
      if (!edgeSprites.has(id)) {
        const { container, update } = ensureTransportEdge(linksLayer, id, P0, P2, {
          spacingFactor,
          isLayoutHorizontal,
        });
        edgeSprites.set(id, { container, update });
      }
      edgeSprites.get(id).update(P0, P2, { spacingFactor, isLayoutHorizontal });
    });
    [...edgeSprites.keys()].forEach((id) => {
      if (!links.find((e) => (e.id || `${e.source}-${e.target}`) === id)) {
        removeTransportEdge(linksLayer, id);
        edgeSprites.delete(id);
      }
    });
  }

  function renderClusters(clusters) {
    clusters.forEach((c) => {
      const sprite = ensureClusterSprite(clustersLayer, c, scene.scale.x);
      clusterSprites.set(c.key, sprite);
      sprite.interactive = true;
      sprite.cursor = 'pointer';
      sprite.removeAllListeners('pointertap');
      sprite.on('pointertap', () => onClusterClick(c));
    });
    [...clusterSprites.keys()].forEach((key) => {
      if (!clusters.find((c) => c.key === key)) {
        const existingSprite = clustersLayer.getChildByName(`cluster-${key}`);
        if (existingSprite) {
          clustersLayer.removeChild(existingSprite);
          existingSprite.destroy({ children: true });
        }
        clusterSprites.delete(key);
      }
    });
  }

  function recomputeAndRender() {
    const scale = scene.scale.x;
    const nodes = data.nodes || [];
    const links = data.links || [];
    const nodesById = new Map(nodes.map((n) => [n.id, n]));

    renderNodes(nodes);
    renderEdges(links, nodesById);

    const clusters = buildClusters(nodes, projection, scale);
    renderClusters(clusters);
  }

  const onTick = () => {
    recomputeAndRender();
  };
  app.ticker.add(onTick);

  recomputeAndRender();

  return () => {
    app.ticker.remove(onTick);
    app.destroy(true, { children: true });
    while (canvasEl.firstChild) canvasEl.removeChild(canvasEl.firstChild);
  };
}
