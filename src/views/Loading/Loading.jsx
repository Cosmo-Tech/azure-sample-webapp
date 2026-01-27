// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import FadeIn from 'react-fade-in';
import { useTranslation } from 'react-i18next';
import { LoadingLine } from '@cosmotech/ui';
import * as dataError from '../../assets/loadingLine/dataError.json';
import * as dataLoaded from '../../assets/loadingLine/dataLoaded.json';
import * as dataLoading from '../../assets/loadingLine/dataLoading.json';
import { STATUSES } from '../../services/config/StatusConstants';
import { useLoading } from './LoadingHook';

const animations = {
  dataLoading: dataLoading.default,
  dataError: dataError.default,
  dataLoaded: dataLoaded.default,
};

const Loading = () => {
  const { t } = useTranslation();
  const defaultTitle = 'LoadingLine Title';
  const {
    runnersReducerStatus,
    workspaces,
    workspacesReducerStatus,
    currentWorkspaceReducerStatus,
    solutionReducerStatus,
    datasetsReducerStatus,
    organizationReducerStatus,
  } = useLoading();

  const isLoading = (entityStatus) => [STATUSES.LOADING, STATUSES.IDLE].includes(entityStatus);
  const hasErrors = (entityStatus) => entityStatus === STATUSES.ERROR;
  const afterWorkspaceSelector = workspacesReducerStatus === STATUSES.SUCCESS;
  const isWorkspaceAutoSelected = afterWorkspaceSelector && workspaces?.length === 1;
  const hidePreWorkspaceSelectorLoaders = afterWorkspaceSelector && !isWorkspaceAutoSelected;
  const hidePostWorkspaceSelectorLoaders = !afterWorkspaceSelector && !isWorkspaceAutoSelected;

  const loadingLineStyle = { variant: 'h6', height: '50px', width: '50px' };

  return (
    <div
      style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
      data-cy="loading-component"
    >
      {!hidePreWorkspaceSelectorLoaders && (
        <FadeIn delay={100}>
          <LoadingLine
            title={t('genericcomponent.loading.line.dataset.list.title', defaultTitle)}
            hasError={hasErrors(datasetsReducerStatus)}
            isLoading={isLoading(datasetsReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.organization.current.title', defaultTitle)}
            hasError={hasErrors(organizationReducerStatus)}
            isLoading={isLoading(organizationReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.workspace.list.title', defaultTitle)}
            hasError={hasErrors(workspacesReducerStatus)}
            isLoading={isLoading(workspacesReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
        </FadeIn>
      )}
      {!hidePostWorkspaceSelectorLoaders && (
        <FadeIn delay={100}>
          <LoadingLine
            title={t('genericcomponent.loading.line.workspace.current.title', defaultTitle)}
            hasError={hasErrors(currentWorkspaceReducerStatus)}
            isLoading={isLoading(currentWorkspaceReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.solution.current.title', defaultTitle)}
            hasError={hasErrors(solutionReducerStatus)}
            isLoading={isLoading(solutionReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.scenario.list.title', defaultTitle)}
            hasError={hasErrors(runnersReducerStatus)}
            isLoading={isLoading(runnersReducerStatus)}
            animations={animations}
            style={loadingLineStyle}
          />
        </FadeIn>
      )}
    </div>
  );
};

export default Loading;
