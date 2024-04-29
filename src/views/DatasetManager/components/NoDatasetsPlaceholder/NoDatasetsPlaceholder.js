// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Grid, Stack, Typography } from '@mui/material';
import { PermissionsGate } from '@cosmotech/ui';
import { ACL_PERMISSIONS } from '../../../../services/config/accessControl';
import { CreateDatasetButton } from '../CreateDatasetButton';
import { useNoDatasetsPlaceholder } from './NoDatasetsPlaceholderHook';

export const NoDatasetsPlaceholder = () => {
  const { t } = useTranslation();
  const { userPermissionsInCurrentOrganization } = useNoDatasetsPlaceholder();
  const ViewerSubTitle = () => (
    <Typography data-cy="no-datasets-viewer-subtitle">
      {t(
        'commoncomponents.datasetmanager.noDatasets.readOnlySubtitle',
        "You don't have permissions to create datasets. Please contact your administrator."
      )}
    </Typography>
  );

  const editorSubTitle = (
    <Typography data-cy="no-datasets-user-subtitle">
      <Trans
        i18nKey="commoncomponents.datasetmanager.noDatasets.body"
        defaultValue="Click on <createDatasetButton /> to import your first data"
        components={{ createDatasetButton: <CreateDatasetButton isContainedButton={true} /> }}
      />
    </Typography>
  );

  return (
    <Grid container sx={{ height: 1, p: 1 }} data-cy="no-datasets-placeholder">
      <Card sx={{ width: 1 }}>
        <Stack sx={{ height: 1 }} justifyContent="center" alignItems="center">
          <Typography variant="h4">
            {t('commoncomponents.datasetmanager.noDatasets.title', "You don't have any datasets yet")}
          </Typography>
          <PermissionsGate
            userPermissions={userPermissionsInCurrentOrganization}
            necessaryPermissions={[ACL_PERMISSIONS.ORGANIZATION.CREATE_CHILDREN]}
            RenderNoPermissionComponent={ViewerSubTitle}
          >
            {editorSubTitle}
          </PermissionsGate>
        </Stack>
      </Card>
    </Grid>
  );
};
