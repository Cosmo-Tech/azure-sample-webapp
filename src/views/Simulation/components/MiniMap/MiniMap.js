// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';

const MiniMap = () => {
  const miniMapRef = useRef(null);

  useEffect(() => {
    const miniMapElement = miniMapRef.current;
    if (miniMapElement) {
      miniMapElement.style.width = '200px';
      miniMapElement.style.height = '200px';
      miniMapElement.style.border = '1px solid black';
      miniMapElement.style.overflow = 'hidden';
    }
  }, []);

  return <div ref={miniMapRef} />;
};

export default MiniMap;
