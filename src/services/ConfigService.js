// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import globalConfiguration from '../config/GlobalConfiguration.json';
import helpMenuConfiguration from '../config/HelpMenuConfiguration.json';
import { ENV } from './config/EnvironmentVariables';

const _initialized = false;
const parametersValues = {};

const loadParametersValues = () => {
  const configsToLoad = [globalConfiguration, helpMenuConfiguration];

  configsToLoad.forEach((config) => {
    Object.entries(config).forEach(([parameterName, parameterValue]) => {
      if (parametersValues[parameterName] !== undefined) {
        throw new Error(`Error: configuration parameter ${parameterName} is declared twice.`);
      }
      const envVarName = `VITE_${parameterName}`;
      parametersValues[parameterName] = ENV[envVarName] ?? parameterValue;
    });
  });
};

const getParameterValue = (parameterName) =>
  window?.publicWebappConfig?.[parameterName] ?? parametersValues[parameterName];

const ConfigService = {
  getParameterValue,
};

if (!_initialized) loadParametersValues();

export default ConfigService;
