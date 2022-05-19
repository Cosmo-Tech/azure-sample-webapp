// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Routes from '../../Routes';
import FadeIn from 'react-fade-in';
import { LoadingLine } from '@cosmotech/ui';
import { STATUSES } from '../../state/commons/Constants';
import { useTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core';
import * as dataLoading from '../../assets/loadingLine/dataLoading.json';
import * as dataLoaded from '../../assets/loadingLine/dataLoaded.json';
import * as dataError from '../../assets/loadingLine/dataError.json';

const useStyles = makeStyles((theme) => ({
  panel: {
    backgroundColor: theme.palette.background.paper,
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

const Loading = ({
  authenticated,
  authorized,
  logout,
  tabs,
  scenarioList,
  currentScenario,
  powerBiInfo,
  workspace,
  solution,
  datasetList,
  application,
  getAllInitialDataAction,
  setApplicationStatusAction,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const defaultTitle = 'LoadingLine Title';

  useEffect(() => {
    if (authenticated) {
      getAllInitialDataAction();
    } else {
      setApplicationStatusAction(STATUSES.IDLE);
    }
  }, [authenticated, getAllInitialDataAction, setApplicationStatusAction]);

  const isLoading = (entityStatus) => {
    return (
      entityStatus.status !== STATUSES.ERROR &&
      (entityStatus.status === STATUSES.LOADING || entityStatus.status === STATUSES.IDLE)
    );
  };

  const hasErrors = (entityStatus) => entityStatus.status === STATUSES.ERROR;

  return authenticated && isLoading(application) ? (
    <div className={classes.panel} data-cy="loading-component">
      <FadeIn delay={200}>
        <LoadingLine
          title={t('genericcomponent.loading.line.scenario.list.title', defaultTitle)}
          hasError={hasErrors(scenarioList)}
          isLoading={isLoading(scenarioList)}
          animations={animations}
        />
        <LoadingLine
          title={t('genericcomponent.loading.line.dataset.list.title', defaultTitle)}
          hasError={hasErrors(datasetList)}
          isLoading={isLoading(datasetList)}
          animations={animations}
        />
        <LoadingLine
          title={t('genericcomponent.loading.line.workspace.current.title', defaultTitle)}
          hasError={hasErrors(workspace)}
          isLoading={isLoading(workspace)}
          animations={animations}
        />
        <LoadingLine
          title={t('genericcomponent.loading.line.solution.current.title', defaultTitle)}
          hasError={hasErrors(solution)}
          isLoading={isLoading(solution)}
          animations={animations}
        />
        <LoadingLine
          title={t('genericcomponent.loading.line.scenario.current.title', defaultTitle)}
          hasError={hasErrors(currentScenario)}
          isLoading={isLoading(currentScenario)}
          animations={animations}
        />
        <LoadingLine
          title={t('genericcomponent.loading.line.powerbi.title', defaultTitle)}
          hasError={hasErrors(powerBiInfo)}
          isLoading={isLoading(powerBiInfo)}
          animations={animations}
        />
      </FadeIn>
    </div>
  ) : (
    <Routes authenticated={authenticated} authorized={application.status === STATUSES.SUCCESS} tabs={tabs} />
  );
};

Loading.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  powerBiInfo: PropTypes.object.isRequired,
  currentScenario: PropTypes.object.isRequired,
  scenarioList: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
  getAllInitialDataAction: PropTypes.func.isRequired,
  setApplicationStatusAction: PropTypes.func.isRequired,
};

export default Loading;
