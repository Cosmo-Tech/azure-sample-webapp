// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { WORKSPACES } from '../config/overrides/Workspaces.js';
import { ArrayDictUtils } from './ArrayDictUtils';
import { SecurityUtils } from './SecurityUtils';
import { TranslationUtils } from './TranslationUtils';

const _getUserPermissionsForWorkspace = (workspace, userEmail, userId, permissionsMapping) => {
  if (workspace?.security == null || Object.keys(workspace?.security).length === 0) {
    console.warn(`No security data for workspace ${workspace?.id}, restricting access to its content`);
    return [];
  }
  return SecurityUtils.getUserPermissionsForResource(workspace.security, userEmail, permissionsMapping);
};

const patchWorkspaceWithCurrentUserPermissions = (workspace, userEmail, userId, permissionsMapping) => {
  // workspace.security seems to be read-only, we have to create a new object to add a "currentUserPermissions" key
  workspace.security = {
    ...workspace.security,
    currentUserPermissions: _getUserPermissionsForWorkspace(workspace, userEmail, userId, permissionsMapping),
  };
};

const patchWorkspacesIfLocalConfigExists = (originalWorkspaces) => {
  ArrayDictUtils.mergeArraysByElementsIds(originalWorkspaces, WORKSPACES);
};

const forgeDatasetManagerConfiguration = (config) => {
  if (config == null || !(config instanceof Object)) return;

  const { categories, graphIndicators } = config;
  if (
    (categories != null && !(categories instanceof Array)) ||
    (graphIndicators != null && !(graphIndicators instanceof Array))
  )
    return;

  const indicators = {
    graphIndicators: [],
    categoriesKpis: [],
  };
  graphIndicators?.forEach((kpi) => kpi && indicators.graphIndicators.push(kpi.id));
  categories?.forEach((category) => {
    category.kpis instanceof Array && category.kpis?.forEach((kpi) => kpi.id && indicators.categoriesKpis.push(kpi.id));
  });

  const queriesMapping = {};
  const addKpi = (kpi) => {
    if (kpi.id == null || kpi.queryId == null) return;
    if (queriesMapping[kpi.queryId] === undefined) queriesMapping[kpi.queryId] = [kpi.id];
    else queriesMapping[kpi.queryId].push(kpi.id);
  };
  graphIndicators?.forEach(addKpi);
  categories?.forEach((category) => category.kpis instanceof Array && category.kpis?.forEach(addKpi));
  return { indicators, queriesMapping };
};

const patchWorkspaceWithDatasetManagerConfiguration = (workspace) => {
  try {
    const config = forgeDatasetManagerConfiguration(workspace?.webApp?.options?.datasetManager);
    workspace.indicators = config?.indicators;
    workspace.queriesMapping = config?.queriesMapping;
  } catch (error) {
    console.warn('An error occurred while parsing the dataset manager queries. Data may be missing.');
    console.error(error);
  }
};

const checkDatasetManagerConfiguration = (workspace) => {
  const logWarning = (warning) => console.warn(`Dataset manager configuration: ${warning}`);
  const config = workspace?.webApp?.options?.datasetManager;
  if (config == null) return;
  if (!(config instanceof Object) || config instanceof Array) {
    logWarning('"datasetManager" must be an Object');
    return;
  }

  const { graphIndicators, categories, queries } = config;

  const isQueriesValid = queries instanceof Array;
  if (queries != null) {
    if (!isQueriesValid) logWarning('property "queries" must be an Array');
    else {
      const allQueriesIds = [];
      queries.forEach((query, index) => {
        if (query.id == null) logWarning(`in queries, item #${index} has no id`);
        else if (allQueriesIds.includes(query.id))
          logWarning(`in queries, item #${index} uses a query id that already exists (id: ${query.id}).`);
        else allQueriesIds.push(query.id);

        if (query.query == null) logWarning(`in queries, item #${index} (id: ${query?.id}) has no query statement`);
      });
    }
  }

  const allKpisIds = [];
  const checkKpisList = (kpis, propertyNameForWarnings) => {
    kpis.forEach((kpi, index) => {
      if (kpi.id == null) logWarning(`in ${propertyNameForWarnings}, item #${index} has no id`);
      else if (allKpisIds.includes(kpi.id))
        logWarning(`in ${propertyNameForWarnings}, item #${index} uses a KPI id that already exists (id: ${kpi.id}).`);
      else allKpisIds.push(kpi.id);

      if (kpi.queryId == null) {
        logWarning(`in ${propertyNameForWarnings}, item #${index} (id: ${kpi?.id}) has no queryId`);
      } else if (!isQueriesValid || queries.find((query) => query.id === kpi.queryId) === undefined) {
        logWarning(
          `in ${propertyNameForWarnings}, item #${index} (id: ${kpi?.id}) uses unknown query id "${kpi.queryId}". ` +
            'Make sure this query id is defined in "queries".'
        );
      }
    });
  };

  if (graphIndicators != null) {
    if (!(graphIndicators instanceof Array)) logWarning('property "graphIndicators" must be an Array');
    else checkKpisList(graphIndicators, 'graphIndicators');
  }

  if (categories != null) {
    if (!(categories instanceof Array)) logWarning('property "categories" must be an Array');
    else {
      categories.forEach((category, index) => {
        if (category.id == null) logWarning(`in categories, item #${index} has no id`);
        if (category.kpis != null) {
          if (!(category.kpis instanceof Array))
            logWarning(`property "kpis" in category item #${index} must be an Array`);
          else checkKpisList(category.kpis, 'categories kpis');
        }
      });
    }
  }
};

const addTranslationLabels = (workspace) => {
  try {
    TranslationUtils.addTranslationOfDatasetManagerLabels(workspace?.webApp?.options?.datasetManager ?? {});
  } catch (error) {
    console.warn(`An error occurred when loading labels from workspace "${workspace.name}" (id "${workspace.id}")`);
    console.error(error);
  }
};

export const WorkspacesUtils = {
  addTranslationLabels,
  checkDatasetManagerConfiguration,
  forgeDatasetManagerConfiguration,
  patchWorkspacesIfLocalConfigExists,
  patchWorkspaceWithCurrentUserPermissions,
  patchWorkspaceWithDatasetManagerConfiguration,
};
