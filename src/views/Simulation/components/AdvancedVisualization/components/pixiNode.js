// components/pixiNode.js
import * as PIXI from 'pixi.js';

/** ---- All visual knobs live here ---- */
const STYLE = {
  coreIdleRadius: 6, // px on screen
  coreHoverRadius: 6, // px on screen
  coreFill: 0xb9bac0, // light gray
  ringColor: 0xffffff, // white ring
  ringWidth: 2, // px
  haloRadius: 20, // px on screen
  haloFill: 0xb9bac0, // soft gray
  haloAlpha: 0.4,
};

/** Draw the core (filled circle + stroke ring) into a Graphics */
function drawCore(g, r, fill, ringColor, ringWidth) {
  g.clear();
  // filled disk
  g.beginFill(fill, 1);
  g.drawCircle(0, 0, r);
  g.endFill();
  // thin ring
  if (ringWidth > 0) {
    g.lineStyle(ringWidth, ringColor, 1);
    g.drawCircle(0, 0, r);
  }
}

/** Draw the halo (soft filled circle) */
function drawHalo(g, r, fill, alpha) {
  g.clear();
  g.beginFill(fill, alpha);
  g.drawCircle(0, 0, r);
  g.endFill();
}

/**
 * Ensure a constant-screen-size stock node.
 * It renders with PIXI.Graphics (vector) to avoid pixelation,
 * and counter-scales against the world zoom so it stays the same
 * size in screen pixels.
 *
 * Returns { container, update }.
 */
export function ensureStockNode(rootContainer, id, app /* unused but kept for symmetry */, _textureCache) {
  const name = `node-${id}`;
  let node = rootContainer.getChildByName(name);

  if (!node) {
    node = new PIXI.Container();
    node.name = name;
    rootContainer.addChild(node);

    const halo = new PIXI.Graphics();
    halo.name = 'halo';
    halo.visible = false; // hidden by default
    node.addChild(halo);

    const core = new PIXI.Graphics();
    core.name = 'core';
    core.interactive = true;
    core.cursor = 'pointer';
    node.addChild(core);

    // Hover interactions toggle halo + swap core radius
    core
      .on('pointerover', () => {
        halo.visible = true;
        drawHalo(halo, STYLE.haloRadius, STYLE.haloFill, STYLE.haloAlpha);
        drawCore(core, STYLE.coreHoverRadius, STYLE.coreFill, STYLE.ringColor, STYLE.ringWidth);
      })
      .on('pointerout', () => {
        halo.visible = false;
        drawCore(core, STYLE.coreIdleRadius, STYLE.coreFill, STYLE.ringColor, STYLE.ringWidth);
      });

    // initial paint
    drawCore(core, STYLE.coreIdleRadius, STYLE.coreFill, STYLE.ringColor, STYLE.ringWidth);
  }

  function update({ x, y, worldScale }) {
    node.position.set(x, y);

    // Counter-scale so node remains constant in screen pixels
    const inv = worldScale > 0 ? 1 / worldScale : 1;
    node.scale.set(inv);
  }

  return { container: node, update };
}

export function removeStockNode(rootContainer, id) {
  const name = `node-${id}`;
  const n = rootContainer.getChildByName(name);
  if (n && n.parent) n.parent.removeChild(n);
}

/** Optional: expose a way to override style at runtime */
export function setStockNodeStyle(partial) {
  Object.assign(STYLE, partial || {});
}
