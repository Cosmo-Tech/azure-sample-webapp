import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { ResponsiveContainer, LineChart, Line, XAxis, ReferenceDot } from 'recharts';

const TICK_COUNT = 12;

const TimelineChart = React.memo(function TimelineChart({
  chartData,
  markers,
  onChartClick,
  startDate,
  endDate,
  currentTimestep,
}) {
  const { formattedData, stepMs, ticks } = useMemo(() => {
    const newData = chartData == null ? [] : chartData.map((value, index) => ({ index, value }));
    const totalSteps = newData.length;

    let newTicks = [];
    if (totalSteps > 1)
      newTicks = Array.from({ length: TICK_COUNT }, (_, i) => Math.floor((i * (totalSteps - 1)) / (TICK_COUNT - 1)));

    let newStepMs = null;
    if (startDate != null && endDate != null && totalSteps > 1) {
      const start = dayjs(startDate);
      const end = dayjs(endDate);
      newStepMs = (end.valueOf() - start.valueOf()) / (totalSteps - 1);
    }

    return { formattedData: newData, stepMs: newStepMs, ticks: newTicks };
  }, [chartData, startDate, endDate]);

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
      <LineChart data={formattedData} onClick={onChartClick} margin={{ left: 20, right: 20 }}>
        <Line type="monotone" dataKey="value" stroke="#767781" strokeWidth={1} dot={false} isAnimationActive />

        <Line
          type="monotone"
          dataKey={(point) => (point.index <= currentTimestep ? point.value : null)}
          stroke="#FFB039"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />

        {markers.map((timestep, index) => {
          const point = formattedData[timestep];
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
  chartData: PropTypes.arrayOf(PropTypes.number),
  markers: PropTypes.arrayOf(PropTypes.number),
  currentTimestep: PropTypes.number,
  onChartClick: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

TimelineChart.defaultProps = {
  markers: [],
};

export default TimelineChart;
