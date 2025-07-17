// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// FIXME: compute left margin dynamically to adapt the number of characters of the axis values (e.g. "10,000" will be
// wider than just "10")
const MARGIN = { top: 4, right: 50, bottom: 24, left: 50 };
const BAR_OFFSET = 1; // Prevent bars from being superposed with the axis line
const MINIMUM_BAR_WIDTH = 1.8;

export const InspectorChart = ({ chartColor = '#40E0D0', data, width, height }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (data == null) return;
    const chartWidth = width - MARGIN.left - MARGIN.right;
    const chartHeight = height - MARGIN.top - MARGIN.bottom;

    const xScale = d3.scaleBand().domain(d3.range(data.length)).range([0, chartWidth]).padding(0.1);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data)])
      .range([chartHeight, 0]);

    const barWidth = xScale.bandwidth() < MINIMUM_BAR_WIDTH ? MINIMUM_BAR_WIDTH : xScale.bandwidth();
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => xScale(i))
      .attr('y', (d) => yScale(d))
      .attr('width', barWidth)
      .attr('height', (d) => chartHeight - yScale(d))
      .attr('fill', chartColor)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('transform', `translate(${MARGIN.left + BAR_OFFSET},${MARGIN.top})`);

    svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${chartHeight + MARGIN.top})`)
      .call(d3.axisBottom(xScale).tickValues(d3.range(0, data.length, 50)));
    svg
      .append('g')
      .attr('transform', `translate(${MARGIN.left},${MARGIN.top})`)
      .attr('class', 'y-axis')
      .call(d3.axisLeft(yScale).ticks(5));
  }, [chartColor, data, width, height]);

  return data != null ? <svg id="demand-chart-container" ref={svgRef} width={width} height={height} /> : null;
};

InspectorChart.propTypes = {
  chartColor: PropTypes.string,
  data: PropTypes.array,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};
