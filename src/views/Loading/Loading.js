// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React from 'react';
import FadeIn from 'react-fade-in';
import { useTranslation } from 'react-i18next';
import makeStyles from '@mui/styles/makeStyles';
import { LoadingLine } from '@cosmotech/ui';
import * as dataError from '../../assets/loadingLine/dataError.json';
import * as dataLoaded from '../../assets/loadingLine/dataLoaded.json';
import * as dataLoading from '../../assets/loadingLine/dataLoading.json';
import { STATUSES } from '../../state/commons/Constants';
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
  const {
    powerBIReducerStatus,
    scenariosReducerStatus,
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

  const style = { variant: 'h6', height: '50px', width: '50px' };

  return (
    <div className={classes.panel} data-cy="loading-component">
      {!hidePreWorkspaceSelectorLoaders && (
        <FadeIn delay={100}>
          <LoadingLine
            title={t('genericcomponent.loading.line.dataset.list.title', defaultTitle)}
            hasError={hasErrors(datasetsReducerStatus)}
            isLoading={isLoading(datasetsReducerStatus)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.organization.current.title', defaultTitle)}
            hasError={hasErrors(organizationReducerStatus)}
            isLoading={isLoading(organizationReducerStatus)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.workspace.list.title', defaultTitle)}
            hasError={hasErrors(workspacesReducerStatus)}
            isLoading={isLoading(workspacesReducerStatus)}
            animations={animations}
            style={style}
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
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.solution.current.title', defaultTitle)}
            hasError={hasErrors(solutionReducerStatus)}
            isLoading={isLoading(solutionReducerStatus)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.scenario.list.title', defaultTitle)}
            hasError={hasErrors(scenariosReducerStatus)}
            isLoading={isLoading(scenariosReducerStatus)}
            animations={animations}
            style={style}
          />
          <LoadingLine
            title={t('genericcomponent.loading.line.powerbi.title', defaultTitle)}
            hasError={hasErrors(powerBIReducerStatus)}
            isLoading={isLoading(powerBIReducerStatus)}
            animations={animations}
            style={style}
          />
        </FadeIn>
      )}
    </div>
  );
};

export default Loading;
