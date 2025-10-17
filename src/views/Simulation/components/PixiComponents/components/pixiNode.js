// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';

const STYLE = {
  coreIdleRadius: 1,
  coreFill: 0xb9bac0,
  ringColor: 0xffffff,
  ringWidth: 2,
  fontSize: 18,
  fontColor: 0x000000,
  minRadius: 2,
  maxRadius: 20,
};

function drawCore(g, r, fill, ringColor, ringWidth) {
  g.clear();
  g.beginFill(fill, 1);
  g.drawCircle(0, 0, r);
  g.endFill();
  if (ringWidth > 0) {
    g.lineStyle(ringWidth, ringColor, 1);
    g.drawCircle(0, 0, r);
  }
}

export function ensureStockNode(rootContainer, id, app, _textureCache) {
  const name = `node-${id}`;
  let node = rootContainer.getChildByName(name);

  if (!node) {
    node = new PIXI.Container();
    node.name = name;
    rootContainer.addChild(node);

    const halo = new PIXI.Graphics();
    halo.name = 'halo';
    halo.visible = false;
    node.addChild(halo);

    const core = new PIXI.Graphics();
    core.name = 'core';
    core.interactive = true;
    core.cursor = 'pointer';
    node.addChild(core);

    const label = new PIXI.Text('', {
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
    const r = v > 0 ? Math.min(STYLE.maxRadius, STYLE.minRadius + Math.log10(v + 1) * 10) : STYLE.coreIdleRadius;

    drawCore(core, r, STYLE.coreFill, STYLE.ringColor, STYLE.ringWidth);

    label.text = v > 0 ? String(v) : '';
    label.style.fontSize = Math.max(10, r * 0.8);
    label.position.set(0, 0);

    node.position.set(x, y);
    node.scale.set(worldScale);
  }

  return { container: node, update };
}

export function removeStockNode(rootContainer, id) {
  const name = `node-${id}`;
  const n = rootContainer.getChildByName(name);
  if (n && n.parent) n.parent.removeChild(n);
}

export function setStockNodeStyle(partial) {
  Object.assign(STYLE, partial || {});
}
