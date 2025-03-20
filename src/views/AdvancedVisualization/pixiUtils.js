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

  // Add extra padding for the glow effect
  const glowSize = lineWidth * 4;
  const padding = Math.max(glowSize, 20);
  const minX = Math.min(sourcePos.x, targetPos.x, controlX) - padding;
  const minY = Math.min(sourcePos.y, targetPos.y, controlY) - padding;
  const maxX = Math.max(sourcePos.x, targetPos.x, controlX) + padding;
  const maxY = Math.max(sourcePos.y, targetPos.y, controlY) + padding;
  const width = maxX - minX;
  const height = maxY - minY;

  const graphics = new PIXI.Graphics();

  // Add glow effect (drawn first so it's behind the main line)
  graphics.lineStyle(lineWidth * 3, lineColor, 0.3);
  graphics.moveTo(sourcePos.x - minX, sourcePos.y - minY);
  graphics.quadraticCurveTo(controlX - minX, controlY - minY, targetPos.x - minX, targetPos.y - minY);

  // Add a second glow layer for more intensity
  graphics.lineStyle(lineWidth * 2, lineColor, 0.4);
  graphics.moveTo(sourcePos.x - minX, sourcePos.y - minY);
  graphics.quadraticCurveTo(controlX - minX, controlY - minY, targetPos.x - minX, targetPos.y - minY);

  // Draw the main line
  graphics.lineStyle(lineWidth, lineColor, 0.8);
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
    // Store curve data for the moving dots
    curveData: {
      sourceX: sourcePos.x - minX,
      sourceY: sourcePos.y - minY,
      controlX: controlX - minX,
      controlY: controlY - minY,
      targetX: targetPos.x - minX,
      targetY: targetPos.y - minY,
    },
  };

  return textureCache.current[textureKey];
};

// Function to calculate a point on a quadratic curve at time t (0-1)
export const getQuadraticPoint = (p0x, p0y, p1x, p1y, p2x, p2y, t) => {
  const mt = 1 - t;
  return {
    x: mt * mt * p0x + 2 * mt * t * p1x + t * t * p2x,
    y: mt * mt * p0y + 2 * mt * t * p1y + t * t * p2y,
  };
};

// Create moving dots along a transport path
export const createMovingDots = (curveData, color, app) => {
  const container = new PIXI.Container();
  const numDots = 5; // Number of dots to create
  const dots = [];

  // Create dots with different positions along the curve
  for (let i = 0; i < numDots; i++) {
    const dot = new PIXI.Graphics();
    const dotSize = 3 + Math.random() * 2; // Slightly randomize dot size

    // Draw the dot
    dot.beginFill(color, 0.8);
    dot.drawCircle(0, 0, dotSize);
    dot.endFill();

    // Add a small glow
    dot.beginFill(color, 0.3);
    dot.drawCircle(0, 0, dotSize * 2);
    dot.endFill();

    // Set initial position (evenly spaced along the curve)
    const initialT = i / numDots;
    const pos = getQuadraticPoint(
      curveData.sourceX,
      curveData.sourceY,
      curveData.controlX,
      curveData.controlY,
      curveData.targetX,
      curveData.targetY,
      initialT
    );

    dot.x = pos.x;
    dot.y = pos.y;

    // Store the current t value for animation
    dot.tValue = initialT;
    dot.speed = 0.002 + Math.random() * 0.002; // Slightly randomize speed

    container.addChild(dot);
    dots.push(dot);
  }

  // Add animation function to the container
  container.animateDots = () => {
    dots.forEach((dot) => {
      // Update t value (move along the curve)
      dot.tValue += dot.speed;
      if (dot.tValue > 1) {
        dot.tValue = 0; // Reset to start when reaching the end
      }

      // Calculate new position
      const pos = getQuadraticPoint(
        curveData.sourceX,
        curveData.sourceY,
        curveData.controlX,
        curveData.controlY,
        curveData.targetX,
        curveData.targetY,
        dot.tValue
      );

      // Update dot position
      dot.x = pos.x;
      dot.y = pos.y;
    });
  };

  return container;
};
