// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { z } from 'zod';
import { SchemasUtils } from '../../utils/schemas/SchemasUtils';
import {
  CUSTOM_PARAMETER_GROUPS_OPTIONS,
  CUSTOM_SCENARIO_PARAMETERS_OPTIONS,
} from '../../utils/schemas/custom/customSolutionOptions';

const basicColumnField = z
  .object({
    field: z.string().optional().nullable(),
    headerName: z.string().optional().nullable(),
    children: z.lazy(() => basicColumnField.array().optional().nullable()),
    type: z.array(z.string().optional().nullable()).optional().nullable(),
    minValue: z.unknown().optional(),
    maxValue: z.unknown().optional(),
    acceptsEmptyFields: z.boolean().optional().nullable(),
    enumValues: z.array(z.string().optional().nullable()).optional().nullable(),
    columnGroupShow: z.string().optional().nullable(),
  })
  .strict()
  .optional()
  .nullable();

const basicParameterOptions = z.object({
  enumValues: z
    .array(
      z
        .object({ key: z.string(), value: z.string(), tooltipText: z.object({}).optional().nullable() })
        .strict()
        .optional()
        .nullable()
    )
    .optional()
    .nullable(),
  dynamicEnumValues: z
    .object({ type: z.string().optional().nullable(), query: z.string(), resultKey: z.string() })
    .strict()
    .optional()
    .nullable(),
  tooltipText: z.object({}).optional().nullable(),
  minLength: z.number().optional().nullable(),
  maxLength: z.number().optional().nullable(),
  validation: z.string().optional().nullable(),
  subType: z.string().optional().nullable(),
  hidden: z.boolean().optional().nullable(),
  connectorId: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  defaultFileTypeFilter: z.string().optional().nullable(),
  canChangeRowsNumber: z.boolean().optional().nullable(),
  dateFormat: z.string().optional().nullable(),
  columns: z.array(basicColumnField).optional().nullable(),
  shouldRenameFileOnUpload: z.string().optional().nullable(),
  runTemplateFilter: z.array(z.string().optional().nullable()).optional().nullable(),
});

const basicParameterGroupOptions = z.object({
  authorizedRoles: z.array(z.string().optional().nullable()).optional().nullable(),
  hideParameterGroupIfNoPermission: z.boolean().optional().nullable(),
  hidden: z.boolean().optional().nullable(),
});

const parameterOptions = SchemasUtils.patchConfigWithCustomOptions(
  basicParameterOptions,
  CUSTOM_SCENARIO_PARAMETERS_OPTIONS
);

const parameterGroupOptions = SchemasUtils.patchConfigWithCustomOptions(
  basicParameterGroupOptions,
  CUSTOM_PARAMETER_GROUPS_OPTIONS
);

export const SolutionSchema = z
  .object({
    id: z.string().optional().nullable(),
    organizationId: z.string().optional().nullable(),
    key: z.string().optional().nullable(),
    name: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    repository: z.string().optional().nullable(),
    alwaysPull: z.boolean().optional().nullable(),
    csmSimulator: z.string().optional().nullable(),
    version: z.string().optional().nullable(),
    ownerId: z.string().optional().nullable(),
    sdkVersion: z.string().optional().nullable(),
    url: z.string().optional().nullable(),
    tags: z.array(z.string().optional().nullable()).optional().nullable(),
    parameters: z
      .array(
        z
          .object({
            id: z.string().optional().nullable(),
            labels: z.object({}).optional().nullable(),
            varType: z.string().optional().nullable(),
            defaultValue: z.unknown().optional(),
            minValue: z.unknown().optional(),
            maxValue: z.unknown().optional(),
            regexValidation: z.string().optional().nullable(),
            options: parameterOptions,
          })
          .strict()
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
    parameterGroups: z
      .array(
        z
          .object({
            id: z.string().optional().nullable(),
            labels: z.object({}).optional().nullable(),
            isTable: z.string().optional().nullable(),
            options: parameterGroupOptions,
            parentId: z.string().optional().nullable(),
            parameters: z.array(z.string().optional().nullable()).optional().nullable(),
          })
          .strict()
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
    runTemplates: z
      .array(
        z
          .object({
            id: z.string().optional().nullable(),
            name: z.string().optional().nullable(),
            labels: z.array(z.object({}).optional().nullable()).optional().nullable(),
            description: z.string().optional().nullable(),
            csmSimulation: z.string().optional().nullable(),
            tags: z.array(z.string().optional().nullable()).optional().nullable(),
            computeSize: z.string().optional().nullable(),
            runSizing: z
              .object({
                requests: z
                  .object({ cpu: z.string().optional().nullable(), memory: z.string().optional().nullable() })
                  .strict()
                  .optional()
                  .nullable(),
                limits: z
                  .object({ cpu: z.string().optional().nullable(), memory: z.string().optional().nullable() })
                  .strict()
                  .optional()
                  .nullable(),
              })
              .strict()
              .optional()
              .nullable(),
            noDataIngestionState: z.boolean().optional().nullable(),
            fetchDatasets: z.boolean().optional().nullable(),
            scenarioDataDownloadTransform: z.boolean().optional().nullable(),
            fetchScenarioParameters: z.boolean().optional().nullable(),
            applyParameters: z.boolean().optional().nullable(),
            validateData: z.boolean().optional().nullable(),
            sendDatasetsToDataWarehouse: z.boolean().optional().nullable(),
            sendInputParametersToDataWarehouse: z.boolean().optional().nullable(),
            preRun: z.boolean().optional().nullable(),
            run: z.boolean().optional().nullable(),
            postRun: z.boolean().optional().nullable(),
            parametersJson: z.boolean().optional().nullable(),
            parametersHandlerSource: z.object({}).optional().nullable(),
            datasetValidatorSource: z.object({}).optional().nullable(),
            preRunSource: z.object({}).optional().nullable(),
            runSource: z.object({}).optional().nullable(),
            postRunSource: z.object({}).optional().nullable(),
            scenariodataTransformSource: z.object({}).optional().nullable(),
            parameterGroups: z.array(z.string().optional().nullable()).optional().nullable(),
            stackSteps: z.boolean().optional().nullable(),
            gitRepositoryUrl: z.string().optional().nullable(),
            gitBranchName: z.string().optional().nullable(),
            orchestratorType: z.string().optional().nullable(),
            runTemplateSourceDir: z.string().optional().nullable(),
            executionTimeout: z.number().optional().nullable(),
            deleteHistoricalData: z
              .object({
                enable: z.boolean().optional().nullable(),
                pollFrequency: z.number().optional().nullable(),
                timeOut: z.number().optional().nullable(),
              })
              .strict()
              .optional()
              .nullable(),
          })
          .strict()
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
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
  })
  .strict()
  .optional()
  .nullable();
