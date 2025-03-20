// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import * as PIXI from 'pixi.js';

export const parseSVGPath = (svgPath) => {
  if (!svgPath) return [];

  const commands = [];
  const regex = /([MLHVCSQTAZmlhvcsqtaz])([^MLHVCSQTAZmlhvcsqtaz]*)/g;
  let match;

  while ((match = regex.exec(svgPath)) !== null) {
    const command = match[1];
    const params = match[2]
      .trim()
      .split(/[\s,]+/)
      .map(parseFloat);
    commands.push({ command, params });
  }

  return commands;
};

export const drawSVGPathToPixi = (graphics, pathData) => {
  let currentX = 0;
  let currentY = 0;

  pathData.forEach(({ command, params }) => {
    switch (command) {
      case 'M': // Move to absolute
        currentX = params[0];
        currentY = params[1];
        graphics.moveTo(currentX, currentY);
        break;
      case 'm': // Move to relative
        currentX += params[0];
        currentY += params[1];
        graphics.moveTo(currentX, currentY);
        break;
      case 'L': // Line to absolute
        currentX = params[0];
        currentY = params[1];
        graphics.lineTo(currentX, currentY);
        break;
      case 'l': // Line to relative
        currentX += params[0];
        currentY += params[1];
        graphics.lineTo(currentX, currentY);
        break;
      case 'H': // Horizontal line absolute
        currentX = params[0];
        graphics.lineTo(currentX, currentY);
        break;
      case 'h': // Horizontal line relative
        currentX += params[0];
        graphics.lineTo(currentX, currentY);
        break;
      case 'V': // Vertical line absolute
        currentY = params[0];
        graphics.lineTo(currentX, currentY);
        break;
      case 'v': // Vertical line relative
        currentY += params[0];
        graphics.lineTo(currentX, currentY);
        break;
      case 'Z':
      case 'z': // Close path
        graphics.closePath();
        break;
      // Note: Curves (C, c, S, s, Q, q, T, t, A, a) would require more complex handling
      default:
        // For simplicity, we're ignoring curves in this implementation
        break;
    }
  });
};

export const createStockTexture = (textureCache, color, radius, app) => {
  const textureKey = `stock-${color}-${radius}`;
  if (textureCache.current[textureKey]) return textureCache.current[textureKey];

  const graphics = new PIXI.Graphics();
  graphics.beginFill(color, 0.7);
  graphics.drawCircle(0, 0, radius);
  graphics.endFill();
  graphics.lineStyle(1, 0x000000, 1);
  graphics.drawCircle(0, 0, radius);

  const texture = app.renderer.generateTexture(graphics);
  textureCache.current[textureKey] = texture;
  return texture;
};

export const createTransportTexture = (textureCache, sourcePos, targetPos, lineColor, lineWidth, app) => {
  const textureKey = `transport-${sourcePos.x}-${sourcePos.y}-${targetPos.x}-${targetPos.y}-${lineColor}-${lineWidth}`;
  if (textureCache.current[textureKey]) return textureCache.current[textureKey];

  const midX = (sourcePos.x + targetPos.x) / 2;
  const midY = (sourcePos.y + targetPos.y) / 2;
  const dx = targetPos.x - sourcePos.x;
  const dy = targetPos.y - sourcePos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const offset = distance * 0.2;
  const controlX = midX - (dy * offset) / distance;
  const controlY = midY + (dx * offset) / distance;

  const padding = Math.max(lineWidth * 2, 10);
  const minX = Math.min(sourcePos.x, targetPos.x, controlX) - padding;
  const minY = Math.min(sourcePos.y, targetPos.y, controlY) - padding;
  const maxX = Math.max(sourcePos.x, targetPos.x, controlX) + padding;
  const maxY = Math.max(sourcePos.y, targetPos.y, controlY) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const graphics = new PIXI.Graphics();
  graphics.lineStyle(lineWidth, lineColor, 0.6);
  graphics.moveTo(sourcePos.x - minX, sourcePos.y - minY);
  graphics.quadraticCurveTo(controlX - minX, controlY - minY, targetPos.x - minX, targetPos.y - minY);

  const texture = app.renderer.generateTexture(graphics, {
    resolution: 1,
    region: new PIXI.Rectangle(0, 0, width, height),
  });

  textureCache.current[textureKey] = {
    texture,
    x: minX,
    y: minY,
    width,
    height,
  };

  return textureCache.current[textureKey];
};
