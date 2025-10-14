// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';

function qPoint(t, P0, P1, P2) {
  const u = 1 - t;
  return {
    x: u * u * P0.x + 2 * u * t * P1.x + t * t * P2.x,
    y: u * u * P0.y + 2 * u * t * P1.y + t * t * P2.y,
  };
}
function qTangent(t, P0, P1, P2) {
  const u = 1 - t;
  return {
    x: 2 * (u * (P1.x - P0.x) + t * (P2.x - P1.x)),
    y: 2 * (u * (P1.y - P0.y) + t * (P2.y - P1.y)),
  };
}
function normalize(vx, vy) {
  const m = Math.hypot(vx, vy) || 1e-6;
  return { x: vx / m, y: vy / m };
}

function makeTriangle({ tip, dir, perp, aLen, aWid }) {
  const base = { x: tip.x - dir.x * aLen, y: tip.y - dir.y * aLen };
  const left = { x: base.x + perp.x * (aWid / 2), y: base.y + perp.y * (aWid / 2) };
  const right = { x: base.x - perp.x * (aWid / 2), y: base.y - perp.y * (aWid / 2) };
  return [
    [tip.x, tip.y],
    [left.x, left.y],
    [right.x, right.y],
  ];
}

export function ensureTransportEdge(rootContainer, id) {
  const name = `transport-${id}`;
  let node = rootContainer.getChildByName(name);

  if (!node) {
    node = new PIXI.Container();
    node.name = name;
    rootContainer.addChild(node);

    const path = new PIXI.Graphics();
    path.name = 'path';
    node.addChild(path);

    const arrow = new PIXI.Graphics();
    arrow.name = 'arrow';
    node.addChild(arrow);
  }

  function update({
    src,
    dst,
    worldScale = 1,
    pixelRatio = 1, // add DPR awareness while keeping your behavior
    curvature = 0.18,
    widthPx = 4,
    color = 0xffffff,
    alpha = 1.0,

    // Arrow sizing: scales with stroke thickness by default
    arrowLenPx = 14,
    arrowWidthPx = 12,

    // Arrow position along curve
    arrowAtT = 0.5,

    // Style
    dashed = false,
    dashPx = 8,
    gapPx = 6,

    // Arrow shape
    arrowShape = 'triangle',

    // Stability & UX
    forceMiddleArrow = true, // keep arrow at midpoint unless explicitly overridden
    arrowAutoSize = true, // scale arrow with line thickness
    arrowLenPerStroke = 4.5, // multipliers when arrowAutoSize=true
    arrowWidthPerStroke = 3.2,
    maxArrowAsChordFrac = 0.35,

    // Optional: thin very long (cluster) edges so they don't look too heavy
    autoThinByLength = true,
    lengthForNoThinPx = 140,
    minThicknessScale = 0.5,
    attenuationExponent = 0.8,
  }) {
    if (!src || !dst) return;

    const path = node.getChildByName('path');
    const arrow = node.getChildByName('arrow');

    // Convert screen px to world units (constant on-screen size)
    const denom = Math.max(1e-6, (worldScale || 1) * (pixelRatio || 1));
    const baseW = Math.max(0.5, widthPx / denom);
    const dash = Math.max(0.5, dashPx / denom);
    const gap = Math.max(0.5, gapPx / denom);

    // Geometry
    const dx = dst.x - src.x;
    const dy = dst.y - src.y;
    const chordLenWorld = Math.hypot(dx, dy) || 1;
    const mid = { x: (src.x + dst.x) / 2, y: (src.y + dst.y) / 2 };
    const nrm = normalize(-dy, dx);
    const ctrl = {
      x: mid.x + nrm.x * curvature * chordLenWorld,
      y: mid.y + nrm.y * curvature * chordLenWorld,
    };

    // Auto-thin long edges in screen space
    const screenLenPx = chordLenWorld * (worldScale || 1) * (pixelRatio || 1);
    let thinScale = 1;
    if (autoThinByLength && screenLenPx > lengthForNoThinPx) {
      const ratio = screenLenPx / Math.max(1, lengthForNoThinPx);
      thinScale = Math.max(minThicknessScale, Math.pow(1 / ratio, attenuationExponent));
    }
    const w = baseW * thinScale;

    // Arrow sizing: derived from stroke unless explicitly overridden
    const aLenBase = arrowAutoSize ? Math.max(w * arrowLenPerStroke, w * 2.0) : Math.max(2, arrowLenPx / denom);
    const aWidBase = arrowAutoSize ? Math.max(w * arrowWidthPerStroke, w * 1.4) : Math.max(2, arrowWidthPx / denom);

    // Clamp arrow against chord length (prevents oversized arrows on short links)
    const maxArrowLenWorld = Math.max(0.5, maxArrowAsChordFrac * chordLenWorld);
    const aLen = Math.min(aLenBase, maxArrowLenWorld);
    const aWid = Math.min(aWidBase, maxArrowLenWorld * 0.7);

    // ---------------- Path (Pixi v8) ----------------
    path.clear();
    path.setStrokeStyle({
      width: w,
      color,
      alpha,
      cap: 'round',
      join: 'round',
      miterLimit: 2,
    });

    if (!dashed) {
      path.moveTo(src.x, src.y);
      path.quadraticCurveTo(ctrl.x, ctrl.y, dst.x, dst.y);
    } else {
      // Dash sampling ~2px in screen space for crispness
      const stepPx = 2;
      const stepWorld = Math.max(0.5 / denom, stepPx / denom);
      const segments = Math.max(16, Math.min(640, Math.ceil(chordLenWorld / stepWorld)));
      const total = dash + gap;

      let acc = 0;
      let prev = qPoint(0, src, ctrl, dst);

      for (let i = 1; i <= segments; i++) {
        const t = i / segments;
        const p = qPoint(t, src, ctrl, dst);
        const segLen = Math.hypot(p.x - prev.x, p.y - prev.y);
        if (segLen === 0) {
          prev = p;
          continue;
        }

        let walked = 0;
        while (walked < segLen) {
          const inDash = acc % total < dash;
          const remaining = (inDash ? dash : total) - (acc % total);
          const step = Math.min(segLen - walked, remaining);

          const r1 = walked / segLen;
          const r2 = (walked + step) / segLen;
          const x1 = prev.x + (p.x - prev.x) * r1;
          const y1 = prev.y + (p.y - prev.y) * r1;
          const x2 = prev.x + (p.x - prev.x) * r2;
          const y2 = prev.y + (p.y - prev.y) * r2;

          if (inDash) {
            path.moveTo(x1, y1);
            path.lineTo(x2, y2);
          }
          walked += step;
          acc += step;
        }
        prev = p;
      }
    }

    path.stroke(); // <-- v8: explicitly render the stroke

    // ---------------- Arrowhead (midpoint, stable orientation) ----------------
    const tt = forceMiddleArrow ? 0.5 : Math.max(0.02, Math.min(0.98, arrowAtT));
    const tip = qPoint(tt, src, ctrl, dst);

    // chord-aligned fallback to prevent zoom-direction flips
    const chord = { x: dx, y: dy };
    const chordLen = Math.hypot(chord.x, chord.y) || 1e-6;
    const baseDir = { x: chord.x / chordLen, y: chord.y / chordLen };

    const tan = qTangent(tt, src, ctrl, dst);
    const tanLen = Math.hypot(tan.x, tan.y);

    let dir;
    if (tanLen < 1e-6) {
      dir = baseDir;
    } else {
      const cand = { x: tan.x / tanLen, y: tan.y / tanLen };
      const dot = cand.x * baseDir.x + cand.y * baseDir.y;
      dir = dot >= 0 ? cand : { x: -cand.x, y: -cand.y };
    }
    const perp = { x: -dir.y, y: dir.x };

    let points;
    if (typeof arrowShape === 'function') {
      points = arrowShape({ tip, dir, perp, aLen, aWid });
    } else {
      points = makeTriangle({ tip, dir, perp, aLen, aWid });
    }

    arrow.clear();
    arrow.setFillStyle(color, alpha);
    arrow.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) arrow.lineTo(points[i][0], points[i][1]);
    arrow.closePath();
    arrow.fill(); // <-- v8 fill
  }

  return { container: node, update };
}

/** Remove a transport edge container by id */
export function removeTransportEdge(rootContainer, id) {
  const name = `transport-${id}`;
  const n = rootContainer.getChildByName(name);
  if (!n) return;
  rootContainer.removeChild(n);
  n.destroy({ children: true });
}
