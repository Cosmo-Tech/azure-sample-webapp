/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from 'react';
import G6 from '@antv/g6';

G6.registerNode(
  'Stock',
  {
    options: {
      direction: 'down',
      style: {
        fill: '#ff0000',
      },
    },
  },
  'triangle'
);

const G6Viz = ({ graphData }) => {
  const ref = useRef(null);
  const startTime = useRef(Date.now());
  const [graph, setGraph] = useState(null);

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
    }
  }, [graph]);

  useEffect(() => {
    if (graph && graphData) {
      graph.data(graphData.graphElements);
      graph.render();
    }
  }, [graph, graphData]);

  return <div style={{ height: '100%' }} ref={ref}></div>;
};

export default G6Viz;
