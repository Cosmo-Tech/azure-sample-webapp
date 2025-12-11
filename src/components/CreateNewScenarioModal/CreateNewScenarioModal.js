// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import FileInputIcon from 'lucide-react/dist/esm/icons/file-input';
import FileQuestionMarkIcon from 'lucide-react/dist/esm/icons/file-question';
import LayersIcon from 'lucide-react/dist/esm/icons/layers';
import React, { useMemo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
  Stack,
  TextField,
  Button,
  IconButton,
  Typography,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TabLabel from './components/TabLabel';

const tabIndicatorNone = { style: { display: 'none' } };

export default function CreateNewScenarioModal({ open, onClose, onSubmit }) {
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [datasets, setDatasets] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const theme = useTheme();
  const { secondary, background, neutral, action, custom } = theme.palette;

  const inputSx = useMemo(
    () => ({
      '& .MuiInputLabel-root': { color: secondary.main },
      '& .MuiInputLabel-root.Mui-focused': { color: secondary.main },
      '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: background.background02.main },
        '&:hover fieldset': { borderColor: background.background02.main },
        '&.Mui-focused fieldset': { borderColor: background.background02.main },
      },
      input: { color: secondary.main },
      textarea: { color: secondary.main },
      '& .MuiSelect-select': { color: secondary.main },
      '& .MuiSelect-icon': { color: secondary.main },
    }),
    [secondary.main, background.background02.main]
  );

  const isValid = useMemo(() => name.trim() !== '' && datasets.length > 0, [name, datasets]);

  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    onSubmit({
      mainTab: ['whatIf', 'monteCarlo'][mainTab],
      subTab: ['fromDataset', 'fromScenario'][subTab],
      datasets,
      name,
      description,
    });
    onClose();
  }, [isValid, mainTab, subTab, datasets, name, description, onSubmit, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth
      PaperProps={{
        sx: {
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: background.background01.main,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pr: 1,
          bgcolor: background.background01.main,
        }}
      >
        <Typography variant="h6" component="span" sx={{ color: secondary.main, fontWeight: 700, fontSize: 28 }}>
          Create New Scenario
        </Typography>
        <IconButton onClick={onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Tabs
        value={mainTab}
        onChange={(_, v) => setMainTab(v)}
        sx={{
          px: 2,
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            color: secondary.main,
            borderRadius: '6px 6px 0 0',
            mr: 2,
            minWidth: 320,
            backgroundColor: background.background01.main,
          },
          '& .MuiTab-root.Mui-selected': {
            color: secondary.main,
            backgroundColor: neutral.neutral04.main,
          },
        }}
        TabIndicatorProps={tabIndicatorNone}
      >
        <Tab
          label={
            <TabLabel
              icon={FileQuestionMarkIcon}
              color={secondary.main}
              title="What If Simulation"
              desc="A scenario with run parameters and output data."
            />
          }
        />
        <Tab
          label={
            <TabLabel
              icon={LayersIcon}
              color={secondary.main}
              title="Monte Carlo Sim’"
              desc="Multiple simulations to find the optimal solution."
            />
          }
        />
        <Tab
          label={
            <TabLabel
              icon={FileInputIcon}
              color={action.disabled}
              title="Massification"
              desc="Start with the outputs of an existing scenario."
            />
          }
          disabled
        />
      </Tabs>

      <DialogContent
        sx={{
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          bgcolor: mainTab === 0 ? neutral.neutral04.main : background.background01.main,
          transition: 'background-color 0.3s ease',
          mx: 2,
          borderRadius: '0 6px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', my: 2 }}>
          {mainTab === 0 && (
            <>
              <Tabs
                value={subTab}
                onChange={(_, v) => setSubTab(v)}
                sx={{
                  width: '80%',
                  borderBottom: 1,
                  borderColor: neutral.neutral04.main,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 500,
                    color: secondary.main,
                    mr: 1,
                  },
                  '& .MuiTab-root.Mui-selected': {
                    color: secondary.main,
                    border: `1px solid ${background.background02.main}`,
                    borderBottom: 'none',
                    backgroundColor: neutral.neutral04.main,
                    borderRadius: '6px 6px 0 0',
                  },
                }}
                TabIndicatorProps={tabIndicatorNone}
              >
                <Tab label="From Dataset (creates a master scenario)" />
                <Tab label="From Scenario (creates a sub scenario)" />
              </Tabs>

              {subTab === 0 && (
                <Stack
                  spacing={2}
                  sx={{ alignSelf: 'center', backgroundColor: neutral.neutral04.main, pt: 4, px: 10, width: '70%' }}
                >
                  <Autocomplete
                    multiple
                    options={['Dataset A', 'Dataset B', 'Dataset C']}
                    value={datasets}
                    onChange={(_, value) => setDatasets(value)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => <Chip key={option} label={option} {...getTagProps({ index })} />)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Data Sets"
                        required
                        helperText="You can pick multiple data sets"
                        sx={inputSx}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Scenario Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    sx={inputSx}
                  />

                  <TextField
                    fullWidth
                    multiline
                    minRows={3}
                    label="Scenario Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    sx={inputSx}
                  />
                </Stack>
              )}
            </>
          )}

          {mainTab === 1 && (
            <Typography mt={3} color="text.secondary">
              Monte Carlo configuration (to be implemented)
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'transparent', bgcolor: background.background01.main }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            color: secondary.main,
            fontWeight: 600,
            backgroundColor: neutral.neutral04.main,
            '&:hover': {
              backgroundColor: custom.gray.dark,
              borderColor: secondary.main,
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={!isValid}
          onClick={handleSubmit}
          sx={{
            color: neutral.neutral04.main,
            backgroundColor: secondary.main,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: custom.gray.border,
              boxShadow: 'none',
            },
            '&.Mui-disabled': {
              backgroundColor: custom.disabled.main,
              color: neutral.neutral04.main,
            },
          }}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

CreateNewScenarioModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
