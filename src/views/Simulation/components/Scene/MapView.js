// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/styles';
import * as d3 from 'd3';
import throttle from 'lodash.throttle';
import * as PIXI from 'pixi.js';
import { useSimulationViewContext } from '../../SimulationViewContext';
import { createApp, initMapApp, destroyApp, generateMap } from '../../utils/pixiUtils';
import { updateClusters } from '../PixiComponents/components/pixiNode';
import { IncidentChip } from './components/IncidentChip';

const MapView = ({ graph }) => {
  const theme = useTheme();
  const mapCanvasRef = useRef(null);
  const mapAppRef = useRef(null);
  const mapContainerRef = useRef(null);
  const layersRef = useRef({ links: null, nodes: null });
  const hoveredIncident = {
    visible: false,
    position: { x: 0, y: 0 },
    data: { bottlenecks: 0, shortages: 0 },
  };
  const { setSelectedMapFilters } = useSimulationViewContext();

  // --- INIT MAP ---
  useEffect(() => {
    const app = (mapAppRef.current = createApp());

    (async () => {
      await initMapApp(mapAppRef, mapCanvasRef, mapContainerRef, theme);
      generateMap(mapContainerRef, mapCanvasRef);

      if (!app?.stage) return;
      app.stage.sortableChildren = true;

      const linksLayer = new PIXI.Container();
      linksLayer.name = 'linksLayer';
      linksLayer.zIndex = 10;

      const nodesLayer = new PIXI.Container();
      nodesLayer.name = 'nodesLayer';
      nodesLayer.zIndex = 11;

      const mapContainer = mapContainerRef.current;
      if (mapContainer && mapContainer.addChild) {
        mapContainer.addChild(linksLayer);
        mapContainer.addChild(nodesLayer);
      } else {
        app.stage.addChild(linksLayer);
        app.stage.addChild(nodesLayer);
      }

      layersRef.current = { links: linksLayer, nodes: nodesLayer };
    })();

    setSelectedMapFilters([]);

    return () => {
      if (mapAppRef.current) destroyApp(mapAppRef.current);
    };
  }, [theme, setSelectedMapFilters]);

  const projection = useMemo(() => {
    const r = mapAppRef.current?.renderer;
    if (!r) return null;
    return d3
      .geoMercator()
      .scale(120)
      .translate([r.width / 2, r.height / 1.75]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapAppRef.current?.renderer?.width, mapAppRef.current?.renderer?.height]);

  const prepared = useMemo(() => {
    if (!graph || !projection) return null;

    const nodes = (graph.nodes ?? []).map((n) => {
      const lat = Number(n?.data?.latitude ?? n?.data?.lat);
      const lon = Number(n?.data?.longitude ?? n?.data?.lon ?? n?.data?.lng);
      if (Number.isFinite(lat) && Number.isFinite(lon)) {
        const [x, y] = projection([lon, lat]);
        return { ...n, x, y };
      }
      return { ...n, x: undefined, y: undefined };
    });

    const nodeById = new Map(nodes.map((n) => [String(n.id), n]));
    const links = (graph.links ?? []).map((l) => {
      const srcId = typeof l.source === 'object' ? (l.source?.id ?? l.source) : l.source;
      const tgtId = typeof l.target === 'object' ? (l.target?.id ?? l.target) : l.target;
      const __s = nodeById.get(String(srcId));
      const __t = nodeById.get(String(tgtId));
      return { ...l, __s, __t };
    });

    const nodesWithXY = nodes.filter((n) => Number.isFinite(n.x) && Number.isFinite(n.y));
    const linksReady = links.filter(
      (l) =>
        l.__s &&
        l.__t &&
        Number.isFinite(l.__s.x) &&
        Number.isFinite(l.__s.y) &&
        Number.isFinite(l.__t.x) &&
        Number.isFinite(l.__t.y)
    );

    return { nodes, nodesWithXY, links, linksReady };
  }, [graph, projection]);

  useEffect(() => {
    if (!prepared) return;
    const app = mapAppRef.current;
    if (!app) return;

    const runClusters = () =>
      updateClusters({
        app,
        mapContainer: mapContainerRef.current,
        prepared,
        layersRef,
      });

    runClusters();

    const throttled = throttle(() => runClusters(), 80, {
      leading: true,
      trailing: true,
    });
    app.ticker?.add(throttled);

    const mapContainer = mapContainerRef.current;
    const handleWheel = () => throttled();
    mapContainer?.on('wheel', handleWheel);

    return () => {
      app.ticker?.remove(throttled);
      mapContainer?.off('wheel', handleWheel);
    };
  }, [prepared]);

  return (
    <>
      <div
        data-cy="map-view"
        ref={mapCanvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      />
      <IncidentChip position={hoveredIncident.position} data={hoveredIncident.data} visible={hoveredIncident.visible} />
    </>
  );
};

MapView.propTypes = {
  graph: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        data: PropTypes.object,
        type: PropTypes.string,
      })
    ),
    links: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any,
        source: PropTypes.any.isRequired,
        target: PropTypes.any.isRequired,
      })
    ),
  }),
};

export default MapView;
