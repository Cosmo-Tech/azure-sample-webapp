// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Routes from '../../Routes';
import FadeIn from 'react-fade-in';
import LoadingLine from '../../components/LoadingLine';
import { STATUSES } from '../../state/commons/Constants';
import { withStyles } from '@material-ui/core/styles';

const useStyles = theme => ({
  panel: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  }
});

const Loading = (
  {
    classes,
    authenticated,
    authorized,
    logout,
    tabs,
    scenarioList,
    workspace,
    solution,
    datasetList,
    application,
    getAllInitialDataAction,
    setApplicationStatusAction
  }) => {
  useEffect(() => {
    if (authenticated) {
      getAllInitialDataAction();
    } else {
      setApplicationStatusAction(STATUSES.IDLE);
    }
  }, [authenticated, getAllInitialDataAction, setApplicationStatusAction]);

  const isLoading = (entityStatus) => {
    return entityStatus.status !== STATUSES.ERROR && (entityStatus.status === STATUSES.LOADING || entityStatus.status === STATUSES.IDLE);
  };

  const hasErrors = (entityStatus) => entityStatus.status === STATUSES.ERROR;

  if (application.status === STATUSES.ERROR) {
    logout();
  }

  return (authenticated && application.status !== STATUSES.SUCCESS
    ? (<div className={classes.panel} data-cy="loading-component">
          <FadeIn delay={200}>
            <LoadingLine titleKey={'genericcomponent.loading.line.scenario.list.title'} hasError={hasErrors(scenarioList)} isLoading={isLoading(scenarioList)} height={120} width={120}/>
            <LoadingLine titleKey={'genericcomponent.loading.line.dataset.list.title'} hasError={hasErrors(datasetList)} isLoading={isLoading(datasetList)} height={120} width={120}/>
            <LoadingLine titleKey={'genericcomponent.loading.line.workspace.current.title'} hasError={hasErrors(workspace)} isLoading={isLoading(workspace)} height={120} width={120}/>
              <LoadingLine titleKey={'genericcomponent.loading.line.solution.current.title'} hasError={hasErrors(solution)} isLoading={isLoading(solution)} height={120} width={120}/>
          </FadeIn>
      </div>)
    : (<Routes authenticated={authenticated} authorized={authenticated} tabs={tabs}/>)
  );
};

Loading.propTypes = {
  classes: PropTypes.any,
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  tabs: PropTypes.array.isRequired,
  scenarioList: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  solution: PropTypes.object.isRequired,
  datasetList: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
  getAllInitialDataAction: PropTypes.func.isRequired,
  setApplicationStatusAction: PropTypes.func.isRequired
};

export default withStyles(useStyles)(Loading);
