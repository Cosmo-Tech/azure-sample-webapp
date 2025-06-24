// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

const MARGIN = { top: 10, right: 5, bottom: 40, left: 5 };

export const InspectorChart = ({ chartColor = '#40E0D0', data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data == null) return;
    const chartWidth = width - MARGIN.left - MARGIN.right;
    const chartHeight = height - MARGIN.top - MARGIN.bottom;

    const xScale = d3.scaleBand().domain(d3.range(data.length)).range([0, chartWidth]).padding(0.1);
    const xAxisScale = d3
      .scaleBand()
      .domain(d3.range(0, data.length, 50))
      .range([0, chartWidth])
      .padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([chartHeight, 0]);

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', xScale.bandwidth())
      .attr('height', (d) => chartHeight - yScale(d))
      .attr('fill', chartColor)
      .attr('rx', 2)
      .attr('ry', 2);

    svg
      .append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xAxisScale))
      .selectAll('path,line')
      .remove();
  }, [chartColor, data, width, height]);

  return data != null ? <svg id="demand-chart-container" ref={svgRef} width={width} height={height} /> : null;
};

InspectorChart.propTypes = {
  chartColor: PropTypes.string,
  data: PropTypes.array,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
