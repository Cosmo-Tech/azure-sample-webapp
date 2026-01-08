// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box, Button, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { Icon } from '../Icon';

export const DeleteScenarioModal = ({ open, onClose, onConfirm, scenarioName }) => {
  const { t } = useTranslation();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '12px',
          maxWidth: '450px',
          width: '100%',
          p: 3,
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Typography
            variant="h5"
            sx={{
              fontSize: 24,
              fontWeight: 600,
              color: (theme) => theme.palette.secondary.main,
            }}
          >
            {t('components.deleteScenarioModal.title', 'Delete Scenario')}
          </Typography>
          <IconButton onClick={onClose} sx={{ p: 0, ml: 2 }}>
            <Icon name="CircleX" size={24} />
          </IconButton>
        </Stack>

        <Box
          sx={{
            backgroundColor: (theme) => theme.palette.background.default,
            borderRadius: '8px',
            p: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontSize: 18,
              fontWeight: 600,
              color: (theme) => theme.palette.secondary.main,
              mb: 1,
            }}
          >
            {scenarioName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontSize: 14,
              color: (theme) => theme.palette.text.secondary,
            }}
          >
            {t('components.deleteScenarioModal.message', 'Are you sure you want to delete this scenario?')}
          </Typography>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderColor: (theme) => theme.palette.divider,
              color: (theme) => theme.palette.secondary.main,
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                borderColor: (theme) => theme.palette.divider,
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          >
            {t('components.deleteScenarioModal.cancel', 'Cancel')}
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            startIcon={<Icon name="Trash2" size={16} />}
            sx={{
              backgroundColor: (theme) => theme.palette.error.main,
              color: '#fff',
              textTransform: 'none',
              fontWeight: 500,
              px: 3,
              '&:hover': {
                backgroundColor: (theme) => theme.palette.error.dark,
              },
            }}
          >
            {t('components.deleteScenarioModal.delete', 'Delete')}
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

DeleteScenarioModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  scenarioName: PropTypes.string,
};

DeleteScenarioModal.defaultProps = {
  scenarioName: '',
};
