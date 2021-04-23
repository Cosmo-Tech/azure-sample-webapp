// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import Routes from '../../Routes'
import FadeIn from 'react-fade-in'
import LoadingLine from '../../components/LoadingLine'
import { SCENARIO_STATUS } from '../../state/commons/ScenarioConstants'
import { APPLICATION_STATUS } from '../../state/commons/ApplicationConstants'

const Loading = (
  {
    authenticated,
    authorized,
    tabs,
    scenarioList,
    scenarioTree,
    application,
    getAllInitialDataAction,
    setApplicationStatusAction
  }) => {
  useEffect(() => {
    if (authenticated) {
      getAllInitialDataAction()
    } else {
      setApplicationStatusAction(APPLICATION_STATUS.IDLE)
    }
  }, [authenticated, getAllInitialDataAction, setApplicationStatusAction])

  const isLoading = (entityStatus) => {
    return entityStatus.status !== SCENARIO_STATUS.ERROR && (entityStatus.status === SCENARIO_STATUS.LOADING || entityStatus.status === SCENARIO_STATUS.IDLE)
  }

  const hasErrors = (entityStatus) => entityStatus.status === SCENARIO_STATUS.ERROR

  return (authenticated && application.status !== APPLICATION_STATUS.READY
    ? (<div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)'
      }} data-cy="loading-component">
          <FadeIn delay={200}>
            <LoadingLine titleKey={'genericcomponent.loading.line.scenario.list.title'} hasError={hasErrors(scenarioList)} isLoading={isLoading(scenarioList)} height={120} width={120}/>
            <LoadingLine titleKey={'genericcomponent.loading.line.scenario.tree.title'} hasError={hasErrors(scenarioTree)} isLoading={isLoading(scenarioTree)} height={120} width={120}/>
          </FadeIn>
      </div>)
    : (<Routes authenticated={authenticated} authorized={authenticated} tabs={tabs}/>)
  )
}

Loading.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  authorized: PropTypes.bool.isRequired,
  tabs: PropTypes.array.isRequired,
  scenarioList: PropTypes.object.isRequired,
  scenarioTree: PropTypes.object.isRequired,
  application: PropTypes.object.isRequired,
  getAllInitialDataAction: PropTypes.func.isRequired,
  setApplicationStatusAction: PropTypes.func.isRequired
}

export default Loading
