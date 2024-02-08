// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import applicationInsights from '../config/ApplicationInsights.json';
import globalConfiguration from '../config/GlobalConfiguration.json';
import helpMenuConfiguration from '../config/HelpMenuConfiguration.json';
import languages from '../config/Languages.json';

const _initialized = false;
const parametersValues = {};

const loadParametersValues = () => {
  const configsToLoad = [applicationInsights, globalConfiguration, helpMenuConfiguration, languages];

  configsToLoad.forEach((config) => {
    Object.entries(config).forEach(([parameterName, parameterValue]) => {
      if (parametersValues[parameterName] !== undefined) {
        throw new Error(`Error: configuration parameter ${parameterName} is declared twice.`);
      }
      const envVarName = `REACT_APP_${parameterName}`;
      parametersValues[parameterName] = process.env[envVarName] ?? parameterValue;
    });
  });
};

const getParameterValue = (parameterName) => parametersValues[parameterName];

const ConfigService = {
  getParameterValue,
};

if (!_initialized) loadParametersValues();

export default ConfigService;
