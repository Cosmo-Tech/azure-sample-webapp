import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import RefreshIcon from '@mui/icons-material/Refresh';
import IconButton from '@mui/material/IconButton';
import { DontAskAgainDialog, FadingTooltip, PermissionsGate } from '@cosmotech/ui';
import { useGetDatasetRunnerStatus } from '../../../../../../hooks/DatasetRunnerHooks';
import { NATIVE_DATASOURCE_TYPES, RUNNER_RUN_STATE } from '../../../../../../services/config/ApiConstants';
import { ACL_PERMISSIONS } from '../../../../../../services/config/accessControl';
import { useRefreshDataset } from '../../../../../../state/datasets/hooks';
import { DatasetsUtils } from '../../../../../../utils';
import { ReuploadFileDatasetButton } from '../../../ReuploadFileDatasetButton/ReuploadFileDatasetButton';

export const RefreshDatasetButton = ({ dataset }) => {
  const { t } = useTranslation();
  const getDatasetRunnerStatus = useGetDatasetRunnerStatus();
  const datasetStatus = getDatasetRunnerStatus(dataset);

  const isDisabled = dataset && datasetStatus === RUNNER_RUN_STATE.RUNNING;
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

  const refreshDataset = useRefreshDataset();
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

  const sourceType = DatasetsUtils.getDatasetOption(dataset, 'sourceType');
  let refreshButton = null;
  if (sourceType === NATIVE_DATASOURCE_TYPES.FILE_UPLOAD)
    refreshButton = (
      <ReuploadFileDatasetButton
        confirmAndCallback={confirmAndRefreshDataset}
        dataset={dataset}
        disabled={datasetStatus === RUNNER_RUN_STATE.RUNNING}
      />
    );
  else if (DatasetsUtils.isCreatedByRunner(dataset)) {
    refreshButton = (
      <FadingTooltip
        title={t('commoncomponents.datasetmanager.overview.actions.refreshButtonTooltip', 'Refresh')}
        disableInteractive
      >
        <IconButton
          onClick={(event) => confirmAndRefreshDataset(event, () => refreshDataset(dataset))}
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
