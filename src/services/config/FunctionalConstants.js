// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Duration of inactivity after which users are automatically logged out (minutes)
export const SESSION_INACTIVITY_TIMEOUT = 30;

// Polling delay to update running scenario status (milliseconds)
export const RUNNER_STATUS_POLLING_DELAY = 10000;
export const POLLING_START_DELAY = 5000;
export const POLLING_MAX_CONSECUTIVE_NETWORK_ERRORS = 3;

// Polling delay to update Power BI information (milliseconds)
export const POWER_BI_INFO_POLLING_DELAY = 10000;

// Polling delay to update twingraph status (milliseconds)
export const TWINGRAPH_STATUS_POLLING_DELAY = 10000;

export const TWINGRAPH_QUERIES_DELAY = 250; // Delay between first queries to prevent API overload (milliseconds)
export const TWINGRAPH_QUERY_MAX_RETRIES = 5; // Max number of retries when querying a dataset twingraph
export const TWINGRAPH_QUERY_RETRY_DELAY = 500; // Delay between retrying when a query has failed (milliseconds)

// Size of a page of runners returned by back-end
export const RUNNERS_PAGE_COUNT = 5000;
