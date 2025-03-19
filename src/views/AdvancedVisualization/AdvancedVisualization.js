// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { Slider, Button, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/styles';
import * as d3 from 'd3';
import stocksData from './data/stocks.json';
import transportsData from './data/transports.json';
import worldGeoJSON from './data/worldMap.geo.json';

const AdvancedVisualization = () => {
  const theme = useTheme();
  const svgRef = useRef(null);
  const tooltipRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Timeline state
  const [timePoints, setTimePoints] = useState([]);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms between frames
  const animationRef = useRef(null);

  // Generate mock timeseries data
  const { timeseriesStocks, timeseriesTransports } = React.useMemo(() => {
    // Create 10 time points (e.g., days)
    const numTimePoints = 50;
    const generatedTimePoints = Array.from({ length: numTimePoints }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (numTimePoints - 1) + i);
      return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    });
    setTimePoints(generatedTimePoints);

    const stocksTimeseries = {};
    stocksData.forEach((stock) => {
      // Start with the initial stock value
      const initialValue = parseInt(stock.initialStock) || 100;

      stocksTimeseries[stock.id] = generatedTimePoints.map((_, index) => {
        const trendFactor = index / (numTimePoints - 1);
        const randomFactor = Math.random() * 0.2 + 0.95;
        let value = initialValue * (1.1 - trendFactor * 0.2) * randomFactor;
        if (Math.random() < 0.2) value *= Math.random() < 0.5 ? 0.7 : 1.3; // Random spikes or drops
        return Math.round(value);
      });
    });

    const transportsTimeseries = {};

    transportsData.forEach((transport) => {
      // Generate random activity levels for each time point
      transportsTimeseries[transport.id] = generatedTimePoints.map((_, index) => {
        // Create random activity levels
        // Some transports might be inactive at certain time points
        const isActive = Math.random() < 0.8; // 80% chance of being active

        // For active transports, generate a random flow amount
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

  // Process the stock data for the current time point
  const processedData = React.useMemo(() => {
    return stocksData.map((item) => {
      // Get the stock value for the current time point
      const currentStock = timeseriesStocks[item.id]
        ? timeseriesStocks[item.id][currentTimeIndex]
        : parseInt(item.initialStock) || 0;

      return {
        ...item,
        initialStock: parseInt(item.initialStock) || 0,
        currentStock,
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
      };
    });
  }, [timeseriesStocks, currentTimeIndex]);

  // Create a lookup map for stocks by ID
  const stocksById = React.useMemo(() => {
    const map = new Map();
    processedData.forEach((stock) => {
      map.set(stock.id, stock);
    });
    return map;
  }, [processedData]);

  // Process the transport data using stock IDs to get coordinates
  const processedTransports = React.useMemo(() => {
    return transportsData
      .map((item) => {
        const sourceStock = stocksById.get(item.source);
        const targetStock = stocksById.get(item.target);

        // Skip if source or target stock not found
        if (!sourceStock || !targetStock) {
          console.warn(`Transport with missing stock: source=${item.source}, target=${item.target}`);
          return null;
        }

        // Get the transport activity for the current time point
        const currentActivity = timeseriesTransports[item.id]
          ? timeseriesTransports[item.id][currentTimeIndex]
          : { isActive: true, flowAmount: 50 };

        return {
          ...item,
          duration: parseInt(item.duration) || 0,
          source: sourceStock.label,
          target: targetStock.label,
          sourceLatitude: sourceStock.latitude,
          sourceLongitude: sourceStock.longitude,
          targetLatitude: targetStock.latitude,
          targetLongitude: targetStock.longitude,
          isActive: currentActivity.isActive,
          flowAmount: currentActivity.flowAmount,
        };
      })
      .filter((item) => item !== null && item.isActive); // Remove inactive transports and those with missing stocks
  }, [stocksById, timeseriesTransports, currentTimeIndex]);

  // Get unique steps for color scale
  const steps = React.useMemo(() => {
    return [...new Set(processedData.map((d) => d.step))];
  }, [processedData]);

  // Create color scale based on steps
  const colorScale = React.useMemo(() => {
    return d3.scaleOrdinal().domain(steps).range(d3.schemeCategory10);
  }, [steps]);

  // Create size scale based on currentStock
  const sizeScale = React.useMemo(() => {
    const maxStock = d3.max(processedData, (d) => d.currentStock) || 500;
    return d3.scaleLinear().domain([0, maxStock]).range([3, 15]);
  }, [processedData]);

  // Animation control functions
  const startAnimation = useCallback(() => {
    if (animationRef.current) return;

    setIsPlaying(true);

    animationRef.current = setInterval(() => {
      setCurrentTimeIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Loop back to the beginning if we reach the end
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

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, []);

  // Update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width } = svgRef.current.parentElement.getBoundingClientRect();
        setDimensions({
          width,
          height: window.innerHeight * 0.7, // Reduced to make room for timeline
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create and update visualization
  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0 || processedData.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll('*').remove();

    // Create SVG
    const svg = d3.select(svgRef.current).attr('width', dimensions.width).attr('height', dimensions.height);

    // Create tooltip
    const tooltip = d3
      .select(tooltipRef.current)
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background-color', theme.palette.background.default)
      .style('border', '1px solid #ddd')
      .style('border-radius', '4px')
      .style('padding', '10px')
      .style('box-shadow', '0 0 10px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('font-size', '12px');

    // Create a container for zoom behavior
    const container = svg.append('g');

    // Create projection
    const projection = d3
      .geoMercator()
      .scale((dimensions.width - 20) / (2 * Math.PI))
      .translate([dimensions.width / 2, dimensions.height / 1.5]);

    // Create a reference to store the current zoom transform
    let currentTransform = d3.zoomIdentity;

    // Create zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([1, 8])
      .on('zoom', (event) => {
        currentTransform = event.transform;
        container.attr('transform', currentTransform);

        // Update circle sizes to maintain constant visual size during zoom
        container.selectAll('.stock').attr('r', (d) => sizeScale(d.currentStock) / currentTransform.k);

        // Update transport line widths and dash patterns to maintain constant visual size during zoom
        container
          .selectAll('.transport')
          .attr('stroke-width', (d) => transportWidthScale(d.flowAmount) / currentTransform.k)
          .each(function (d) {
            const style = transportModeStyles[d.mode] || defaultTransportStyle;
            // Only adjust dash pattern if it's not a solid line
            if (style.strokeDasharray !== '0') {
              // Scale the dash pattern based on zoom level
              const originalDashArray = style.strokeDasharray.split(',').map(Number);
              const scaledDashArray = originalDashArray.map((val) => val / currentTransform.k).join(',');
              d3.select(this).attr('stroke-dasharray', scaledDashArray);
            }
          });
      });

    svg.call(zoom);

    // Create path generator
    const path = d3.geoPath().projection(projection);

    // Draw world map from GeoJSON
    container
      .append('g')
      .selectAll('path')
      .data(worldGeoJSON.features)
      .enter()
      .append('path')
      .attr('class', 'country')
      .attr('d', path)
      .attr('fill', '#f0f0f0')
      .attr('stroke', '#ccc')
      .attr('stroke-width', 0.5);

    // Create a scale for transport line width based on flow amount
    const transportWidthScale = d3
      .scaleLinear()
      .domain([0, d3.max(processedTransports, (d) => d.flowAmount) || 100])
      .range([1, 5]);

    // Define transport mode styles
    const transportModeStyles = {
      Road: {
        stroke: '#FF8C00', // Orange
        strokeDasharray: '0',
        strokeLinecap: 'round',
      },
      Sea: {
        stroke: '#1E90FF', // Blue
        strokeDasharray: '5,3',
        strokeLinecap: 'round',
      },
      Rail: {
        stroke: '#9932CC', // Purple
        strokeDasharray: '10,10',
        strokeLinecap: 'butt',
      },
      Mixte: {
        stroke: '#2E8B57', // Sea Green
        strokeDasharray: '15,3,3,3',
        strokeLinecap: 'round',
      },
      Air: {
        stroke: '#DC143C', // Crimson
        strokeDasharray: '2,2',
        strokeLinecap: 'round',
      },
    };

    // Default style for unknown modes
    const defaultTransportStyle = {
      stroke: '#3366CC',
      strokeDasharray: '0',
      strokeLinecap: 'round',
    };

    // Create a line generator for curved paths
    const lineGenerator = d3.line().curve(d3.curveBasis);

    // Draw transport edges as curved paths
    container
      .selectAll('.transport')
      .data(processedTransports)
      .enter()
      .append('path')
      .attr('class', 'transport')
      .attr('d', (d) => {
        const sourcePoint = projection([d.sourceLongitude, d.sourceLatitude]);
        const targetPoint = projection([d.targetLongitude, d.targetLatitude]);
        const dx = targetPoint[0] - sourcePoint[0];
        const dy = targetPoint[1] - sourcePoint[1];
        const midX = (sourcePoint[0] + targetPoint[0]) / 2;
        const midY = (sourcePoint[1] + targetPoint[1]) / 2;
        const curveFactor = 0.1;
        const controlX = midX - dy * curveFactor;
        const controlY = midY + dx * curveFactor;

        const pathPoints = [sourcePoint, [controlX, controlY], targetPoint];
        return lineGenerator(pathPoints);
      })
      .attr('fill', 'none')
      .attr('stroke', (d) => (transportModeStyles[d.mode] || defaultTransportStyle).stroke)
      .attr('stroke-width', (d) => transportWidthScale(d.flowAmount))
      .attr('stroke-dasharray', (d) => (transportModeStyles[d.mode] || defaultTransportStyle).strokeDasharray)
      .attr('stroke-linecap', (d) => (transportModeStyles[d.mode] || defaultTransportStyle).strokeLinecap)
      .attr('stroke-opacity', 0.6)
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').html(`
            <strong>Transport</strong><br/>
            From: ${d.source || 'Unknown'}<br/>
            To: ${d.target || 'Unknown'}<br/>
            Duration: ${d.duration}<br/>
            Mode: ${d.mode}<br/>
            Flow Amount: ${d.flowAmount}
          `);

        d3.select(event.currentTarget)
          .attr('stroke-opacity', 1)
          .attr('stroke-width', (d) => (transportWidthScale(d.flowAmount) + 1) / currentTransform.k);
      })
      .on('mousemove', (event) => {
        tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', (event, d) => {
        tooltip.style('visibility', 'hidden');

        const element = d3.select(event.currentTarget);
        element
          .attr('stroke-opacity', 0.6)
          .attr('stroke-width', (d) => transportWidthScale(d.flowAmount) / currentTransform.k);

        // Restore the dash pattern based on the mode and zoom level
        const style = transportModeStyles[d.mode] || defaultTransportStyle;
        if (style.strokeDasharray !== '0') {
          const originalDashArray = style.strokeDasharray.split(',').map(Number);
          const scaledDashArray = originalDashArray.map((val) => val / currentTransform.k).join(',');
          element.attr('stroke-dasharray', scaledDashArray);
        }
      });

    // Draw stock points
    container
      .selectAll('.stock')
      .data(processedData)
      .enter()
      .append('circle')
      .attr('class', 'stock')
      .attr('cx', (d) => projection([d.longitude, d.latitude])[0])
      .attr('cy', (d) => projection([d.longitude, d.latitude])[1])
      .attr('r', (d) => sizeScale(d.currentStock)) // Size based on current stock
      .attr('fill', (d) => colorScale(d.step))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .attr('opacity', 0.7)
      .on('mouseover', (event, d) => {
        tooltip.style('visibility', 'visible').html(`
            <strong>${d.label}</strong><br/>
            Type: ${d.step}<br/>
            Initial Stock: ${d.initialStock}<br/>
            Current Stock: ${d.currentStock}<br/>
            Location: ${d.latitude.toFixed(2)}, ${d.longitude.toFixed(2)}
          `);

        d3.select(event.currentTarget).attr('stroke-width', 2).attr('opacity', 1);
      })
      .on('mousemove', (event) => {
        tooltip.style('top', event.pageY - 10 + 'px').style('left', event.pageX + 10 + 'px');
      })
      .on('mouseout', (event) => {
        tooltip.style('visibility', 'hidden');

        d3.select(event.currentTarget).attr('stroke-width', 0.5).attr('opacity', 0.7);
      });

    // Create legend
    const totalLegendHeight = (steps.length + Object.keys(transportModeStyles).length + 1) * 20 + 50;

    svg
      .append('rect') // Legend background
      .attr('transform', `translate(8, 5)`)
      .attr('width', 190)
      .attr('height', totalLegendHeight)
      .attr('fill', '#FFFFFF')
      .style('opacity', 0.75);

    const legend = svg.append('g').attr('transform', `translate(20, 20)`);
    legend
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .text('Stock Types')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    steps.forEach((step, i) => {
      const legendRow = legend.append('g').attr('transform', `translate(0, ${i * 20 + 15})`);
      legendRow.append('rect').attr('width', 15).attr('height', 15).attr('fill', colorScale(step));
      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(step)
        .style('font-size', '12px')
        .style('fill', '#000000');
    });

    // Transport modes legend
    const transportLegend = legend.append('g').attr('transform', `translate(0, ${steps.length * 20 + 35})`);

    transportLegend
      .append('text')
      .attr('x', 0)
      .attr('y', 5)
      .text('Transport Modes')
      .style('font-size', '14px')
      .style('font-weight', 'bold')
      .style('fill', '#000000');

    Object.entries(transportModeStyles).forEach(([mode, style], i) => {
      const legendRow = transportLegend.append('g').attr('transform', `translate(0, ${i * 20 + 15})`);

      // Create a line to represent the transport style
      legendRow
        .append('line')
        .attr('x1', 0)
        .attr('y1', 7)
        .attr('x2', 15)
        .attr('y2', 7)
        .attr('stroke', style.stroke)
        .attr('stroke-width', 3)
        .attr('stroke-dasharray', style.strokeDasharray)
        .attr('stroke-linecap', style.strokeLinecap);

      legendRow
        .append('text')
        .attr('x', 20)
        .attr('y', 12)
        .text(mode)
        .style('font-size', '12px')
        .style('fill', '#000000');
    });

    svg
      .append('rect') // Time indicator background
      .attr('x', dimensions.width - 155)
      .attr('y', 4)
      .attr('width', 150)
      .attr('height', 40)
      .attr('fill', '#FFFFFF')
      .style('opacity', 0.75);
    svg
      .append('text')
      .attr('class', 'time-indicator')
      .attr('x', dimensions.width - 150)
      .attr('y', 30)
      .attr('text-anchor', 'start')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .style('fill', '#000')
      .text(`Date: ${timePoints[currentTimeIndex]}`);
  }, [
    dimensions,
    processedData,
    processedTransports,
    colorScale,
    sizeScale,
    theme,
    steps,
    timePoints,
    currentTimeIndex,
  ]);

  return (
    <div data-cy="advanced-visualization-view" style={{ width: '100%', height: '100%' }}>
      <h2>Global Stock Distribution</h2>
      <div style={{ position: 'relative' }}>
        <svg ref={svgRef}></svg>
        <div ref={tooltipRef}></div>
      </div>

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
              marks={timePoints.map((date, index) => ({ value: index, label: index % 3 === 0 ? date : '' }))}
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

export default AdvancedVisualization;
