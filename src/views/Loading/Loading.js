// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import FadeIn from 'react-fade-in';
import { LoadingLine } from '@cosmotech/ui';
import { STATUSES } from '../../state/commons/Constants';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import * as dataLoading from '../../assets/loadingLine/dataLoading.json';
import * as dataLoaded from '../../assets/loadingLine/dataLoaded.json';
import * as dataError from '../../assets/loadingLine/dataError.json';
import { useLoading } from './LoadingHook';

const useStyles = makeStyles((theme) => ({
  panel: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  },
}));

const animations = {
  dataLoading: dataLoading.default,
  dataError: dataError.default,
  dataLoaded: dataLoaded.default,
};

const Loading = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const defaultTitle = 'LoadingLine Title';
  const { powerBIInfo, scenarioList, workspaces, currentWorkspace, solution, datasetList, organization } = useLoading();

  const isLoading = (entityStatus) => [STATUSES.LOADING, STATUSES.IDLE].includes(entityStatus.status);
  const hasErrors = (entityStatus) => entityStatus.status === STATUSES.ERROR;
  const afterWorkspaceSelector = workspaces.status === STATUSES.SUCCESS;
  const isWorkspaceAutoSelected = afterWorkspaceSelector && workspaces.data.length === 1;
  const hidePreWorkspaceSelectorLoaders = afterWorkspaceSelector && !isWorkspaceAutoSelected;
  const hidePostWorkspaceSelectorLoaders = !afterWorkspaceSelector && !isWorkspaceAutoSelected;

  const style = { variant: 'h6', height: '50px', width: '50px' };

  return (
    <div className={classes.panel} data-cy="loading-component">
      {!hidePreWorkspaceSelectorLoaders && (
        <FadeIn delay={100}>
          <LoadingLine
            title={t('genericcomponent.loading.line.dataset.list.title', defaultTitle)}
            hasError={hasErrors(datasetList)}
            isLoading={isLoading(datasetList)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.organization.current.title', defaultTitle)}
            hasError={hasErrors(organization)}
            isLoading={isLoading(organization)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.workspace.list.title', defaultTitle)}
            hasError={hasErrors(workspaces)}
            isLoading={isLoading(workspaces)}
            animations={animations}
            style={style}
          />
        </FadeIn>
      )}
      {!hidePostWorkspaceSelectorLoaders && (
        <FadeIn delay={100}>
          <LoadingLine
            title={t('genericcomponent.loading.line.workspace.current.title', defaultTitle)}
            hasError={hasErrors(currentWorkspace)}
            isLoading={isLoading(currentWorkspace)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.solution.current.title', defaultTitle)}
            hasError={hasErrors(solution)}
            isLoading={isLoading(solution)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.scenario.list.title', defaultTitle)}
            hasError={hasErrors(scenarioList)}
            isLoading={isLoading(scenarioList)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.powerbi.title', defaultTitle)}
            hasError={hasErrors(powerBIInfo)}
            isLoading={isLoading(powerBIInfo)}
            animations={animations}
            style={style}
          />
        </FadeIn>
      )}
    </div>
  );
};

export default Loading;
