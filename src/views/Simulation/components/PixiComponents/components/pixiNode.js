// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Graphics, Text, Container } from 'pixi.js';
import { ensureTransportEdge, removeTransportEdge } from './pixiTransport';

const getNodeName = (id) => {
  const s = String(id);
  return s.startsWith('node-') ? s : `node-${s}`;
};

const STYLE = {
  coreIdleRadius: 1,
  coreFill: 0xb9bac0,
  ringColor: 0xffffff,
  ringWidth: 0.25,
  fontSize: 18,
  fontColor: 0x000000,
  minRadius: 1,
  maxRadius: 30,
};

function drawCore(g, r, fill, labelText) {
  g.clear();

  g.beginFill(fill, 1);
  g.drawCircle(0, 0, r);
  g.endFill();

  if (!labelText) {
    g.lineStyle(STYLE.ringWidth, STYLE.ringColor, 1);
    g.drawCircle(0, 0, r);
  }
}

function ensureStockNode(rootContainer, id, app, _textureCache) {
  const name = `node-${id}`;
  let node = rootContainer.getChildByName(name);

  if (!node) {
    node = new Container();
    node.name = name;
    rootContainer.addChild(node);

    const core = new Graphics();
    core.name = 'core';
    core.interactive = true;
    core.cursor = 'pointer';
    node.addChild(core);

    const label = new Text('', {
      fontFamily: 'Arial',
      fontSize: STYLE.fontSize,
      fill: STYLE.fontColor,
      align: 'center',
    });

    label.name = 'label';
    label.anchor.set(0.5);
    node.addChild(label);
  }

  function update({ x, y, worldScale, value }) {
    const core = node.getChildByName('core');
    const label = node.getChildByName('label');

    const v = Number(value ?? 0);

    const baseRadius = v > 0 ? STYLE.minRadius + Math.log10(v + 1) * 10 : STYLE.minRadius;
    const r = Math.min(STYLE.maxRadius, baseRadius);

    const fillColor = v > 10 ? 0xff5555 : STYLE.coreFill;
    label.text = v > 0 ? String(v) : '';

    drawCore(core, r, fillColor, label.text);

    label.style.fontSize = Math.max(STYLE.fontSize, r * 1);
    label.resolution = window.devicePixelRatio || 2;
    label.scale.set(1 / 3);

    node.position.set(x, y);

    let scale = 1 / Math.pow(worldScale, 0.9);
    scale = Math.max(0.25, Math.min(4.0, scale));
    node.scale.set(scale);
  }

  return { container: node, update };
}

export function updateClusters({ app, mapContainer, prepared, layersRef }) {
  const { links: linksLayer, nodes: nodesLayer } = layersRef.current;
  if (!app || !nodesLayer || !prepared) return;

  const worldScale = mapContainer?.worldTransform?.a ?? 1;
  const pixelRatio = app.renderer?.resolution ?? window?.devicePixelRatio ?? 1;
  const liveNodeNames = new Set();

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getLatLon = (n) => ({
    lat: Number(n?.data?.latitude ?? n?.data?.lat),
    lon: Number(n?.data?.longitude ?? n?.data?.lon ?? n?.data?.lng),
  });

  const addNode = (rawId, x, y, value) => {
    const { update } = ensureStockNode(nodesLayer, rawId, app, null);
    update({ x, y, worldScale, value });
    liveNodeNames.add(`node-${rawId}`);
  };

  const epsKm = Math.max(20, 1500 / Math.pow(worldScale, 1.05));
  const mergedByCoord = new Map();

  for (const n of prepared.nodesWithXY) {
    const lat = Number(n.data?.latitude ?? n.data?.lat);
    const lon = Number(n.data?.longitude ?? n.data?.lon ?? n.data?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    const key = `${lat.toFixed(3)},${lon.toFixed(3)}`;
    if (!mergedByCoord.has(key)) {
      mergedByCoord.set(key, { ...n, mergedNodes: [n] });
    } else {
      const existing = mergedByCoord.get(key);
      existing.mergedNodes.push(n);
      existing.value = (existing.value ?? 1) + 1;
    }
  }

  const dedupedNodes = Array.from(mergedByCoord.values());
  const nodes = dedupedNodes;
  const used = new Set();
  const clusters = [];

  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (used.has(n.id)) continue;
    const { lat: latN, lon: lonN } = getLatLon(n);
    if (!Number.isFinite(latN) || !Number.isFinite(lonN)) continue;

    const cluster = [n];
    for (let j = i + 1; j < nodes.length; j++) {
      const m = nodes[j];
      if (used.has(m.id)) continue;
      const { lat: latM, lon: lonM } = getLatLon(m);
      if (!Number.isFinite(latM) || !Number.isFinite(lonM)) continue;
      const dKm = haversineDistance(latN, lonN, latM, lonM);
      if (dKm <= epsKm) {
        cluster.push(m);
        used.add(m.id);
      }
    }

    used.add(n.id);
    clusters.push(cluster);
  }

  for (const cluster of clusters) {
    const cx = cluster.reduce((s, p) => s + p.x, 0) / cluster.length;
    const cy = cluster.reduce((s, p) => s + p.y, 0) / cluster.length;

    if (cluster.length === 1) {
      const single = cluster[0];
      addNode(String(single.id), single.x, single.y, 0);
    } else {
      const rawId = `cluster:${cluster.map((n) => n.id).join(',')}`;
      addNode(rawId, cx, cy, cluster.length);
    }

    for (const n of cluster) {
      liveNodeNames.add(`node-${String(n.id)}`);
    }
  }

  for (const child of [...nodesLayer.children]) {
    if (!child.name) continue;
    if (!liveNodeNames.has(child.name)) removeStockNode(nodesLayer, child.name);
  }

  const clusterMap = new Map();
  for (const cluster of clusters) {
    if (cluster.length > 1) {
      const clusterId = `cluster:${cluster.map((n) => n.id).join(',')}`;
      clusterMap.set(
        clusterId,
        cluster.map((n) => String(n.id))
      );
    }
  }

  const clusterCenters = {};
  for (const [clusterId, members] of clusterMap.entries()) {
    const clusterNodes = members.map((mId) => prepared.nodesWithXY.find((n) => String(n.id) === mId)).filter(Boolean);
    if (clusterNodes.length) {
      clusterCenters[clusterId] = {
        x: clusterNodes.reduce((s, n) => s + n.x, 0) / clusterNodes.length,
        y: clusterNodes.reduce((s, n) => s + n.y, 0) / clusterNodes.length,
      };
    }
  }

  const liveEdgeIds = new Set();

  for (const l of prepared.linksReady) {
    const srcId = String(l.__s.id);
    const dstId = String(l.__t.id);

    const srcCluster = [...clusterMap.entries()].find(([_, m]) => m.includes(srcId));
    const dstCluster = [...clusterMap.entries()].find(([_, m]) => m.includes(dstId));

    let src = l.__s;
    let dst = l.__t;

    if (srcCluster) {
      const [clusterId] = srcCluster;
      src = clusterCenters[clusterId];
    }
    if (dstCluster) {
      const [clusterId] = dstCluster;
      dst = clusterCenters[clusterId];
    }

    if (srcCluster && dstCluster && srcCluster[0] === dstCluster[0]) continue;

    const edgeKey = `${src.x.toFixed(2)},${src.y.toFixed(2)}→${dst.x.toFixed(2)},${dst.y.toFixed(2)}`;
    if (liveEdgeIds.has(edgeKey)) continue;

    const { update } = ensureTransportEdge(linksLayer, edgeKey);
    update({
      src,
      dst,
      worldScale,
      pixelRatio,
      curvature: 0.5,
      baseWidthPx: 1.2,
      arrowSizePx: 6,
      color: 0xffffff,
      alpha: 1,
    });

    liveEdgeIds.add(edgeKey);
  }

  for (const child of [...linksLayer.children]) {
    if (!child.name?.startsWith('transport-')) continue;
    const id = child.name.slice('transport-'.length);
    if (!liveEdgeIds.has(id)) removeTransportEdge(linksLayer, id);
  }
}

function removeStockNode(rootContainer, idOrName) {
  const name = String(idOrName).startsWith('node-') ? idOrName : getNodeName(idOrName);
  const n = rootContainer.getChildByName(name);
  if (n && n.parent) {
    n.parent?.removeChild(n);
    n.destroy({ children: true });
  }
}
