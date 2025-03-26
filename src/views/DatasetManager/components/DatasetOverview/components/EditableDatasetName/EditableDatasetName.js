// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Edit as EditIcon } from '@mui/icons-material';
import { FormControl, FormHelperText, IconButton, OutlinedInput, Stack, Typography } from '@mui/material';
import { FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { useEditableDatasetName } from './EditableDatasetNameHook';

const sanitizeValue = (value) => value.trim();

export const EditableDatasetName = () => {
  const { t } = useTranslation();
  const { dataset, datasetName, renameDataset } = useEditableDatasetName();

  const [error, setError] = useState(null);
  const [isEditing, setEditing] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState(datasetName ?? '');

  useEffect(() => {
    setTextFieldValue(datasetName);
  }, [datasetName]);

  const startEdition = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setEditing(true);
  };

  const editableTextField = useMemo(() => {
    const stopEdition = (event) => {
      event && event.stopPropagation();
      setEditing(false);
      setError(null);
    };

    const cancelEdition = (event) => {
      setTextFieldValue(datasetName);
      stopEdition(event);
    };

    const confirmChanges = (event) => {
      const sanitizedValue = sanitizeValue(event.target.value);
      if (error == null && sanitizedValue.length !== 0 && sanitizedValue !== datasetName) {
        renameDataset(sanitizedValue);
        setTextFieldValue(sanitizedValue);
      } else setTextFieldValue(datasetName);

      stopEdition(event);
    };

    const processNewValue = (event) => {
      const newValue = event.target.value;
      setTextFieldValue(newValue);

      const sanitizedValue = sanitizeValue(newValue);
      if (sanitizedValue.length !== 0) setError(null);
      else
        setError(
          t('commoncomponents.datasetmanager.overview.actions.emptyDatasetNameError', 'Dataset name cannot be empty')
        );
    };

    return (
      <FormControl data-cy="dataset-name-editable-text-field">
        <OutlinedInput
          autoFocus
          value={textFieldValue}
          error={error != null}
          onChange={processNewValue}
          onBlur={confirmChanges}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            if (event.key === 'Escape') cancelEdition(event);
            else if (event.key === 'Enter') confirmChanges(event);
          }}
          onFocus={(event) => event.stopPropagation()}
          size="small"
          sx={{ minWidth: '400px', marginLeft: 0.5, padding: 0.5 }}
        />
        <FormHelperText error>{error}</FormHelperText>
      </FormControl>
    );
  }, [datasetName, error, renameDataset, setTextFieldValue, t, textFieldValue]);

  const datasetNameElement = useMemo(
    () => (
      <Typography data-cy="dataset-name" variant="h6">
        {datasetName}
      </Typography>
    ),
    [datasetName]
  );

  const datasetNameWithEditButton = useMemo(() => {
    return (
      <Stack direction="row" spacing={1} alignItems="stretch" justifyContent="flex-start">
        {datasetNameElement}
        <FadingTooltip
          title={t('commoncomponents.datasetmanager.overview.actions.renameButtonTooltip', 'Rename')}
          disableInteractive={true}
        >
          <IconButton onClick={startEdition} data-cy="rename-dataset-button">
            <EditIcon color="primary" />
          </IconButton>
        </FadingTooltip>
      </Stack>
    );
  }, [datasetNameElement, t]);

  const userPermissions = dataset?.security?.currentUserPermissions ?? [];
  return (
    <PermissionsGate
      userPermissions={userPermissions}
      necessaryPermissions={[ACL_PERMISSIONS.DATASET.WRITE]}
      RenderNoPermissionComponent={() => datasetNameElement}
    >
      {isEditing ? editableTextField : datasetNameWithEditButton}
    </PermissionsGate>
  );
};
