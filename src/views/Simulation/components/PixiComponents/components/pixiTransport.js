// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { Graphics, Container } from 'pixi.js';

export function ensureTransportEdge(rootContainer, id) {
  const name = `transport-${id}`;
  let node = rootContainer.getChildByName(name);

  if (!node) {
    node = new Container();
    node.name = name;
    rootContainer.addChild(node);

    const path = new Graphics();
    path.name = 'path';
    node.addChild(path);

    const arrow = new Graphics();
    arrow.name = 'arrow';
    node.addChild(arrow);
  }

  function update({
    src,
    dst,
    worldScale = 1,
    pixelRatio = window.devicePixelRatio || 1,
    color = 0xffffff,
    alpha = 1,
    curvature = 0.25,
    baseWidthPx = 1.2,
  }) {
    if (!src || !dst) return;

    const path = node.getChildByName('path');
    const arrow = node.getChildByName('arrow');
    path.clear();
    arrow.clear();

    const dx = dst.x - src.x;
    const dy = dst.y - src.y;
    const chordLen = Math.hypot(dx, dy);
    if (chordLen < 1e-3) return;

    const dir = { x: dx / chordLen, y: dy / chordLen };
    const normal = { x: -dir.y, y: dir.x };

    const arcStrength = curvature * Math.min(1, chordLen / 400);
    const ctrl = {
      x: (src.x + dst.x) / 2 + normal.x * chordLen * arcStrength,
      y: (src.y + dst.y) / 2 + normal.y * chordLen * arcStrength,
    };

    const dpr = pixelRatio;
    const w = baseWidthPx / worldScale / dpr;
    path.setStrokeStyle({
      width: w,
      color,
      alpha,
      cap: 'round',
      join: 'round',
    });
    path.moveTo(src.x, src.y);
    path.quadraticCurveTo(ctrl.x, ctrl.y, dst.x, dst.y);
    path.stroke();

    const t = getMidArcT(src, ctrl, dst);
    const tip = qPoint(t, src, ctrl, dst);
    const tan = qTangent(t, src, ctrl, dst);
    const tanLen = Math.hypot(tan.x, tan.y);
    if (tanLen < 1e-6) return;
    const dirTan = { x: tan.x / tanLen, y: tan.y / tanLen };
    const perp = { x: -dirTan.y, y: dirTan.x };

    const baseArrowPx = 12;
    const scale = Math.max(0.05, Math.pow(1 / worldScale, 1.2));
    const len = (baseArrowPx * scale) / dpr;
    const wid = len * 0.9;

    const base = {
      x: tip.x - dirTan.x * len,
      y: tip.y - dirTan.y * len,
    };
    const left = {
      x: base.x + perp.x * (wid / 2),
      y: base.y + perp.y * (wid / 2),
    };
    const right = {
      x: base.x - perp.x * (wid / 2),
      y: base.y - perp.y * (wid / 2),
    };

    arrow.beginFill(color, alpha);
    arrow.moveTo(tip.x, tip.y);
    arrow.lineTo(left.x, left.y);
    arrow.lineTo(right.x, right.y);
    arrow.closePath();
    arrow.endFill();
  }

  return { container: node, update };
}

function qPoint(t, p0, p1, p2) {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y,
  };
}

function qTangent(t, p0, p1, p2) {
  const u = 1 - t;
  return {
    x: 2 * (u * (p1.x - p0.x) + t * (p2.x - p1.x)),
    y: 2 * (u * (p1.y - p0.y) + t * (p2.y - p1.y)),
  };
}

function getMidArcT(p0, p1, p2) {
  const samples = 50;
  let totalLen = 0;
  let prev = p0;
  const lengths = [0];

  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const pt = qPoint(t, p0, p1, p2);
    const seg = Math.hypot(pt.x - prev.x, pt.y - prev.y);
    totalLen += seg;
    lengths.push(totalLen);
    prev = pt;
  }

  const half = totalLen / 2;
  for (let i = 1; i <= samples; i++) {
    if (lengths[i] >= half) {
      const ratio = (half - lengths[i - 1]) / (lengths[i] - lengths[i - 1]);
      return (i - 1 + ratio) / samples;
    }
  }
  return 0.5;
}

export function removeTransportEdge(rootContainer, id) {
  const name = `transport-${id}`;
  const n = rootContainer.getChildByName(name);
  if (!n) return;
  rootContainer?.removeChild(n);
  n.destroy({ children: true });
}
