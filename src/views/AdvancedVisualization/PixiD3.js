// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Slider, Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import '@pixi/unsafe-eval';
import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import stocksData from './data/stocks.json';
import transportsData from './data/transports.json';
import worldMapData from './data/worldMap.geo.json';
import {
  createStockTexture,
  createTransportTexture,
  parseSVGPath,
  drawSVGPathToPixi,
  createMovingDots,
} from './pixiUtils';

const PixiD3 = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  // Refs for PIXI containers
  const mapContainerRef = useRef(null);
  const stocksContainerRef = useRef(null);
  const linksContainerRef = useRef(null);
  const dotsContainerRef = useRef(null);
  const timeTextRef = useRef(null);
  // Refs for visualization parameters
  const projectionRef = useRef(null);
  const stockPositionsRef = useRef({});
  const pixiTickerRef = useRef(null);
  // Refs for sprite management
  const stockSpritesRef = useRef({});
  const transportSpritesRef = useRef({});
  const transportDotsRef = useRef({});
  const textureCache = useRef({});

  const [timePoints, setTimePoints] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // Time between replay animation frames, in ms
  const animationRef = useRef(null);

  const { timeseriesStocks, timeseriesTransports } = useMemo(() => {
    const numTimePoints = 50;
    const generatedTimePoints = Array.from({ length: numTimePoints }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (numTimePoints - 1) + i);
      return date.toISOString().split('T')[0];
    });
    setTimePoints(generatedTimePoints);

    const stocksTimeseries = {};
    stocksData.forEach((stock) => {
      const initialValue = parseInt(stock.initialStock) || 100;

      stocksTimeseries[stock.id] = generatedTimePoints.map((_, index) => {
        const trendFactor = index / (numTimePoints - 1);
        const randomFactor = Math.random() * 0.2 + 0.95;
        let value = initialValue * (1.1 - trendFactor * 0.2) * randomFactor;
        if (Math.random() < 0.2) value *= Math.random() < 0.5 ? 0.7 : 1.3;
        return Math.round(value);
      });
    });

    const transportsTimeseries = {};
    transportsData.forEach((transport) => {
      transportsTimeseries[transport.id] = generatedTimePoints.map((_, index) => {
        const isActive = Math.random() < 0.8;
        const flowAmount = isActive ? Math.floor(Math.random() * 100) + 10 : 0;

        return {
          isActive,
          flowAmount,
        };
      });
    });

    return {
      timeseriesStocks: stocksTimeseries,
      timeseriesTransports: transportsTimeseries,
    };
  }, []);

  const startAnimation = useCallback(() => {
    if (animationRef.current) return;

    setIsPlaying(true);

    animationRef.current = setInterval(() => {
      setCurrentTimeIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        return nextIndex >= timePoints.length ? 0 : nextIndex;
      });
    }, animationSpeed);
  }, [timePoints.length, animationSpeed]);

  const pauseAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const resetAnimation = useCallback(() => {
    pauseAnimation();
    setCurrentTimeIndex(0);
  }, [pauseAnimation]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  const processedStocksData = useMemo(() => {
    return stocksData.map((item) => {
      const currentStock = timeseriesStocks[item.id]
        ? timeseriesStocks[item.id][currentTimeIndex]
        : parseInt(item.initialStock) || 0;

      return {
        ...item,
        initialStock: parseInt(item.initialStock) || 0,
        currentStock,
      };
    });
  }, [timeseriesStocks, currentTimeIndex]);

  const processedTransportsData = useMemo(() => {
    return transportsData
      .map((item) => {
        const currentActivity = timeseriesTransports[item.id]
          ? timeseriesTransports[item.id][currentTimeIndex]
          : { isActive: true, flowAmount: 50 };

        return {
          ...item,
          isActive: currentActivity.isActive,
          flowAmount: currentActivity.flowAmount,
        };
      })
      .filter((item) => item.isActive);
  }, [timeseriesTransports, currentTimeIndex]);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight - 120;
    const app = new PIXI.Application({
      width: containerWidth,
      height: containerHeight,
      backgroundColor: theme.palette.background.default,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    appRef.current = app;
    canvasRef.current.appendChild(app.view);
    app.view.style.width = '100%';
    app.view.style.height = '100%';
    app.view.style.display = 'block';

    const width = app.screen.width;
    const height = app.screen.height;

    const renderElements = () => {
      // Clear texture cache on re-render
      textureCache.current = {};
      stockSpritesRef.current = {};
      transportSpritesRef.current = {};

      const mapContainer = new PIXI.Container();
      const stocksContainer = new PIXI.Container();
      const linksContainer = new PIXI.Container();
      const dotsContainer = new PIXI.Container();
      mapContainerRef.current = mapContainer;
      stocksContainerRef.current = stocksContainer;
      linksContainerRef.current = linksContainer;
      dotsContainerRef.current = dotsContainer;
      app.stage.addChild(mapContainer);
      app.stage.addChild(linksContainer);
      app.stage.addChild(dotsContainer);
      app.stage.addChild(stocksContainer);

      if (pixiTickerRef.current) pixiTickerRef.current.destroy();
      pixiTickerRef.current = new PIXI.Ticker();
      pixiTickerRef.current.add(() => {
        Object.values(transportDotsRef.current).forEach((dotContainer) => {
          if (dotContainer && dotContainer.animateDots) {
            dotContainer.animateDots();
          }
        });
      });
      pixiTickerRef.current.start();

      const timeText = new PIXI.Text(`Date: ${timePoints[currentTimeIndex] || 'Loading...'}`, {
        fontFamily: 'Arial',
        fontSize: 16,
        fill: theme.palette.text.primary,
        fontWeight: 'bold',
      });
      timeText.x = width - 150;
      timeText.y = 20;
      timeTextRef.current = timeText;
      app.stage.addChild(timeText);

      const projection = d3
        .geoMercator()
        .scale((width - 20) / (2 * Math.PI))
        .translate([width / 2, height / 1.5]);
      projectionRef.current = projection;

      const path = d3.geoPath().projection(projection);
      const mapGraphics = new PIXI.Graphics();
      mapContainer.addChild(mapGraphics);
      mapGraphics.lineStyle(1, 0x888888, 1);
      mapGraphics.beginFill(0xeeeeee, 1);
      worldMapData.features.forEach((feature) => {
        const svgPath = path(feature);
        if (!svgPath) return;

        const pathData = parseSVGPath(svgPath);
        drawSVGPathToPixi(mapGraphics, pathData);
      });
      mapGraphics.endFill();

      stocksData.forEach((stock) => {
        const [x, y] = projection([parseFloat(stock.longitude), parseFloat(stock.latitude)]);
        stockPositionsRef.current[stock.id] = { x, y };
      });

      updateDynamicElements();
    };

    renderElements();

    const handleResize = () => {
      if (!containerRef.current || !appRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight - 120;
      appRef.current.renderer.resize(newWidth, newHeight);

      while (app.stage.children.length > 0) app.stage.removeChild(app.stage.children[0]);

      renderElements();
    };

    window.addEventListener('resize', handleResize);

    const canvasToCleanup = canvasRef.current;
    return () => {
      window.removeEventListener('resize', handleResize);

      // Clean up textures
      Object.values(textureCache.current).forEach((item) => {
        if (item.texture) {
          item.texture.destroy(true);
        } else if (item instanceof PIXI.Texture) {
          item.destroy(true);
        }
      });

      app.destroy(true, true);
      if (canvasToCleanup && appRef.current?.view) {
        canvasToCleanup.removeChild(appRef.current.view);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]); // Only depend on theme, not on time-related state

  const updateDynamicElements = useCallback(() => {
    if (
      !appRef.current ||
      !stocksContainerRef.current ||
      !linksContainerRef.current ||
      !dotsContainerRef.current ||
      !timeTextRef.current
    )
      return;

    const app = appRef.current;
    const stocksContainer = stocksContainerRef.current;
    const linksContainer = linksContainerRef.current;
    const dotsContainer = dotsContainerRef.current;
    const timeText = timeTextRef.current;
    const projection = projectionRef.current;
    const stockPositions = stockPositionsRef.current;

    if (!projection || !stockPositions) return;

    timeText.text = `Date: ${timePoints[currentTimeIndex] || 'Loading...'}`;

    const width = app.screen.width;
    const height = app.screen.height;
    const maxRadius = Math.min(width, height) * 0.01;
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(processedStocksData, (d) => d.currentStock || parseInt(d.initialStock))])
      .range([maxRadius * 0.2, maxRadius]);

    const stepTypes = [...new Set(processedStocksData.map((d) => d.step))];
    const colorScale = d3.scaleOrdinal().domain(stepTypes).range(d3.schemeCategory10);

    const fontSize = Math.max(12, Math.min(width, height) * 0.02);
    const textStyle = new PIXI.TextStyle({ fontFamily: 'Arial', fontSize, fill: theme.palette.text.primary });

    while (linksContainer.children.length > 0) linksContainer.removeChild(linksContainer.children[0]);
    while (dotsContainer.children.length > 0) dotsContainer.removeChild(dotsContainer.children[0]);

    Object.keys(transportDotsRef.current).forEach((id) => {
      const dotContainer = transportDotsRef.current[id];
      if (dotContainer && dotContainer.parent) {
        dotContainer.parent.removeChild(dotContainer);
      }
    });
    transportDotsRef.current = {};

    processedTransportsData.forEach((transport) => {
      const sourcePos = stockPositions[transport.source];
      const targetPos = stockPositions[transport.target];

      if (sourcePos && targetPos) {
        let lineColor = 0x888888;
        if (transport.mode === 'Road') lineColor = 0x3366cc;
        else if (transport.mode === 'Air') lineColor = 0xcc3366;
        else if (transport.mode === 'Sea') lineColor = 0x33cc66;

        const lineWidth = transport.flowAmount ? Math.max(1, Math.min(5, transport.flowAmount / 20)) : 2;
        const textureInfo = createTransportTexture(textureCache, sourcePos, targetPos, lineColor, lineWidth, app);
        const sprite = new PIXI.Sprite(textureInfo.texture);
        sprite.x = textureInfo.x;
        sprite.y = textureInfo.y;

        linksContainer.addChild(sprite);
        transportSpritesRef.current[transport.id] = sprite;

        if (textureInfo.curveData) {
          const dotContainer = createMovingDots(textureInfo.curveData, '#ffffff', app);
          dotContainer.x = textureInfo.x;
          dotContainer.y = textureInfo.y;
          dotsContainer.addChild(dotContainer);
          transportDotsRef.current[transport.id] = dotContainer;
        }
      }
    });

    // Clear previous stock sprites that are no longer needed
    const activeStockIds = new Set(processedStocksData.map((s) => s.id));
    Object.keys(stockSpritesRef.current).forEach((id) => {
      if (!activeStockIds.has(id)) {
        const sprite = stockSpritesRef.current[id];
        if (sprite && sprite.parent) {
          sprite.parent.removeChild(sprite);
        }
        delete stockSpritesRef.current[id];
      }
    });

    processedStocksData.forEach((stock) => {
      const [x, y] = projection([parseFloat(stock.longitude), parseFloat(stock.latitude)]);
      const color = parseInt(colorScale(stock.step).slice(1), 16);
      const radius = sizeScale(stock.currentStock || parseInt(stock.initialStock));
      const texture = createStockTexture(textureCache, color, radius, app);

      if (stockSpritesRef.current[stock.id]) {
        const stockContainer = stockSpritesRef.current[stock.id];
        stockContainer.x = x;
        stockContainer.y = y;

        const circleSprite = stockContainer.getChildAt(0);
        circleSprite.texture = texture;
        circleSprite.anchor.set(0.5);

        const label = stockContainer.getChildAt(1);
        label.y = -radius - fontSize * 0.8;
      } else {
        const stockContainer = new PIXI.Container();
        stockContainer.x = x;
        stockContainer.y = y;

        const circleSprite = new PIXI.Sprite(texture);
        circleSprite.anchor.set(0.5);
        stockContainer.addChild(circleSprite);

        const label = new PIXI.Text(stock.label, textStyle);
        label.anchor.set(0.5);
        label.y = -radius - fontSize * 0.8;
        label.visible = false;
        stockContainer.addChild(label);

        circleSprite.interactive = true;
        circleSprite.buttonMode = true;
        circleSprite.on('mouseover', () => {
          const hoverTexture = createStockTexture(textureCache, color, radius * 1.1, app);
          circleSprite.texture = hoverTexture;
          label.visible = true;
        });
        circleSprite.on('mouseout', () => {
          circleSprite.texture = texture;
          label.visible = false;
        });

        stocksContainer.addChild(stockContainer);
        stockSpritesRef.current[stock.id] = stockContainer;
      }
    });
  }, [processedStocksData, processedTransportsData, currentTimeIndex, timePoints, theme]);

  useEffect(() => {
    updateDynamicElements();
  }, [updateDynamicElements, currentTimeIndex]);

  return (
    <div
      data-cy="pixi-d3-view"
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ margin: '10px 0' }}>Global Stock Distribution</h2>
      <div
        ref={canvasRef}
        style={{
          flex: 1,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      ></div>

      {/* Timeline controls */}
      <Box sx={{ width: '100%', padding: '20px 40px', marginTop: '10px' }}>
        <Typography gutterBottom>Timeline</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={isPlaying ? pauseAnimation : startAnimation}
            sx={{ mr: 1 }}
          >
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
          <Button variant="outlined" onClick={resetAnimation} sx={{ mr: 2 }}>
            <RestartAltIcon />
          </Button>
          <Box sx={{ flexGrow: 1 }}>
            <Slider
              value={currentTimeIndex}
              onChange={(_, value) => {
                pauseAnimation();
                setCurrentTimeIndex(value);
              }}
              step={1}
              marks={timePoints.map((date, index) => ({ value: index, label: index % 10 === 0 ? date : '' }))}
              min={0}
              max={timePoints.length - 1}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => timePoints[value]}
            />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2 }}>Animation Speed:</Typography>
          <Slider
            value={1000 - animationSpeed}
            onChange={(_, value) => setAnimationSpeed(1000 - value)}
            step={50}
            min={0}
            max={950}
            sx={{ width: 200 }}
            valueLabelDisplay="auto"
            valueLabelFormat={() => `${animationSpeed}ms`}
          />
        </Box>
      </Box>
    </div>
  );
};

export default PixiD3;
