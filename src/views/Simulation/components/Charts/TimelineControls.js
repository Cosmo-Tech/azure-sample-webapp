import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { makeStyles } from '@mui/styles';
import { useSimulationViewContext } from '../../SimulationViewContext';
import TimelineChart from './TimelineChart';

const SPEEDS = [0.5, 1, 2];
const STEP_DURATION_IN_MS = 500;

const useStyles = makeStyles({
  container: {
    backgroundColor: '#1C1C20',
    width: '50%',
    height: 64,
    position: 'absolute',
    left: 25,
    bottom: 16,
    padding: 5,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    border: '1px solid #FFFFFF0A',
  },
  playButton: {
    position: 'absolute',
    left: 25,
    bottom: 16,
    width: 90,
    height: 48,
    padding: '16px',
    backgroundColor: '#1C1C20',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    border: '1px solid #FFFFFF0A',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    cursor: 'pointer',
  },
  controlButton: {
    backgroundColor: 'transparent',
    color: '#fff',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '0 16px',
    zIndex: 1,
    width: 100,
  },
  chartWrapper: {
    flex: 1,
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#252529',
    zIndex: 0,
    transition: 'width 0.1s linear',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  iconButton: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
});

const TimelineControls = ({ chartData, markers, startDate, endDate }) => {
  const classes = useStyles();
  const { currentTimestep, setCurrentTimestep } = useSimulationViewContext();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const animationFrameId = useRef(null);
  const isPlayingRef = useRef(false);
  const lastUpdateRef = useRef({ time: 0, step: 0 });
  const stepDurationRef = useRef(STEP_DURATION_IN_MS);

  const numberOfTimesteps = useMemo(() => {
    return chartData == null ? 0 : chartData?.length - 1;
  }, [chartData]);

  useEffect(() => {
    stepDurationRef.current = STEP_DURATION_IN_MS / playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    if (currentTimestep === null) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      cancelAnimationFrame(animationFrameId.current);

      lastUpdateRef.current = { time: 0, step: 0 };
    }
  }, [currentTimestep]);

  const animate = useCallback(
    (now) => {
      if (!chartData || !isPlayingRef.current) return;

      const elapsed = now - lastUpdateRef.current.time;
      const progress = elapsed / stepDurationRef.current;

      const step = Math.min(lastUpdateRef.current.step + progress, numberOfTimesteps);

      setCurrentTimestep(Math.floor(step));

      if (step < numberOfTimesteps) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        setIsPlaying(false);
        isPlayingRef.current = false;
        lastUpdateRef.current.step = numberOfTimesteps;
      }
    },
    [chartData, numberOfTimesteps, setCurrentTimestep]
  );

  const handlePlayPause = useCallback(() => {
    if (!chartData) return;

    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      cancelAnimationFrame(animationFrameId.current);
      lastUpdateRef.current.step = currentTimestep;
    } else {
      let startStep = currentTimestep;

      if (currentTimestep >= numberOfTimesteps) {
        startStep = 0;
        setCurrentTimestep(0);
      }

      setIsPlaying(true);
      isPlayingRef.current = true;
      lastUpdateRef.current.time = performance.now();
      lastUpdateRef.current.step = startStep;
      animationFrameId.current = requestAnimationFrame(animate);
    }
  }, [animate, currentTimestep, chartData, numberOfTimesteps, setCurrentTimestep]);

  const handleSpeedChange = useCallback(() => {
    const currentIndex = SPEEDS.indexOf(playbackSpeed);
    const nextPlaybackSpeed = SPEEDS[(currentIndex + 1) % SPEEDS.length];

    if (isPlayingRef.current) {
      const now = performance.now();
      const elapsed = now - lastUpdateRef.current.time;
      const progress = elapsed / stepDurationRef.current;

      const preciseStep = lastUpdateRef.current.step + progress;

      lastUpdateRef.current.step = preciseStep;
      lastUpdateRef.current.time = now;
    }

    setPlaybackSpeed(nextPlaybackSpeed);
  }, [playbackSpeed]);

  const handleChartClick = useCallback(
    (event) => {
      if (event?.activeLabel != null) {
        const newStep = event.activeLabel;
        setCurrentTimestep(newStep);
        if (isPlayingRef.current) {
          lastUpdateRef.current.step = newStep;
          lastUpdateRef.current.time = performance.now();
        }
      }
    },
    [setCurrentTimestep]
  );

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  if (!isVisible) {
    return (
      <button
        className={classes.playButton}
        onClick={() => {
          setIsVisible(true);
          setCurrentTimestep(0);
        }}
      >
        <PlayArrowRoundedIcon color="warning" />
        <span>Play</span>
      </button>
    );
  }

  if (chartData == null) return null;

  return (
    <div className={classes.container}>
      <div
        className={classes.progressFill}
        style={{
          width: `${(Math.min(currentTimestep, numberOfTimesteps) / numberOfTimesteps) * 100}%`,
        }}
      />
      <button className={classes.controlButton} onClick={handlePlayPause}>
        {isPlaying ? <PauseRoundedIcon color="warning" /> : <PlayArrowRoundedIcon color="warning" />}
        <span>{isPlaying ? 'Pause' : 'Play'}</span>
      </button>
      <div className={classes.chartWrapper}>
        <TimelineChart
          chartData={chartData}
          markers={markers}
          currentTimestep={currentTimestep}
          onChartClick={handleChartClick}
          startDate={startDate}
          endDate={endDate}
        />
      </div>
      <div className={classes.controlButton}>
        <button className={classes.iconButton} onClick={handleSpeedChange}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M16.67 7.83H9.17M11.67 16.17H4.17M11.67 16.17a2.5 2.5 0 1 0 5 0
              2.5 2.5 0 0 0-5 0ZM8.33 7.83a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
              stroke="#FFB039"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>x{playbackSpeed}</span>
        </button>

        <button
          className={classes.iconButton}
          onClick={() => {
            setIsVisible(false);
            setIsPlaying(false);
            isPlayingRef.current = false;
            cancelAnimationFrame(animationFrameId.current);
            setCurrentTimestep(null);
          }}
        >
          <CloseIcon color="warning" />
        </button>
      </div>
    </div>
  );
};

TimelineControls.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.number),
  markers: PropTypes.arrayOf(PropTypes.number),
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

TimelineControls.defaultProps = {
  markers: [],
};

export default TimelineControls;
