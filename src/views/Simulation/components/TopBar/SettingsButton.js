// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SettingsOutlined as SettingsOutlinedIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Slider,
  Stack,
  Switch,
  Typography,
} from '@mui/material';
import { TooltipInfo } from '@cosmotech/ui';
import { useSimulationViewContext } from '../../SimulationViewContext';
import {
  GRAPH_LAYOUT_DIRECTION_VALUES,
  DEFAULT_SETTINGS,
  SETTINGS_SLIDER_MIN,
  SETTINGS_SLIDER_MAX,
} from '../../constants/settings';

export const SettingsButton = () => {
  const { requiredUpdateStepsRef, settings, setSettings } = useSimulationViewContext();
  // Use local value for spacing, so we can debounce the change events and trigger graph view updates less frequently
  const debounceTimerRef = useRef(null);
  const [localSpacingValue, setLocalSpacingValue] = useState(settings?.spacing);
  const changeSpacingWithDebounce = useCallback(
    (event, newValue) => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      setLocalSpacingValue(newValue);
      debounceTimerRef.current = setTimeout(() => {
        requiredUpdateStepsRef.current.layout = true;
        setSettings((previousSettings) => ({ ...previousSettings, spacing: newValue }));
      }, 200);
    },
    [requiredUpdateStepsRef, setSettings, setLocalSpacingValue]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = useMemo(() => anchorEl != null, [anchorEl]);

  const handleClick = (event) => {
    if (anchorEl != null) setAnchorEl(null);
    else setAnchorEl(event.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const menu = useMemo(() => {
    const forgeMenuTitle = (title) => (
      <Box sx={{ mx: 2 }}>
        <Typography fontWeight="fontWeightBold" sx={{ py: 1 }}>
          {title}
        </Typography>
      </Box>
    );

    const forgeMenuItem = (label, tooltip, component) => (
      <MenuItem sx={{ width: '100%', gap: '24px' }}>
        <Stack direction="row">
          <div style={{ minWidth: '90px' }}>{label}</div>
          <TooltipInfo title={tooltip} />
        </Stack>
        {component}
      </MenuItem>
    );

    const orientationRadioGroup = (
      <FormControl sx={{ flexGrow: 1, ml: 1 }}>
        <RadioGroup
          row
          defaultValue={GRAPH_LAYOUT_DIRECTION_VALUES.HORIZONTAL}
          name="orientation-buttons-group"
          value={settings?.orientation ?? GRAPH_LAYOUT_DIRECTION_VALUES.HORIZONTAL}
          onChange={(event) => {
            requiredUpdateStepsRef.current.layout = true;
            setSettings((previousSettings) => ({ ...previousSettings, orientation: event.target.value }));
          }}
          sx={{ justifyContent: 'space-between' }}
        >
          <FormControlLabel
            value={GRAPH_LAYOUT_DIRECTION_VALUES.HORIZONTAL}
            control={<Radio color="secondary" size="small" />}
            label="Horizontal"
            sx={{ mr: 0, p: 0 }}
          />
          <FormControlLabel
            value={GRAPH_LAYOUT_DIRECTION_VALUES.VERTICAL}
            control={<Radio color="secondary" size="small" />}
            label="Vertical"
            sx={{ mr: 0, p: 0 }}
          />
        </RadioGroup>
      </FormControl>
    );
    const spacingSlider = (
      <Slider
        color="secondary"
        size="small"
        defaultValue={DEFAULT_SETTINGS.spacing}
        min={SETTINGS_SLIDER_MIN}
        max={SETTINGS_SLIDER_MAX}
        aria-label="Spacing"
        sx={{ ml: 1 }}
        value={localSpacingValue ?? DEFAULT_SETTINGS.spacing}
        onChange={changeSpacingWithDebounce}
      />
    );

    const showInputSwitch = (
      <Switch
        color="secondary"
        checked={settings?.showInput ?? true}
        onChange={(event) => {
          requiredUpdateStepsRef.current.highlight = true;
          setSettings((previousSettings) => ({ ...previousSettings, showInput: event.target.checked }));
        }}
      />
    );
    const inputLevelsSelect = settings?.showInput ? (
      <Stack direction="row" gap={2} sx={{ justifyContent: 'space-between', alignContent: 'stretch' }}>
        <div style={{ textAlign: 'center', lineHeight: '38px' }}>Levels</div>
        <Select
          variant="standard"
          value={settings?.inputLevels ?? 2}
          onChange={(event) => {
            requiredUpdateStepsRef.current.highlight = true;
            setSettings((previousSettings) => ({ ...previousSettings, inputLevels: event.target.value }));
          }}
          displayEmpty
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </Stack>
    ) : null;
    const inputSettings = (
      <Stack direction="row" gap={2} sx={{ justifyContent: 'space-between', alignContent: 'stretch' }}>
        {showInputSwitch}
        {inputLevelsSelect}
      </Stack>
    );

    const showOutputSwitch = (
      <Switch
        color="secondary"
        checked={settings?.showOutput ?? true}
        onChange={(event) => {
          requiredUpdateStepsRef.current.highlight = true;
          setSettings((previousSettings) => ({ ...previousSettings, showOutput: event.target.checked }));
        }}
      />
    );
    const outputLevelsSelect = settings?.showOutput ? (
      <Stack direction="row" gap={2} sx={{ justifyContent: 'space-between', alignContent: 'stretch' }}>
        <div style={{ textAlign: 'center', lineHeight: '38px' }}>Levels</div>
        <Select
          variant="standard"
          value={settings?.outputLevels ?? 2}
          onChange={(event) => {
            requiredUpdateStepsRef.current.highlight = true;
            setSettings((previousSettings) => ({ ...previousSettings, outputLevels: event.target.value }));
          }}
          displayEmpty
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
        </Select>
      </Stack>
    ) : null;
    const outputSettings = (
      <Stack direction="row" gap={2} sx={{ justifyContent: 'space-between', alignContent: 'stretch' }}>
        {showOutputSwitch}
        {outputLevelsSelect}
      </Stack>
    );

    return (
      <Menu
        elevation={2}
        id="sim-settings-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-labelledby': 'sim-settings-button' }}
        PaperProps={{ style: { width: '365px' } }}
      >
        {forgeMenuTitle('Layout')}
        {forgeMenuItem('Orientation', 'Change the main graph orientation', orientationRadioGroup)}
        {forgeMenuItem('Spacing', 'Set the spacing between graph elements', spacingSlider)}
        {forgeMenuTitle('Display entity siblings')}
        {forgeMenuItem('Inputs', 'Limit how many levels of input siblings are visible', inputSettings)}
        <Divider sx={{ mx: 2 }} />
        {forgeMenuItem('Outputs', 'Limit how many levels of output siblings are visible', outputSettings)}
      </Menu>
    );
  }, [anchorEl, open, requiredUpdateStepsRef, settings, setSettings, localSpacingValue, changeSpacingWithDebounce]);

  return (
    <>
      <Button
        id="sim-settings-button"
        aria-controls={open ? 'sim-settings-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="inherit"
        onClick={handleClick}
        variant="text"
        startIcon={<SettingsOutlinedIcon />}
        style={{ height: '56px' }}
      >
        Settings
      </Button>
      {menu}
    </>
  );
};
