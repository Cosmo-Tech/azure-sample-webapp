import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { ResponsiveContainer, LineChart, Line, XAxis, ReferenceDot } from 'recharts';

const TimelineChart = ({ chartData, markers, onChartClick, startDate, endDate, currentTimestep }) => {
  const data = chartData.map(({ timestep, value }) => ({
    index: timestep,
    value,
  }));

  const totalSteps = chartData.length;
  const tickCount = 12;
  const ticks = Array.from({ length: tickCount }, (_, i) => Math.floor((i * (totalSteps - 1)) / (tickCount - 1)));

  const formatDateTick = (index) => {
    if (!startDate || !endDate || !chartData.length) return '';
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const stepMs = (end.valueOf() - start.valueOf()) / (chartData.length - 1);
    return start.add(stepMs * index, 'ms').format('MMM');
  };

  return (
    <ResponsiveContainer>
      <LineChart data={data} onClick={onChartClick} margin={{ left: 20, right: 20 }}>
        <Line type="monotone" dataKey="value" stroke="#767781" strokeWidth={1} dot={false} isAnimationActive />

        <Line
          type="monotone"
          dataKey={(point) => (point.index <= currentTimestep ? point.value : null)}
          stroke="#FFB039"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />

        {/* Markers */}
        {markers.map((index) => {
          const point = data[index];
          return point ? (
            <ReferenceDot
              key={`marker-${index}`}
              x={point.index}
              y={point.value}
              isFront
              shape={({ cx }) => <polygon points={`${cx - 5},0 ${cx + 5},0 ${cx},7`} fill="#FF5557" />}
            />
          ) : null;
        })}

        {/* X Axis */}
        <XAxis
          dataKey="index"
          type="number"
          ticks={ticks}
          tickFormatter={formatDateTick}
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#5F5F6A', fontSize: 11 }}
          height={20}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

TimelineChart.propTypes = {
  chartData: PropTypes.arrayOf(
    PropTypes.shape({
      timestep: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
    })
  ).isRequired,
  markers: PropTypes.arrayOf(PropTypes.number),
  currentTimestep: PropTypes.number.isRequired,
  onChartClick: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

TimelineChart.defaultProps = {
  markers: [],
};

export default TimelineChart;
