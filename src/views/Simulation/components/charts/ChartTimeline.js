import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import dayjs from 'dayjs';
import { LineChart, Line, XAxis, ResponsiveContainer, ReferenceDot, ReferenceArea } from 'recharts';

const useStyles = makeStyles({
  container: {
    backgroundColor: '#1C1C20',
    width: '100%',
    height: 64,
  },
});

const ChartTimeline = ({ chartData, markers, currentTimestep, setCurrentTimestep, startDate, endDate }) => {
  const classes = useStyles();

  const data = chartData.map((value, index) => ({
    index,
    value,
  }));

  const totalSteps = chartData.length;
  const numberOfTicks = 12;

  const ticks = Array.from({ length: numberOfTicks }, (_, i) =>
    Math.floor((i * (totalSteps - 1)) / (numberOfTicks - 1))
  );

  const formatDateTick = (index) => {
    if (!startDate || !endDate || !chartData.length) return '';

    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const totalSteps = chartData.length;

    if (index < 0 || index >= totalSteps) return '';

    const totalDurationMs = end.valueOf() - start.valueOf();
    const msPerStep = totalDurationMs / (totalSteps - 1);
    const dateForTick = start.add(msPerStep * index, 'millisecond');
    return dateForTick.isValid() ? dateForTick.format('MMM') : '';
  };

  const handleClick = (e) => {
    if (e?.activeLabel != null) {
      setCurrentTimestep(e.activeLabel);
    }
  };

  return (
    <div className={classes.container}>
      <ResponsiveContainer>
        <LineChart data={data} onClick={handleClick} margin={{ left: 20, right: 20 }}>
          <Line type="monotone" dataKey="value" stroke="#767781" strokeWidth={1} dot={false} isAnimationActive={true} />
          <ReferenceArea x1={0} x2={currentTimestep} y1="auto" y2="auto" fill="#252529" />
          {markers.map((markerIndex) => {
            const markerData = data[markerIndex];
            if (!markerData) return null;
            return (
              <ReferenceDot
                key={`marker-${markerIndex}`}
                x={markerData.index}
                y={markerData.value}
                isFront={true}
                shape={({ cx }) => <polygon points={`${cx - 5},0 ${cx + 5},0 ${cx},7`} fill="#FF5557" />}
              />
            );
          })}
          <XAxis
            dataKey="index"
            type="number"
            ticks={ticks}
            tickFormatter={formatDateTick}
            interval={0}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#5F5F6A', fontSize: 11 }}
            height={20}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

ChartTimeline.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.number).isRequired,
  markers: PropTypes.arrayOf(PropTypes.number),
  currentTimestep: PropTypes.number.isRequired,
  setCurrentTimestep: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
};

ChartTimeline.defaultProps = {
  markers: [],
};

export default ChartTimeline;
