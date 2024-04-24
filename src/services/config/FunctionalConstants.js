// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Duration of inactivity after which users are automatically logged out (minutes)
export const SESSION_INACTIVITY_TIMEOUT = 30;

// Polling delay to update running scenario status (milliseconds)
export const SCENARIO_STATUS_POLLING_DELAY = 10000;
export const POLLING_START_DELAY = 5000;

// Polling delay to update Power BI information (milliseconds)
export const POWER_BI_INFO_POLLING_DELAY = 10000;

// Polling delay to update twingraph status (milliseconds)
export const TWINGRAPH_STATUS_POLLING_DELAY = 10000;

export const TWINGRAPH_QUERIES_DELAY = 250; // Delay between first queries to prevent API overload (milliseconds)
export const TWINGRAPH_QUERY_MAX_RETRIES = 5; // Max number of retries when querying a dataset twingraph
export const TWINGRAPH_QUERY_RETRY_DELAY = 500; // Delay between retrying when a query has failed (milliseconds)

// Type of logs to download for a scenario run (SIMPLE_LOGS or CUMULATED_LOGS)
export const SCENARIO_RUN_LOG_TYPE = 'CUMULATED_LOGS';
