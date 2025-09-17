// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { z } from 'zod';
import { SchemasUtils } from '../../utils/schemas/SchemasUtils';
import { CUSTOM_WEB_APP_OPTIONS } from '../../utils/schemas/custom/customWorkspaceOptions';

const LABELS_DICT = z.array(z.looseObject({}));
const TWINGRAPH_INDICATOR = z.strictObject({ id: z.string(), name: LABELS_DICT, queryId: z.string() });

const powerBIFilters = z
  .array(
    z
      .strictObject({
        table: z.string().optional().nullable(),
        column: z.string().optional().nullable(),
        values: z.string().optional().nullable().or(z.array(z.string().optional().nullable()).optional().nullable()),
      })
      .optional()
      .nullable()
  )
  .optional()
  .nullable();

const dashboardReport = z
  .strictObject({
    title: z.looseObject({}).optional().nullable(),
    reportId: z.string().optional().nullable(),
    settings: z
      .strictObject({
        navContentPaneEnabled: z.boolean().optional().nullable(),
        panes: z
          .strictObject({
            filters: z
              .strictObject({
                expanded: z.boolean().optional().nullable(),
                visible: z.boolean().optional().nullable(),
              })
              .optional()
              .nullable(),
          })
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
    dynamicFilters: powerBIFilters,
    staticFilters: powerBIFilters,
    pageName: z.looseObject({}).optional().nullable(),
  })
  .optional()
  .nullable();

const nativeDatasourceParameterOptions = {
  defaultValue: z.string().optional().nullable(),
  tooltipText: z.looseObject({}).optional().nullable(),
};

const basicWebAppOptions = z.strictObject({
  datasetFilter: z.array(z.string().optional().nullable()).optional().nullable(),
  disableOutOfSyncWarningBanner: z.boolean().optional().nullable(),
  charts: z
    .strictObject({
      workspaceId: z.string().optional().nullable(),
      logInWithUserCredentials: z.boolean().optional().nullable(),
      scenarioViewIframeDisplayRatio: z.number().optional().nullable(),
      dashboardsViewIframeDisplayRatio: z.number().optional().nullable(),
      dashboardsView: z.array(dashboardReport).optional().nullable(),
      scenarioView: z
        .array(dashboardReport)
        .optional()
        .nullable()
        .or(z.strictObject({}).catchall(dashboardReport).optional().nullable()),
    })
    .optional()
    .nullable(),
  instanceView: z
    .strictObject({
      dataSource: z
        .strictObject({
          type: z.string().optional().nullable(),
          functionUrl: z.string().optional().nullable(),
          functionKey: z.string().optional().nullable(),
        })
        .optional()
        .nullable(),
      dataContent: z
        .strictObject({
          compounds: z.looseObject({}).optional().nullable(),
          edges: z.looseObject({}).optional().nullable(),
          nodes: z.looseObject({}).optional().nullable(),
        })
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
  menu: z
    .strictObject({
      documentationUrl: z.string().optional().nullable(),
      supportUrl: z.string().optional().nullable(),
      organizationUrl: z.string().optional().nullable(),
    })
    .optional()
    .nullable(),
  datasetManager: z
    .strictObject({
      datasourceParameterHelpers: z
        .array(
          z
            .strictObject({
              id: z.string().optional(),
              parameters: z.strictObject({ id: z.string().optional(), ...nativeDatasourceParameterOptions }).required(),
            })
            .optional()
            .nullable()
        )
        .optional()
        .nullable(),
      datasourceFilter: z.array(z.string().optional()).optional().nullable(),
      subdatasourceFilter: z.array(z.string().optional()).optional().nullable(),
      graphIndicators: z.array(TWINGRAPH_INDICATOR).optional().nullable(),
      categories: z
        .array(
          z
            .strictObject({
              id: z.string(),
              name: LABELS_DICT,
              type: z.string().optional().nullable(),
              description: LABELS_DICT,
              kpis: z.array(TWINGRAPH_INDICATOR).optional().nullable(),
              attributes: z.array(z.string().optional()).optional().nullable(),
              previewTable: z
                .strictObject({
                  columns: z.array(
                    z.strictObject({ field: z.string(), headerName: z.string(), type: z.array(z.string()) })
                  ),
                  queryId: z.string(),
                  resultKey: z.string(),
                })
                .optional()
                .nullable(),
            })
            .required()
        )
        .optional()
        .nullable(),
      queries: z
        .array(z.strictObject({ id: z.string(), query: z.string() }))
        .optional()
        .nullable(),
    })
    .optional()
    .nullable(),
});

const webAppOptions = SchemasUtils.patchConfigWithCustomOptions(basicWebAppOptions, CUSTOM_WEB_APP_OPTIONS);

export const WorkspaceSchema = z
  .strictObject({
    id: z.string().optional().nullable(),
    organizationId: z.string().optional().nullable(),
    key: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    version: z.string().optional().nullable(),
    tags: z.array(z.string().optional().nullable()).optional().nullable(),
    ownerId: z.string().optional().nullable(),
    solution: z
      .strictObject({
        solutionId: z.string().optional().nullable(),
        runTemplateFilter: z.array(z.string().optional().nullable()).optional().nullable(),
        defaultRunTemplateDataset: z.looseObject({}).optional().nullable(),
      })
      .optional()
      .nullable(),
    linkedDatasetIdList: z.array(z.string().optional().nullable()).optional().nullable(),
    webApp: z
      .strictObject({
        url: z.string().optional().nullable(),
        iframes: z.looseObject({}).optional().nullable(),
        options: webAppOptions,
      })
      .optional()
      .nullable(),
    sendInputToDataWarehouse: z.boolean().optional().nullable(),
    useDedicatedEventHubNamespace: z.boolean().optional().nullable(),
    dedicatedEventHubSasKeyName: z.string().optional().nullable(),
    dedicatedEventHubAuthenticationStrategy: z.string().optional().nullable(),
    sendScenarioRunToEventHub: z.boolean().optional().nullable(),
    sendScenarioMetadataToEventHub: z.boolean().optional().nullable(),
    datasetCopy: z.boolean().optional().nullable(),
    security: z
      .strictObject({
        default: z.string().optional().nullable(),
        currentUserPermissions: z.array(z.string().optional().nullable()).optional().nullable(),
        accessControlList: z
          .array(
            z
              .strictObject({ id: z.string().optional().nullable(), role: z.string().optional().nullable() })
              .optional()
              .nullable()
          )
          .optional()
          .nullable(),
      })
      .optional()
      .nullable(),
    users: z.array(z.string().optional().nullable()).optional().nullable(),
    indicators: z.record(z.string(), z.array(z.string().optional().nullable()).optional().nullable()),
    queriesMapping: z.record(z.string(), z.array(z.string().optional().nullable()).optional().nullable()),
  })
  .optional()
  .nullable();
