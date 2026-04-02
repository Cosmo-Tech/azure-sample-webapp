// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { createContext, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const ScenarioOverrideContext = createContext(null);

export const ScenarioOverrideProvider = ({ scenarioData, scenarioRun, children }) => {
  const value = useMemo(
    () =>
      scenarioData
        ? {
            data: scenarioData,
            id: scenarioData.id,
            run: scenarioRun ?? null,
          }
        : null,
    [scenarioData, scenarioRun]
  );

  return <ScenarioOverrideContext.Provider value={value}>{children}</ScenarioOverrideContext.Provider>;
};

ScenarioOverrideProvider.propTypes = {
  scenarioData: PropTypes.object,
  scenarioRun: PropTypes.object,
  children: PropTypes.node.isRequired,
};

export const useScenarioOverride = () => {
  return useContext(ScenarioOverrideContext);
};
