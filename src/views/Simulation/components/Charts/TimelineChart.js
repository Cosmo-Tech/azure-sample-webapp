import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { ResponsiveContainer, LineChart, Line, XAxis, ReferenceDot } from 'recharts';

const TimelineChart = React.memo(function TimelineChart({
  chartData,
  markers,
  onChartClick,
  startDate,
  endDate,
  currentTimestep,
}) {
  const data = useMemo(() => chartData.map(({ timestep, value }) => ({ index: timestep, value })), [chartData]);

  const ticks = useMemo(() => {
    const totalSteps = chartData.length;
    if (totalSteps === 0) return [];
    const tickCount = 12;
    return Array.from({ length: tickCount }, (_, i) => Math.floor((i * (totalSteps - 1)) / (tickCount - 1)));
  }, [chartData]);

  const stepMs = useMemo(() => {
    if (!startDate || !endDate || chartData.length < 2) return null;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    return (end.valueOf() - start.valueOf()) / (chartData.length - 1);
  }, [startDate, endDate, chartData]);

  const formatDateTick = useCallback(
    (index) => {
      if (!stepMs || !startDate) return '';
      return dayjs(startDate)
        .add(stepMs * index, 'ms')
        .format('MMM');
    },
    [stepMs, startDate]
  );

  const renderMarkerShape = useCallback(
    ({ cx }) => <polygon points={`${cx - 5},0 ${cx + 5},0 ${cx},7`} fill="#FF5557" />,
    []
  );

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

        {markers.map((index) => {
          const point = data[index];
          return point ? (
            <ReferenceDot key={`marker-${index}`} x={point.index} y={point.value} isFront shape={renderMarkerShape} />
          ) : null;
        })}

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
});

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
