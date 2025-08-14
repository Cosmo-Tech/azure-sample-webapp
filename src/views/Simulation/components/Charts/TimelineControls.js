import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { makeStyles } from '@mui/styles';
import TimelineChart from './TimelineChart';

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

const TimelineControls = ({ chartData, markers, startDate, endDate, currentTimestep, setCurrentTimestep }) => {
  const classes = useStyles();
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const animationFrameId = useRef(null);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const isPlayingRef = useRef(false); // live flag

  const handlePlayPause = () => {
    if (isPlayingRef.current) {
      setIsPlaying(false);
      isPlayingRef.current = false;
      pausedAtRef.current = performance.now() - startTimeRef.current;
      cancelAnimationFrame(animationFrameId.current);
    } else {
      setIsPlaying(true);
      isPlayingRef.current = true;
      startTimeRef.current = performance.now() - (pausedAtRef.current || 0);
      pausedAtRef.current = 0;
      animationFrameId.current = requestAnimationFrame(animate); // start loop
    }
  };

  const stepDuration = 500; // ms per step at 1x speed

  const animate = (now) => {
    if (!isPlayingRef.current) return; // check live ref

    const totalSteps = chartData.length - 1;
    const elapsed = now - startTimeRef.current;
    const step = Math.min(Math.floor(elapsed / (stepDuration / playbackSpeed)), totalSteps);

    setCurrentTimestep(step);

    if (step < totalSteps) {
      animationFrameId.current = requestAnimationFrame(animate);
    } else {
      setIsPlaying(false);
      isPlayingRef.current = false;
      setCurrentTimestep(0);
      pausedAtRef.current = 0;
    }
  };

  useEffect(() => {
    return () => cancelAnimationFrame(animationFrameId.current);
  }, []);

  const handleSpeedChange = () => {
    const speeds = [0.5, 1, 2];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);

    if (isPlayingRef.current) {
      const elapsed = performance.now() - startTimeRef.current;
      startTimeRef.current = performance.now() - elapsed * (playbackSpeed / nextSpeed);
    }
  };

  const handleChartClick = (e) => {
    if (e?.activeLabel != null) {
      const newStep = e.activeLabel;
      setCurrentTimestep(newStep);

      if (isPlayingRef.current) {
        startTimeRef.current = performance.now() - newStep * (stepDuration / playbackSpeed);
      } else {
        pausedAtRef.current = newStep * (stepDuration / playbackSpeed);
      }
    }
  };

  if (!isVisible) {
    return (
      <button
        className={classes.playButton}
        onClick={() => {
          setIsVisible(true);
        }}
      >
        <PlayArrowRoundedIcon color="warning" />
        <span>Play</span>
      </button>
    );
  }

  return (
    <div className={classes.container}>
      <div
        className={classes.progressFill}
        style={{
          width: `${(Math.min(currentTimestep, chartData.length - 1) / (chartData.length - 1)) * 100}%`,
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
              d="M16.67 7.83H9.17M11.67 16.17H4.17M11.67 16.17a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 
              0ZM8.33 7.83a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
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
            setCurrentTimestep(0);
          }}
        >
          <CloseIcon color="warning" />
        </button>
      </div>
    </div>
  );
};

TimelineControls.propTypes = {
  chartData: PropTypes.arrayOf(PropTypes.number).isRequired,
  markers: PropTypes.arrayOf(PropTypes.number),
  currentTimestep: PropTypes.number.isRequired,
  setCurrentTimestep: PropTypes.func.isRequired,
  startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
  endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};

TimelineControls.defaultProps = {
  markers: [],
};

export default TimelineControls;
