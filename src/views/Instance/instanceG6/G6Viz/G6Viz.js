/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';

import G6 from '@antv/g6';

G6.registerNode(
  'Stock',
  {
    options: {
      direction: 'down',
      style: {
        fill: '#BF4040',
      },
      stateStyles: {
        selected: {
          fill: '#FF0000',
        },
      },
      labelCfg: {
        position: 'top',
        offset: 20,
      },
    },
  },
  'triangle'
);

G6.registerNode(
  'ProductionOperation',
  {
    options: {
      style: {
        fill: '#249027',
      },
      stateStyles: {
        selected: {
          fill: '#00CC00',
        },
      },
      labelCfg: {
        position: 'top',
        offset: 20,
      },
    },
  },
  'circle'
);

const G6Viz = ({ graphData }) => {
  const ref = useRef(null);
  const startTime = useRef(Date.now());
  const [graph, setGraph] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (graphData) {
      setGraph(
        new G6.Graph({
          container: ref.current,
          width: ref.current.scrollWidth,
          height: ref.current.scrollHeight,
          ...graphData.graphProps,
        })
      );
    }
  }, [graphData]);

  useEffect(() => {
    if (graph) {
      graph.on('node:mouseenter', (evt) => {
        graph.setItemState(evt.item, 'hover', true);
      });

      graph.on('node:mouseleave', (evt) => {
        graph.setItemState(evt.item, 'hover', false);
      });

      graph.on('edge:mouseenter', (evt) => {
        graph.setItemState(evt.item, 'hover', true);
      });

      graph.on('edge:mouseleave', (evt) => {
        graph.setItemState(evt.item, 'hover', false);
      });

      graph.on('afterlayout', () => {
        console.log(Date.now() - startTime.current);
      });

      graph.on('nodeselectchange', (e) => {
        setSelectedNode(e.select ? e.target?._cfg.model.properties : null);
      });
    }
  }, [graph]);

  useEffect(() => {
    if (graph && graphData) {
      graph.data(graphData.graphElements);
      graph.render();
    }
  }, [graph, graphData]);

  const detail = selectedNode ? JSON.stringify(selectedNode, null, 2) : '';

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ height: '100%', width: '200px' }}>{detail}</div>
      <div style={{ height: '100%', flex: 1 }} ref={ref}></div>
    </div>
  );
};

export default G6Viz;
