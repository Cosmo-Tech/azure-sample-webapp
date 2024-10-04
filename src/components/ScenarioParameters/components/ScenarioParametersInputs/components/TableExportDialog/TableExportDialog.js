// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid2 as Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

const ALLOWED_FILE_TYPES = [
  {
    extension: 'csv',
    label: 'CSV',
  },
  {
    extension: 'xlsx',
    label: 'Excel',
  },
];

const DEFAULT_LABELS = {
  cancel: 'Cancel',
  export: 'Export',
  fileNameInputLabel: 'Name',
  fileTypeSelectLabel: 'Type',
  title: 'Export file',
  exportDescription: 'Your file will be exported in your Downloads directory.',
};

export const TableExportDialog = ({ defaultFileName = 'Untitled', labels: tmpLabels, onClose, onExport, open }) => {
  const labels = { ...tmpLabels, ...DEFAULT_LABELS };
  const defaultFileExtension = ALLOWED_FILE_TYPES[0].extension;

  const [fileName, setFileName] = useState(defaultFileName);
  const [fileType, setFileType] = useState(defaultFileExtension);

  const selectFileName = (event) => {
    setFileName(event.target.value);
  };
  const selectFileType = (event) => {
    setFileType(event.target.value);
  };
  const confirmExport = () => {
    const exportedFileName = `${fileName}.${fileType}`;
    onExport(exportedFileName);
  };

  return (
    <Dialog onClose={onClose} open={open} data-cy="table-export-dialog">
      <DialogTitle>{labels.title}</DialogTitle>
      <DialogContent sx={{ paddingBottom: '0' }}>
        <Typography>{labels.exportDescription}</Typography>
        <Grid
          container
          spacing={2}
          direction="column"
          sx={{
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          <Grid data-cy="table-export-file-type-container">
            <FormControl size="small" sx={{ marginTop: 2, width: 220 }}>
              <InputLabel id="table-export-file-type-select-label">{labels.fileTypeSelectLabel}</InputLabel>
              <Select
                data-cy="table-export-file-type-select"
                labelId="table-export-file-type-select-label"
                id="table-export-file-type-select"
                value={fileType}
                label={labels.fileTypeSelectLabel}
                onChange={selectFileType}
              >
                {ALLOWED_FILE_TYPES.map((allowedFileType) => (
                  <MenuItem
                    key={allowedFileType.extension}
                    value={allowedFileType.extension}
                    data-cy={`table-export-file-type-select-option-${allowedFileType.extension}`}
                  >
                    {allowedFileType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            <TextField
              id="table-export-file-name-input"
              data-cy="table-export-file-name-input"
              label={labels.fileNameInputLabel}
              variant="outlined"
              value={fileName}
              onChange={selectFileName}
              size="small"
              sx={{ width: 220 }}
              slotProps={{
                input: {
                  endAdornment: <InputAdornment position="end">{'.' + fileType}</InputAdornment>,
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button data-cy="table-export-file-cancel-button" onClick={onClose}>
          {labels.cancel}
        </Button>
        <Button data-cy="table-export-file-confirm-button" onClick={confirmExport} variant="contained" autoFocus>
          {labels.export}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

TableExportDialog.propTypes = {
  defaultFileName: PropTypes.string,
  labels: PropTypes.shape({
    cancel: PropTypes.string.isRequired,
    export: PropTypes.string.isRequired,
    fileNameInputLabel: PropTypes.string.isRequired,
    fileTypeSelectLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    exportDescription: PropTypes.string.isRequired,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
};
