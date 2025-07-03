// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSimulationView } from './SimulationViewHook';

const SimulationViewContext = createContext(null);

export const SimulationViewProvider = ({ children }) => {
  const context = useSimulationView();
  return <SimulationViewContext.Provider value={context}>{children}</SimulationViewContext.Provider>;
};

SimulationViewProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useSimulationViewContext = () => {
  const context = useContext(SimulationViewContext);
  if (!context) {
    throw new Error('useSimulationViewContext must be used within a SimulationViewProvider');
  }
  return context;
};
