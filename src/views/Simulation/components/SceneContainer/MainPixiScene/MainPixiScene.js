// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import { Application, Assets, Sprite } from 'pixi.js';

const mainLoop = async (containerRef, app) => {
  // Create a PixiJS application.

  app.current = app;

  // Intialize the application.
  await app.init({ background: '#000000', resizeTo: window });

  // Then adding the application's canvas to the DOM body.
  containerRef.current.appendChild(app.canvas);

  // Load the bunny texture.
  const texture = await Assets.load('/assets/frog_1.png');

  // Create a new Sprite from an image path.
  const frogs = Array.from({ length: 100 }, () => new Sprite(texture));

  frogs.forEach((frog, index) => {
    app.stage.addChild(frog);

    frog.x = Math.floor(Math.random() * app.screen.width);
    frog.y = Math.floor(Math.random() * app.screen.height);
  });

  // Add an animation loop callback to the application's ticker.
  const FROG_STEP = 2;
  const FROG_CHANGE_DIRECTION_PER_SECOND = 1;
  const FPS = 60;

  let elapsed = 0.0;
  app.ticker.add((delta) => {
    elapsed += delta.deltaTime;
    const FPSModulo = elapsed % (FPS / FROG_CHANGE_DIRECTION_PER_SECOND);
    frogs.forEach((frog) => {
      if (FPSModulo > 0 && FPSModulo < 1) {
        frog.direction = Math.floor(Math.random() * 4);
      }
      const frogStepAdjusted = FROG_STEP * delta.deltaTime;
      if (frog.direction === 0 && frog.y > 0) {
        frog.y -= frogStepAdjusted;
      } else if (frog.direction === 1 && frog.y + frog.height < app.screen.height) {
        frog.y += frogStepAdjusted;
      } else if (frog.direction === 2 && frog.x > 0) {
        frog.x -= frogStepAdjusted;
      } else if (frog.direction === 3 && frog.x + frog.width < app.screen.width) {
        frog.x += frogStepAdjusted;
      }
    });
  });
};

const MainPixiScene = () => {
  const containerRef = useRef(null);
  const app = new Application();

  useEffect(() => {
    mainLoop(containerRef, app);

    return () => {
      app.destroy(true, { children: true });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
};

export default MainPixiScene;
