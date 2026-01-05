// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const ITEM_TYPES = {
  VALUE_FRAMEWORK: 'valueFramework',
  OBJECTIVE: 'objective',
  METRIC: 'metric',
};

export const DeleteDialog = ({ open, onClose, onConfirm, itemType, itemName }) => {
  const { t } = useTranslation();

  const getTitle = () => {
    switch (itemType) {
      case ITEM_TYPES.VALUE_FRAMEWORK:
        return t('delete.dialog.title.framework', 'Delete Value Framework');
      case ITEM_TYPES.OBJECTIVE:
        return t('delete.dialog.title.objective', 'Delete Objective');
      case ITEM_TYPES.METRIC:
        return t('delete.dialog.title.metric', 'Delete Metric');
      default:
        return t('delete.dialog.title.default', 'Delete Item');
    }
  };

  const confirmationQuestion = t(
    'delete.dialog.question',
    'Are you sure you want to delete this {{itemType}}?',
    { itemType: itemType === ITEM_TYPES.VALUE_FRAMEWORK ? 'value framework' : itemType }
  );

  const labels = {
    title: getTitle(),
    button1: t('delete.dialog.cancel', 'Cancel'),
    button2: t('delete.dialog.confirm', 'Delete'),
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2,
          backgroundColor: 'grey.100',
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {getTitle()}
        </Typography>
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
          }}
          data-cy="close-dialog-button"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: 'grey.100',
          pt: 6,
          pb: 6,
          px: 3,
          m: 0,
          '&.MuiDialogContent-root': {
            paddingLeft: '24px',
            paddingRight: '24px',
            margin: 0,
          },
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.paper',
            px: 3,
            py: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 600,
              mb: 2,
              color: 'text.primary',
            }}
          >
            {itemName}
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.primary', fontSize: '1rem' }}>
            {confirmationQuestion}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          backgroundColor: 'grey.100',
          gap: 2,
        }}
      >
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            backgroundColor: 'background.paper',
            color: 'text.primary',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'grey.100',
              boxShadow: 'none',
            },
          }}
          data-cy="cancel-delete-button"
        >
          {labels.button1}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          startIcon={<DeleteIcon />}
          sx={{
            backgroundColor: 'error.light',
            color: 'error.main',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              backgroundColor: 'error.light',
              opacity: 0.9,
              boxShadow: 'none',
            },
          }}
          data-cy="confirm-delete-button"
        >
          {labels.button2}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  itemType: PropTypes.oneOf([ITEM_TYPES.VALUE_FRAMEWORK, ITEM_TYPES.OBJECTIVE, ITEM_TYPES.METRIC]).isRequired,
  itemName: PropTypes.string.isRequired,
};

export { ITEM_TYPES };
