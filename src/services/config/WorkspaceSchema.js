// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { z } from 'zod';
import { SchemasUtils } from '../../utils/schemas/SchemasUtils';
import { CUSTOM_WEB_APP_OPTIONS } from '../../utils/schemas/custom/customWorkspaceOptions';

const LABELS_DICT = z.array(z.object({}));
const TWINGRAPH_INDICATOR = z.object({ id: z.string(), name: LABELS_DICT, queryId: z.string() }).strict();

const powerBIFilters = z
  .array(
    z
      .object({
        table: z.string().optional().nullable(),
        column: z.string().optional().nullable(),
        values: z.string().optional().nullable().or(z.array(z.string().optional().nullable()).optional().nullable()),
      })
      .strict()
      .optional()
      .nullable()
  )
  .optional()
  .nullable();

const dashboardReport = z
  .object({
    title: z.object({}).optional().nullable(),
    reportId: z.string().optional().nullable(),
    settings: z
      .object({
        navContentPaneEnabled: z.boolean().optional().nullable(),
        panes: z
          .object({
            filters: z
              .object({
                expanded: z.boolean().optional().nullable(),
                visible: z.boolean().optional().nullable(),
              })
              .strict()
              .optional()
              .nullable(),
          })
          .strict()
          .optional()
          .nullable(),
      })
      .strict()
      .optional()
      .nullable(),
    dynamicFilters: powerBIFilters,
    staticFilters: powerBIFilters,
    pageName: z.object({}).optional().nullable(),
  })
  .strict()
  .optional()
  .nullable();

const nativeDatasourceParameterOptions = {
  defaultValue: z.string().optional().nullable(),
  tooltipText: z.object({}).optional().nullable(),
};

const basicWebAppOptions = z.object({
  datasetFilter: z.array(z.string().optional().nullable()).optional().nullable(),
  disableOutOfSyncWarningBanner: z.boolean().optional().nullable(),
  charts: z
    .object({
      workspaceId: z.string().optional().nullable(),
      logInWithUserCredentials: z.boolean().optional().nullable(),
      scenarioViewIframeDisplayRatio: z.number().optional().nullable(),
      dashboardsViewIframeDisplayRatio: z.number().optional().nullable(),
      dashboardsView: z.array(dashboardReport).optional().nullable(),
      scenarioView: z
        .array(dashboardReport)
        .optional()
        .nullable()
        .or(z.object({}).catchall(dashboardReport).optional().nullable()),
    })
    .strict()
    .optional()
    .nullable(),
  instanceView: z
    .object({
      dataSource: z
        .object({
          type: z.string().optional().nullable(),
          functionUrl: z.string().optional().nullable(),
          functionKey: z.string().optional().nullable(),
        })
        .strict()
        .optional()
        .nullable(),
      dataContent: z
        .object({
          compounds: z.object({}).optional().nullable(),
          edges: z.object({}).optional().nullable(),
          nodes: z.object({}).optional().nullable(),
        })
        .strict()
        .optional()
        .nullable(),
    })
    .strict()
    .optional()
    .nullable(),
  menu: z
    .object({
      documentationUrl: z.string().optional().nullable(),
      supportUrl: z.string().optional().nullable(),
      organizationUrl: z.string().optional().nullable(),
    })
    .strict()
    .optional()
    .nullable(),
  datasetManager: z
    .object({
      datasourceParameterHelpers: z
        .array(
          z
            .object({
              id: z.string().optional(),
              parameters: z
                .object({ id: z.string().optional(), ...nativeDatasourceParameterOptions })
                .strict()
                .required(),
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
            .object({
              id: z.string(),
              name: LABELS_DICT,
              type: z.string().optional().nullable(),
              description: LABELS_DICT,
              kpis: z.array(TWINGRAPH_INDICATOR).optional().nullable(),
              attributes: z.array(z.string().optional()).optional().nullable(),
            })
            .strict()
            .required()
        )
        .optional()
        .nullable(),
      queries: z
        .array(z.object({ id: z.string(), query: z.string() }).strict())
        .optional()
        .nullable(),
    })
    .strict()
    .optional()
    .nullable(),
});

const webAppOptions = SchemasUtils.patchConfigWithCustomOptions(basicWebAppOptions, CUSTOM_WEB_APP_OPTIONS);

export const WorkspaceSchema = z
  .object({
    id: z.string().optional().nullable(),
    organizationId: z.string().optional().nullable(),
    key: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    version: z.string().optional().nullable(),
    tags: z.array(z.string().optional().nullable()).optional().nullable(),
    ownerId: z.string().optional().nullable(),
    solution: z
      .object({
        solutionId: z.string().optional().nullable(),
        runTemplateFilter: z.array(z.string().optional().nullable()).optional().nullable(),
        defaultRunTemplateDataset: z.object({}).optional().nullable(),
      })
      .strict()
      .optional()
      .nullable(),
    linkedDatasetIdList: z.array(z.string().optional().nullable()).optional().nullable(),
    webApp: z
      .object({
        url: z.string().optional().nullable(),
        iframes: z.object({}).optional().nullable(),
        options: webAppOptions,
      })
      .strict()
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
      .object({
        default: z.string().optional().nullable(),
        currentUserPermissions: z.array(z.string().optional().nullable()).optional().nullable(),
        accessControlList: z
          .array(
            z
              .object({ id: z.string().optional().nullable(), role: z.string().optional().nullable() })
              .strict()
              .optional()
              .nullable()
          )
          .optional()
          .nullable(),
      })
      .strict()
      .optional()
      .nullable(),
    users: z.array(z.string().optional().nullable()).optional().nullable(),
    indicators: z.record(z.string(), z.array(z.string().optional().nullable()).optional().nullable()),
    queriesMapping: z.record(z.string(), z.array(z.string().optional().nullable()).optional().nullable()),
  })
  .strict()
  .optional()
  .nullable();
