import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import { DontAskAgainDialog, FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { DATASET_SOURCE_TYPE, INGESTION_STATUS } from '../../../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { useRefreshDataset } from '../../../../../../state/hooks/DatasetHooks';
import { ReuploadFileDatasetButton } from '../../../ReuploadFileDatasetButton/ReuploadFileDatasetButton';

export const RefreshDatasetButton = ({ dataset }) => {
  const isDisabled = dataset && dataset.ingestionStatus === INGESTION_STATUS.PENDING;
  const { t } = useTranslation();
  const refreshDialogLabels = {
    title: t('commoncomponents.datasetmanager.dialogs.refresh.title', 'Overwrite data?'),
    body: t(
      'commoncomponents.datasetmanager.dialogs.refresh.body',
      'Your data will be lost, replaced with the imported one.'
    ),
    cancel: t('commoncomponents.datasetmanager.dialogs.cancel', 'Cancel'),
    confirm: t('commoncomponents.datasetmanager.dialogs.refresh.overwriteButton', 'Overwrite'),
    checkbox: t('commoncomponents.datasetmanager.dialogs.refresh.checkbox', 'Do not ask me again'),
  };

  const [isRefreshConfirmationDialogOpen, setIsRefreshConfirmationDialogOpen] = useState(false);

  const refreshDatasetById = useRefreshDataset();
  const datasetRefreshCallback = useRef();
  const confirmAndRefreshDataset = useCallback((event, callbackFunction) => {
    event.stopPropagation();
    if (localStorage.getItem('dontAskAgainToRefreshDataset') !== 'true') {
      datasetRefreshCallback.current = callbackFunction;
      setIsRefreshConfirmationDialogOpen(true);
    } else {
      callbackFunction();
    }
  }, []);

  const onConfirmRefreshDataset = useCallback(
    (isChecked) => {
      localStorage.setItem('dontAskAgainToRefreshDataset', isChecked);
      datasetRefreshCallback.current();
      setIsRefreshConfirmationDialogOpen(false);
    },
    [setIsRefreshConfirmationDialogOpen, datasetRefreshCallback]
  );
  let refreshButton = null;
  if (dataset?.sourceType === DATASET_SOURCE_TYPE.LOCAL_FILE)
    refreshButton = (
      <ReuploadFileDatasetButton
        confirmAndCallback={confirmAndRefreshDataset}
        datasetId={dataset.id}
        disabled={dataset.ingestionStatus === INGESTION_STATUS.PENDING}
      />
    );
  else if (dataset?.sourceType !== DATASET_SOURCE_TYPE.NONE) {
    refreshButton = (
      <FadingTooltip
        title={t('commoncomponents.datasetmanager.overview.actions.refreshButtonTooltip', 'Refresh')}
        disableInteractive={true}
      >
        <IconButton
          onClick={(event) => confirmAndRefreshDataset(event, () => refreshDatasetById(dataset.id))}
          data-cy={`dataset-refresh-button-${dataset?.id}`}
          disabled={isDisabled}
        >
          <RefreshIcon color={isDisabled ? 'disabled' : 'primary'} />
        </IconButton>
      </FadingTooltip>
    );
  }
  const userPermissionsOnDataset = dataset?.security?.currentUserPermissions ?? [];
  return (
    <div>
      <PermissionsGate
        userPermissions={userPermissionsOnDataset}
        necessaryPermissions={[ACL_PERMISSIONS.DATASET.WRITE]}
      >
        {refreshButton}
      </PermissionsGate>
      <DontAskAgainDialog
        id="refresh-dataset-dialog"
        open={isRefreshConfirmationDialogOpen}
        labels={refreshDialogLabels}
        onClose={() => setIsRefreshConfirmationDialogOpen(false)}
        onConfirm={onConfirmRefreshDataset}
      />
    </div>
  );
};

RefreshDatasetButton.propTypes = {
  dataset: PropTypes.object.isRequired,
};
