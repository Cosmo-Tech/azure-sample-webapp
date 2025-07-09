// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import React, { useContext } from 'react';

export const ScenarioResetValuesContext = React.createContext();
export const useScenarioResetValues = () => {
  return useContext(ScenarioResetValuesContext);
};
