// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { FileQuestionMarkIcon } from 'lucide-react';
import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
  Autocomplete,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWorkspaceDatasets } from '../../hooks/WorkspaceDatasetsHooks';
import { useRunners } from '../../state/runner/hooks';
import { useScenarioRunTemplates, useSolutionData } from '../../state/solutions/hooks';
import { useCreateScenarioButton } from '../CreateScenarioButton/CreateScenarioButtonHook';
import TabLabel from './components/TabLabel';

const tabIndicatorNone = { style: { display: 'none' } };

export default function CreateNewScenarioModal({ open, onClose }) {
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [datasets, setDatasets] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const scenarios = useRunners();
  const [parentScenario, setParentScenario] = useState(null);

  const theme = useTheme();
  const { t } = useTranslation();
  const { secondary, background, neutral, custom } = theme.palette;
  const runTemplates = useScenarioRunTemplates();
  const datasetsOptions = useWorkspaceDatasets();
  const solutionData = useSolutionData();

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

  const isMaster = subTab === 0;
  const isValid = useMemo(
    () => name.trim() !== '' && (isMaster ? datasets.length > 0 : !!parentScenario),
    [name, datasets, isMaster, parentScenario]
  );

  const { createScenario, workspaceId } = useCreateScenarioButton({ disabled: false });
  const handleSubmit = useCallback(() => {
    if (!isValid) return;
    const selectedRunTemplate = runTemplates[mainTab];
    const solutionId = solutionData?.id;
    createScenario(workspaceId, {
      runTemplateId: selectedRunTemplate?.id,
      runTemplateName: selectedRunTemplate?.name,
      solutionId,
      datasets: isMaster ? (datasets[0] ? [datasets[0].id] : []) : undefined,
      parentScenario: !isMaster && parentScenario ? parentScenario.id : undefined,
      name,
      description,
    });
    onClose();
  }, [
    isValid,
    mainTab,
    datasets,
    parentScenario,
    name,
    description,
    onClose,
    runTemplates,
    isMaster,
    createScenario,
    workspaceId,
    solutionData,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={false}
      PaperProps={{
        sx: {
          height: '90vh',
          width: '70vw',
          minWidth: 600,
          maxWidth: '65vw',
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
      </DialogTitle>{' '}
      <Tabs
        value={mainTab}
        onChange={(event, newValue) => setMainTab(newValue)}
        sx={{
          px: 2,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '& .MuiTabs-flexContainer': {
            flexWrap: 'nowrap',
          },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 600,
            color: secondary.main,
            borderRadius: '6px 6px 0 0',
            mr: 2,
            minWidth: 320,
            backgroundColor: background.background01.main,
            flexShrink: 0,
          },
          '& .MuiTab-root.Mui-selected': {
            color: secondary.main,
            backgroundColor: neutral.neutral04.main,
          },
        }}
        TabIndicatorProps={tabIndicatorNone}
        variant="scrollable"
        scrollButtons="auto"
      >
        {runTemplates.map((rt, idx) => (
          <Tab
            key={rt.id}
            label={
              <TabLabel
                icon={FileQuestionMarkIcon}
                color={secondary.main}
                title={rt.labels.en}
                desc={rt.description || ''}
              />
            }
            disabled={rt.disabled}
          />
        ))}
      </Tabs>
      <DialogContent
        sx={{
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          bgcolor: neutral.neutral04.main,
          transition: 'background-color 0.3s ease',
          mx: 2,
          borderRadius: '0 6px 0 0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', my: 2 }}>
          {' '}
          <Tabs
            value={subTab}
            onChange={(event, newValue) => setSubTab(newValue)}
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
            <Tab label={t('layouts.tabs.scenario.scenariomodal.fromDataset')} />
            <Tab label={t('layouts.tabs.scenario.scenariomodal.fromScenario')} />
          </Tabs>
          <Stack
            spacing={2}
            sx={{ alignSelf: 'center', backgroundColor: neutral.neutral04.main, pt: 4, px: 10, width: '70%' }}
          >
            {isMaster ? (
              <Autocomplete
                options={datasetsOptions || []}
                getOptionLabel={(option) => option.name || option}
                value={datasets[0] || null}
                onChange={(event, newValue) => setDatasets(newValue ? [newValue] : [])}
                renderInput={(params) => (
                  <TextField {...params} label="Data Set" required helperText="Select a data set" sx={inputSx} />
                )}
              />
            ) : (
              <Autocomplete
                options={scenarios || []}
                getOptionLabel={(option) => option.name || ''}
                value={parentScenario}
                onChange={(event, newValue) => setParentScenario(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Parent Scenario"
                    required
                    helperText="Select a parent scenario"
                    sx={inputSx}
                  />
                )}
              />
            )}

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
};
