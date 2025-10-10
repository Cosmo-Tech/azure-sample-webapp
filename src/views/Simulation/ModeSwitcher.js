// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import PropTypes from 'prop-types';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles';
import { useSimulationViewContext } from './SimulationViewContext';
import { SIMULATION_MODES } from './constants/settings';
import { simulationTheme } from './theme';

const ModeSwitcher = ({ mode, onChange }) => {
  const theme = useTheme();
  const paletteMode = theme.palette.mode;
  const palette = simulationTheme[paletteMode];
  const useStyles = makeStyles({
    container: {
      position: 'absolute',
      bottom: 16,
      left: 0,
      right: 0,
      margin: '0 auto',
      width: 'fit-content',
      backgroundColor: palette.button.background,
      borderRadius: 8,
      display: 'flex',
      gap: 8,
    },
    toggleButton: {
      color: palette.button.color,
      border: 'none',
      borderRadius: 8,
      textTransform: 'none',
      fontSize: 16,
      padding: '10px 34px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      '&.Mui-selected': {
        backgroundColor: palette.button.hoverBackground,
        color: palette.button.color,
      },
      '&:hover': {
        backgroundColor: palette.button.hoverBackground,
        color: palette.button.color,
      },
    },
  });
  const classes = useStyles();
  const { currentTimestep } = useSimulationViewContext();

  const handleChange = (_, newMode) => {
    if (newMode !== null) {
      onChange(newMode);
    }
  };

  if (currentTimestep !== null) {
    return null;
  }

  const getIconColor = (currentMode, buttonMode) =>
    currentMode === buttonMode
      ? simulationTheme[paletteMode].button.icon.default
      : simulationTheme[paletteMode].button.icon.selected;

  return (
    <ToggleButtonGroup
      value={mode}
      exclusive
      onChange={handleChange}
      aria-label="view mode switcher"
      className={classes.container}
    >
      <ToggleButton value="graph" className={classes.toggleButton}>
        <AccountTreeOutlinedIcon fontSize="small" htmlColor={getIconColor(mode, SIMULATION_MODES.GRAPH)} />
        Chart
      </ToggleButton>

      <ToggleButton value="map" className={classes.toggleButton}>
        <MapOutlinedIcon fontSize="small" htmlColor={getIconColor(mode, SIMULATION_MODES.MAP)} />
        Map
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

ModeSwitcher.propTypes = {
  mode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ModeSwitcher;
