import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RemoveIcon from '@mui/icons-material/Remove';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Slider, Button, Box, Typography, Stack } from '@mui/material';
import { useTheme } from '@mui/styles';
import '@pixi/unsafe-eval';
import * as d3 from 'd3';
import * as PIXI from 'pixi.js';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { ensureStockNode, removeStockNode } from './components/pixiNode';
import { ensureTransportEdge, removeTransportEdge } from './components/pixiTransport';
import stocksData from './data/stocks.json';
import transportsData from './data/transports.json';
import worldMapData from './data/worldMap.geo.json';
import { createStockTexture, parseSVGPath, drawSVGPathToPixi } from './pixiUtils';

const NODE_RADIUS_PX = 6;
const CLUSTER_PADDING_PX = 2;
const MIN_SCALE = 0.5;
const MAX_SCALE = 100;

const PixiD3 = () => {
  const theme = useTheme();
  const { setSelectedElementId } = useSimulationViewContext?.() ?? { setSelectedElementId: () => {} };

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  const worldContainerRef = useRef(null);

  // layers
  const mapContainerRef = useRef(null);
  const stocksContainerRef = useRef(null);
  const clustersContainerRef = useRef(null);
  const linksContainerRef = useRef(null);
  const timeTextRef = useRef(null);

  // data
  const projectionRef = useRef(null);
  const stockPositionsRef = useRef({});
  const pixiTickerRef = useRef(null);

  // sprites
  const stockSpritesRef = useRef({});
  const transportSpritesRef = useRef({});
  const clusterSpritesRef = useRef({});
  const textureCache = useRef({});

  // pan/zoom state
  const scaleRef = useRef(1);
  const dragStateRef = useRef({ dragging: false, start: { x: 0, y: 0 }, origin: { x: 0, y: 0 } });

  /** timeline/animation state */
  const [timePoints, setTimePoints] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const animationRef = useRef(null);

  useEffect(() => {
    const numTimePoints = 50;
    const generated = Array.from({ length: numTimePoints }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (numTimePoints - 1) + i);
      return date.toISOString().split('T')[0];
    });
    setTimePoints(generated);
  }, []);

  const { timeseriesStocks, timeseriesTransports } = useMemo(() => {
    if (timePoints.length === 0) return { timeseriesStocks: {}, timeseriesTransports: {} };
    const numTimePoints = timePoints.length;

    const stocksTimeseries = {};
    stocksData.forEach((stock) => {
      const initialValue = parseInt(stock.initialStock) || 100;
      const basePattern = Array.from({ length: numTimePoints }, (_, index) => {
        const phase = (stock.id.charCodeAt(0) % 10) / 10;
        return Math.sin(index / 8 + phase) * 0.1 + 1;
      });
      stocksTimeseries[stock.id] = basePattern.map((patternValue, index) => {
        const trendFactor = index / (numTimePoints - 1);
        const jitter = 1 + (Math.random() * 0.1 - 0.05);
        return Math.round(initialValue * patternValue * (1.05 - trendFactor * 0.1) * jitter);
      });
    });

    const transportsTimeseries = {};
    transportsData.forEach((transport) => {
      const baseFlow = parseInt(transport.baseFlow) || 60;
      const flowPattern = Array.from({ length: numTimePoints }, (_, index) => {
        const phase = (transport.id.charCodeAt(0) % 10) / 10;
        return Math.sin(index / 10 + phase) * 0.15 + 1;
      });
      transportsTimeseries[transport.id] = flowPattern.map((patternValue, index) => {
        const trendFactor = index / (numTimePoints - 1);
        const jitter = 1 + (Math.random() * 0.05 - 0.025);
        const flowAmount = baseFlow * patternValue * (1.02 - trendFactor * 0.05) * jitter;
        return { flowAmount: Math.round(flowAmount) };
      });
    });

    return { timeseriesStocks: stocksTimeseries, timeseriesTransports: transportsTimeseries };
  }, [timePoints]);

  const startAnimation = useCallback(() => {
    if (animationRef.current || timePoints.length === 0) return;
    setIsPlaying(true);
    animationRef.current = setInterval(() => {
      setCurrentTimeIndex((prev) => (prev + 1 >= timePoints.length ? 0 : prev + 1));
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

  useEffect(
    () => () => {
      if (animationRef.current) clearInterval(animationRef.current);
    },
    []
  );

  const processedStocksData = useMemo(
    () =>
      stocksData.map((s) => ({
        ...s,
        initialStock: parseInt(s.initialStock) || 0,
        currentStock:
          timeseriesStocks[s.id]?.[currentTimeIndex] ??
          (Number.isFinite(parseInt(s.initialStock)) ? parseInt(s.initialStock) : 0),
      })),
    [timeseriesStocks, currentTimeIndex]
  );

  const processedTransportsData = useMemo(
    () =>
      transportsData.map((t) => {
        const cur = timeseriesTransports[t.id]?.[currentTimeIndex] ?? { flowAmount: 50 };
        return { ...t, flowAmount: cur.flowAmount };
      }),
    [timeseriesTransports, currentTimeIndex]
  );

  // PIXI setup
  useEffect(() => {
    let destroyed = false;

    const bootstrap = async () => {
      if (!canvasRef.current || !containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight - 120;

      // v8: create then init
      const app = new PIXI.Application();
      await app.init({
        width: containerWidth,
        height: containerHeight,
        // v8: 'background' replaces 'backgroundColor'
        background: theme.palette?.background?.default ?? 0x000000,
        resolution: window.devicePixelRatio || 1,
        antialias: true,
      });
      if (destroyed) {
        app.destroy();
        return;
      }

      appRef.current = app;

      // v8: 'canvas' replaces 'view'
      canvasRef.current.appendChild(app.canvas);
      app.canvas.style.width = '100%';
      app.canvas.style.height = '100%';

      const getWidth = () => app.renderer.width;
      const getHeight = () => app.renderer.height;

      const renderElements = () => {
        textureCache.current = {};
        stockSpritesRef.current = {};
        transportSpritesRef.current = {};
        clusterSpritesRef.current = {};

        const worldContainer = new PIXI.Container();
        worldContainerRef.current = worldContainer;

        const mapContainer = new PIXI.Container();
        const linksContainer = new PIXI.Container();
        const stocksContainer = new PIXI.Container();
        const clustersContainer = new PIXI.Container();

        mapContainerRef.current = mapContainer;
        linksContainerRef.current = linksContainer;
        stocksContainerRef.current = stocksContainer;
        clustersContainerRef.current = clustersContainer;

        worldContainer.addChild(mapContainer, linksContainer, stocksContainer, clustersContainer);
        app.stage.addChild(worldContainer);

        // v8 Ticker
        if (pixiTickerRef.current) pixiTickerRef.current.destroy();
        pixiTickerRef.current = new PIXI.Ticker();
        pixiTickerRef.current.start();

        const timeText = new PIXI.Text({
          text: `Date: ${timePoints[currentTimeIndex] || 'Loading...'}`,
          style: {
            fontFamily: 'Arial',
            fontSize: 16,
            fill: theme.palette?.text?.primary ?? 0xffffff,
            fontWeight: 'bold',
          },
        });
        timeText.x = getWidth() - 150;
        timeText.y = 20;
        timeTextRef.current = timeText;
        app.stage.addChild(timeText);

        const projection = d3
          .geoMercator()
          .scale((getWidth() - 20) / (2 * Math.PI))
          .translate([getWidth() / 2, getHeight() / 1.5]);
        projectionRef.current = projection;

        const path = d3.geoPath().projection(projection);
        const mapGraphics = new PIXI.Graphics();
        mapContainer.addChild(mapGraphics);

        // v8 shape-style API
        mapGraphics.setStrokeStyle({
          width: 1,
          color: 0x555555,
          alpha: 1,
        });
        mapGraphics.setFillStyle(0x2b2b2b, 1);

        (worldMapData.features ?? []).forEach((feature) => {
          const svgPath = path(feature);
          if (!svgPath) return;
          const pathData = parseSVGPath(svgPath);
          drawSVGPathToPixi(mapGraphics, pathData);
        });

        // Close the shapes with fill+stroke
        mapGraphics.fill();
        mapGraphics.stroke();

        // Precompute stock positions
        stocksData.forEach((stock) => {
          const [x, y] = projection([parseFloat(stock.longitude), parseFloat(stock.latitude)]);
          stockPositionsRef.current[stock.id] = { x, y };
        });

        enablePanZoom(app);
        updateDynamicElements();
      };

      renderElements();

      const handleResize = () => {
        if (!containerRef.current || !appRef.current) return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight - 120;

        appRef.current.renderer.resize(newWidth, newHeight);

        // Clear the stage
        while (appRef.current.stage.children.length > 0) {
          appRef.current.stage.removeChild(appRef.current.stage.children[0]);
        }
        scaleRef.current = 1;
        // Re-render
        renderElements();
      };

      window.addEventListener('resize', handleResize);

      const canvasToCleanup = canvasRef.current;
      return () => {
        window.removeEventListener('resize', handleResize);
        Object.values(textureCache.current).forEach((item) => {
          if (item?.texture) item.texture.destroy(true);
          else if (item?.destroy) item.destroy(true);
        });
        if (pixiTickerRef.current) {
          pixiTickerRef.current.stop();
          pixiTickerRef.current.destroy();
          pixiTickerRef.current = null;
        }
        app.destroy();
        if (canvasToCleanup && app.canvas?.parentNode === canvasToCleanup) {
          canvasToCleanup.removeChild(app.canvas);
        }
      };
    };

    bootstrap();

    return () => {
      destroyed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, timePoints.length]);

  const buildClusters = useCallback(() => {
    const scale = scaleRef.current;
    const touchWorldRadius = (2 * NODE_RADIUS_PX + CLUSTER_PADDING_PX) / scale;

    const clusters = [];
    const clusterByStockId = new Map(); // initial (pre-merge)

    processedStocksData.forEach((stock) => {
      const pos = stockPositionsRef.current[stock.id];
      if (!pos) return;
      let assigned = false;

      for (const cluster of clusters) {
        const dx = cluster.x - pos.x;
        const dy = cluster.y - pos.y;
        const dist = Math.hypot(dx, dy);
        if (dist <= touchWorldRadius) {
          cluster.sum += stock.currentStock || parseInt(stock.initialStock) || 0;
          cluster.count += 1;
          cluster.stocks.push(stock.id);
          cluster.x = (cluster.x * (cluster.count - 1) + pos.x) / cluster.count;
          cluster.y = (cluster.y * (cluster.count - 1) + pos.y) / cluster.count;
          clusterByStockId.set(stock.id, cluster.key);
          assigned = true;
          break;
        }
      }

      if (!assigned) {
        const key = `c${clusters.length}`;
        const value = stock.currentStock || parseInt(stock.initialStock) || 0;
        const newCluster = { key, x: pos.x, y: pos.y, count: 1, sum: value, stocks: [stock.id] };
        clusters.push(newCluster);
        clusterByStockId.set(stock.id, key);
      }
    });

    const filteredClusters = clusters.filter((c) => c.count > 1);
    return { clusters: filteredClusters };
  }, [processedStocksData]);

  /** ---------------- DYNAMIC DRAW ---------------- */
  const updateDynamicElements = useCallback(() => {
    if (
      !appRef.current ||
      !stocksContainerRef.current ||
      !linksContainerRef.current ||
      !timeTextRef.current ||
      !clustersContainerRef.current
    )
      return;

    const app = appRef.current;
    const linksContainer = linksContainerRef.current;
    const clustersContainer = clustersContainerRef.current;
    const timeText = timeTextRef.current;
    const projection = projectionRef.current;

    timeText.text = `Date: ${timePoints[currentTimeIndex] || 'Loading...'}`;

    const width = app.renderer.width;
    const height = app.renderer.height;
    const maxRadius = Math.min(width, height) * 0.01;
    const sizeScale = d3
      .scaleSqrt()
      .domain([0, d3.max(processedStocksData, (d) => d.currentStock || parseInt(d.initialStock)) || 1])
      .range([maxRadius * 0.01, maxRadius]);

    const scale = scaleRef.current;

    // ----- INITIAL CLUSTERS -----
    const { clusters: baseClusters } = buildClusters();

    // ----- MERGE OVERLAPPING CLUSTERS (iterate until stable) -----
    const mergeOverlapping = (clustersArr) => {
      const worldTouchFromPixels = (px) => px / scale;
      let changed = true;
      const clusters = clustersArr.map((c, idx) => ({ ...c, key: `c${idx}` }));

      while (changed) {
        changed = false;
        let shouldBreak = false;
        for (let i = 0; i < clusters.length; i++) {
          for (let j = i + 1; j < clusters.length; j++) {
            const a = clusters[i];
            const b = clusters[j];
            // radii are defined in SCREEN px via sizeScale; convert to world
            const raWorld = worldTouchFromPixels(sizeScale(a.sum / 2));
            const rbWorld = worldTouchFromPixels(sizeScale(b.sum / 2));
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.hypot(dx, dy);
            if (dist <= raWorld + rbWorld) {
              // merge b into a (weighted by count)
              const newCount = a.count + b.count;
              const newX = (a.x * a.count + b.x * b.count) / newCount;
              const newY = (a.y * a.count + b.y * b.count) / newCount;
              const merged = {
                key: a.key,
                x: newX,
                y: newY,
                count: newCount,
                sum: a.sum + b.sum,
                stocks: [...a.stocks, ...b.stocks],
              };
              clusters.splice(j, 1);
              clusters[i] = merged;
              changed = true;
              shouldBreak = true;
              break;
            }
          }
          if (shouldBreak) break;
        }
      }
      // build stock -> cluster map
      const stockToCluster = new Map();
      clusters.forEach((c, idx) => {
        c.key = `c${idx}`;
        c.stocks.forEach((sid) => stockToCluster.set(sid, c.key));
      });
      return { clusters, stockToCluster };
    };

    const { clusters: mergedClusters, stockToCluster } = mergeOverlapping(baseClusters);

    // set of stocks hidden because they are inside a shown cluster
    const clusteredStockIds = new Set();
    mergedClusters.forEach((c) => c.stocks.forEach((sid) => clusteredStockIds.add(sid)));

    // ----- STOCK NODES (skip those under clusters) -----
    const activeStockIds = new Set(processedStocksData.map((s) => s.id));
    Object.keys(stockSpritesRef.current).forEach((id) => {
      if (!activeStockIds.has(id) || clusteredStockIds.has(id)) {
        removeStockNode(stocksContainerRef.current, id);
        delete stockSpritesRef.current[id];
      }
    });

    processedStocksData.forEach((stock) => {
      if (clusteredStockIds.has(stock.id)) return; // hidden under cluster
      const [x, y] = projection([parseFloat(stock.longitude), parseFloat(stock.latitude)]);
      const { container, update } = ensureStockNode(stocksContainerRef.current, stock.id, appRef.current, textureCache);
      update({ x, y, worldScale: scale });
      stockSpritesRef.current[stock.id] = container;

      // NEW: make node interactive for the MUI drawer
      if (container) {
        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.removeAllListeners?.('click');
        container.on?.('click', () => setSelectedElementId?.(stock.id));
        container.on?.('pointerover', () => (container.cursor = 'pointer'));
        container.on?.('pointerout', () => (container.cursor = 'default'));
      }
    });

    // ----- CLUSTERS (draw after nodes) -----
    while (clustersContainer.children.length > 0) clustersContainer.removeChild(clustersContainer.children[0]);
    clusterSpritesRef.current = {};

    if (mergedClusters.length > 0) {
      mergedClusters.forEach((c) => {
        const radiusPx = sizeScale(c.sum / 2); // screen space
        const color = 0xb9bac0;
        const texture = createStockTexture(textureCache, color, radiusPx, app);

        const clusterContainer = new PIXI.Container();
        clusterContainer.x = c.x;
        clusterContainer.y = c.y;

        const circle = new PIXI.Sprite(texture);
        circle.anchor.set(0.5);
        clusterContainer.addChild(circle);

        const label = new PIXI.Text({
          text: String(c.count),
          style: {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: theme.palette?.getContrastText?.('#999') ?? 0xffffff,
            fontWeight: 'bold',
          },
        });
        label.anchor.set(0.5);
        clusterContainer.addChild(label);

        clustersContainer.addChild(clusterContainer);
        clusterSpritesRef.current[c.key] = clusterContainer;

        // (Optional) click cluster to open a pseudo id
        // Uncomment if you want clusters to also open the drawer
        // clusterContainer.eventMode = 'static';
        // clusterContainer.cursor = 'pointer';
        // clusterContainer.on('click', () => setSelectedElementId?.(`cluster:${c.key}`));
      });
    }

    const flowByPair = new Map(); // key: "A|B" (sorted)
    const posFor = (idOrClusterKey) => {
      // cluster?
      const c = mergedClusters.find((x) => x.key === idOrClusterKey);
      if (c) return { x: c.x, y: c.y };
      // stock
      return stockPositionsRef.current[idOrClusterKey];
    };

    processedTransportsData.forEach((t) => {
      const a = stockToCluster.get(t.source) || t.source;
      const b = stockToCluster.get(t.target) || t.target;
      if (a === b) return; // internal to cluster; skip
      const key = `${a}|${b}`;
      const prev = flowByPair.get(key) || { flow: 0, a, b };
      prev.flow += t.flowAmount || 0;
      flowByPair.set(key, prev);
    });

    // Draw aggregated edges
    const aliveEdgeIds = new Set();
    const aggregatedEdges = Array.from(flowByPair.values());
    aggregatedEdges.forEach((edge) => {
      const s = posFor(edge.a);
      const d = posFor(edge.b);
      if (!s || !d) return;
      const id = `agg:${edge.a}->${edge.b}`;
      const { container, update } = ensureTransportEdge(linksContainer, id);
      update({
        src: s,
        dst: d,
        worldScale: scale,
        curvature: 0.25,
        widthPx: Math.max(2, Math.min(10, edge.flow / 20)),
        color: 0xffffff,
        alpha: 1,
        arrowLenPx: 14,
        arrowWidthPx: 12,
        arrowAtT: 0.5,
        dashed: false,
      });
      transportSpritesRef.current[id] = container;
      aliveEdgeIds.add(id);

      if (container) {
        container.eventMode = 'static';
        container.cursor = 'pointer';
        container.removeAllListeners?.('click');
        container.on?.('click', () => setSelectedElementId?.(id));
      }
    });

    // Remove any stale edges (including previous non-aggregated ids)
    Object.keys(transportSpritesRef.current).forEach((id) => {
      if (!aliveEdgeIds.has(id)) {
        removeTransportEdge(linksContainer, id);
        delete transportSpritesRef.current[id];
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processedStocksData, processedTransportsData, currentTimeIndex, timePoints, buildClusters, theme]);

  useEffect(() => {
    updateDynamicElements();
  }, [updateDynamicElements, currentTimeIndex]);

  const zoomTo = useCallback(
    (nextScale, center) => {
      const app = appRef.current;
      const world = worldContainerRef.current;
      if (!app || !world) return;
      const old = scaleRef.current;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, nextScale));
      if (newScale === old) return;

      const defaultPt = { x: app.renderer.width / 2, y: app.renderer.height / 2 };
      const pt = center || defaultPt;

      const wx = (pt.x - world.x) / old;
      const wy = (pt.y - world.y) / old;
      world.x = pt.x - wx * newScale;
      world.y = pt.y - wy * newScale;
      world.scale.set(newScale);
      scaleRef.current = newScale;
      updateDynamicElements();
    },
    [updateDynamicElements]
  );

  const enablePanZoom = useCallback(
    (app) => {
      const world = worldContainerRef.current;
      if (!world) return;

      // Use canvas in v8; add passive:false to allow preventDefault
      const canvasEl = app.canvas;

      const wheelHandler = (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        const factor = 1.15;
        const next = scaleRef.current * (direction > 0 ? 1 / factor : factor);
        // offsetX/Y are relative to the target element
        zoomTo(next, { x: e.offsetX, y: e.offsetY });
      };

      const mousedownHandler = (e) => {
        dragStateRef.current.dragging = true;
        dragStateRef.current.start = { x: e.clientX, y: e.clientY };
        dragStateRef.current.origin = { x: world.x, y: world.y };
      };
      const mouseupHandler = () => (dragStateRef.current.dragging = false);
      const mouseleaveHandler = () => (dragStateRef.current.dragging = false);
      const mousemoveHandler = (e) => {
        if (!dragStateRef.current.dragging) return;
        const dx = e.clientX - dragStateRef.current.start.x;
        const dy = e.clientY - dragStateRef.current.start.y;
        world.x = dragStateRef.current.origin.x + dx;
        world.y = dragStateRef.current.origin.y + dy;
      };

      canvasEl.addEventListener('wheel', wheelHandler, { passive: false });
      canvasEl.addEventListener('mousedown', mousedownHandler);
      canvasEl.addEventListener('mouseup', mouseupHandler);
      canvasEl.addEventListener('mouseleave', mouseleaveHandler);
      canvasEl.addEventListener('mousemove', mousemoveHandler);

      // cleanup when re-rendering the scene
      return () => {
        canvasEl.removeEventListener('wheel', wheelHandler);
        canvasEl.removeEventListener('mousedown', mousedownHandler);
        canvasEl.removeEventListener('mouseup', mouseupHandler);
        canvasEl.removeEventListener('mouseleave', mouseleaveHandler);
        canvasEl.removeEventListener('mousemove', mousemoveHandler);
      };
    },
    [zoomTo]
  );

  return (
    <Box ref={containerRef} sx={{ width: '100%', height: '100vh', overflow: 'hidden' }}>
      <Box ref={canvasRef} sx={{ width: '100%', height: 'calc(100% - 120px)' }} />
      <Box
        sx={{ px: 2, py: 1, height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <Button variant="outlined" onClick={() => zoomTo(scaleRef.current * 1.25)}>
            <AddIcon />
          </Button>
          <Button variant="outlined" onClick={() => zoomTo(scaleRef.current * 0.8)}>
            <RemoveIcon />
          </Button>
          <Button variant="outlined" onClick={() => zoomTo(1)}>
            <CenterFocusStrongIcon />
          </Button>
        </Stack>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2">Speed</Typography>
          <Slider
            min={200}
            max={2000}
            step={100}
            value={animationSpeed}
            onChange={(e, val) => setAnimationSpeed(Array.isArray(val) ? val[0] : val)}
            sx={{ width: 120 }}
          />
          <Button variant="outlined" onClick={isPlaying ? pauseAnimation : startAnimation}>
            {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          </Button>
          <Button variant="outlined" onClick={resetAnimation}>
            <RestartAltIcon />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default PixiD3;
