// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useRef, useState } from 'react';

const DEFAULT_DRAWER_WIDTH = 442;
const MIN_DRAWER_WIDTH = 160;
const MAX_DRAWER_WIDTH = 800;

export const useResizableDrawer = () => {
  const isResizing = useRef(false);
  const lastXPosition = useRef(0);
  const [width, setWidth] = useState(DEFAULT_DRAWER_WIDTH);

  const handleMousemove = (event) => {
    if (!isResizing.current) return;

    const difference = lastXPosition.current - event.clientX;
    lastXPosition.current = event.clientX;
    setWidth((previousWidth) => {
      const newWidth = previousWidth + difference;
      return Math.min(MAX_DRAWER_WIDTH, Math.max(MIN_DRAWER_WIDTH, newWidth));
    });
  };

  const startResizing = useCallback((event) => {
    const stopResizing = () => {
      isResizing.current = false;
      document.removeEventListener('mousemove', handleMousemove);
      document.removeEventListener('mouseup', stopResizing);
    };

    event.preventDefault();
    if (isResizing.current) return;

    isResizing.current = true;
    document.addEventListener('mousemove', handleMousemove);
    document.addEventListener('mouseup', stopResizing);
    lastXPosition.current = event.clientX;

    return stopResizing;
  }, []);

  return { width, startResizing };
};
