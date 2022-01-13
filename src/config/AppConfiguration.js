// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// App translation configuration
export const LANGUAGES = {
  en: 'English',
  fr: 'Français',
};
export const FALLBACK_LANGUAGE = 'en'; // Language used if detection fails

// Polling delay to update running scenario status (milliseconds)
export const SCENARIO_STATUS_POLLING_DELAY = 10000;

// Polling delay to update Power BI information (milliseconds)
export const POWER_BI_INFO_POLLING_DELAY = 10000;

// Type of logs to download for a scenario run (SIMPLE_LOGS or CUMULATED_LOGS)
export const SCENARIO_RUN_LOG_TYPE = 'CUMULATED_LOGS';

// Whether to enable Application Insights events tracking
export const ENABLE_APPLICATION_INSIGHTS = true;

// Support page url
export const SUPPORT_URL = 'https://support.cosmotech.com';

// Cosmotech website url
export const COSMOTECH_URL = 'https://cosmotech.com';

// Documentation url
export const DOCUMENTATION_URL = 'doc.pdf';

// Additional parameters to put in scenario parameters
export const ADD_SCENARIO_NAME_PARAMETER = false;
export const ADD_SCENARIO_ID_PARAMETER = false;
export const ADD_SCENARIO_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_ID_PARAMETER = false;
export const ADD_SCENARIO_PARENT_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_ID_PARAMETER = false;
export const ADD_SCENARIO_MASTER_LAST_RUN_ID_PARAMETER = false;
export const ADD_SCENARIO_RUN_TEMPLATE_NAME_PARAMETER = false;

// Power BI
export const USE_POWER_BI_WITH_USER_CREDENTIALS = false;
