// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { z } from 'zod';
import { SchemasUtils } from '../../utils/schemas/SchemasUtils';
import {
  CUSTOM_PARAMETER_GROUPS_OPTIONS,
  CUSTOM_SCENARIO_PARAMETERS_OPTIONS,
} from '../../utils/schemas/custom/customSolutionOptions';

z.config({ jitless: true });

const SOLUTION_EDIT_INFO_TYPE = z.strictObject({ timestamp: z.number().optional().nullable(), userId: z.string() });

const basicColumnField = z
  .strictObject({
    field: z.string().optional().nullable(),
    headerName: z.string().optional().nullable(),
    children: z.lazy(() => basicColumnField.array().optional().nullable()),
    type: z.array(z.string().optional().nullable()).optional().nullable(),
    minValue: z.unknown().optional(),
    maxValue: z.unknown().optional(),
    acceptsEmptyFields: z.boolean().optional().nullable(),
    enumValues: z.array(z.string().optional().nullable()).optional().nullable(),
    columnGroupShow: z.string().optional().nullable(),
    defaultValue: z.string().optional().nullable(),
  })
  .optional()
  .nullable();

const basicParameterOptions = z.strictObject({
  enumValues: z
    .array(
      z
        .strictObject({ key: z.string(), value: z.string(), tooltipText: z.looseObject({}).optional().nullable() })
        .optional()
        .nullable()
    )
    .optional()
    .nullable(),
  dynamicEnumValues: z
    .strictObject({ type: z.string().optional().nullable(), query: z.string(), resultKey: z.string() })
    .optional()
    .nullable(),
  tooltipText: z.looseObject({}).optional().nullable(),
  minLength: z.number().optional().nullable(),
  maxLength: z.number().optional().nullable(),
  validation: z.string().optional().nullable(),
  subType: z.string().optional().nullable(),
  dynamicValues: z
    .strictObject({ type: z.string().optional().nullable(), query: z.string(), resultKey: z.string() })
    .optional()
    .nullable(),
  hidden: z.boolean().optional().nullable(),
  description: z.string().optional().nullable(),
  defaultFileTypeFilter: z.string().optional().nullable(),
  canChangeRowsNumber: z.boolean().optional().nullable(),
  dateFormat: z.string().optional().nullable(),
  columns: z.array(basicColumnField).optional().nullable(),
  shouldRenameFileOnUpload: z.string().optional().nullable(),
  runTemplateFilter: z.array(z.string().optional().nullable()).optional().nullable(),
});

const basicParameterGroupOptions = z.strictObject({
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
  .strictObject({
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
    createInfo: SOLUTION_EDIT_INFO_TYPE,
    updateInfo: SOLUTION_EDIT_INFO_TYPE,
    parameters: z
      .array(
        z
          .strictObject({
            id: z.string().optional().nullable(),
            description: z.string().optional().nullable(),
            labels: z.looseObject({}).optional().nullable(),
            varType: z.string().optional().nullable(),
            defaultValue: z.unknown().optional(),
            minValue: z.unknown().optional(),
            maxValue: z.unknown().optional(),
            regexValidation: z.string().optional().nullable(),
            additionalData: parameterOptions,
          })
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
    parameterGroups: z
      .array(
        z
          .strictObject({
            id: z.string().optional().nullable(),
            description: z.string().optional().nullable(),
            labels: z.looseObject({}).optional().nullable(),
            isTable: z.string().optional().nullable(),
            additionalData: parameterGroupOptions,
            parentId: z.string().optional().nullable(),
            parameters: z.array(z.string().optional().nullable()).optional().nullable(),
          })
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
    runTemplates: z
      .array(
        z
          .strictObject({
            id: z.string().optional().nullable(),
            name: z.string().optional().nullable(),
            labels: z.looseObject({}).optional().nullable(),
            description: z.string().optional().nullable(),
            csmSimulation: z.string().optional().nullable(),
            tags: z.array(z.string().optional().nullable()).optional().nullable(),
            computeSize: z.string().optional().nullable(),
            runSizing: z
              .strictObject({
                requests: z
                  .strictObject({ cpu: z.string().optional().nullable(), memory: z.string().optional().nullable() })
                  .optional()
                  .nullable(),
                limits: z
                  .strictObject({ cpu: z.string().optional().nullable(), memory: z.string().optional().nullable() })
                  .optional()
                  .nullable(),
              })
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
            parametersHandlerSource: z.looseObject({}).optional().nullable(),
            datasetValidatorSource: z.looseObject({}).optional().nullable(),
            preRunSource: z.looseObject({}).optional().nullable(),
            runSource: z.looseObject({}).optional().nullable(),
            postRunSource: z.looseObject({}).optional().nullable(),
            scenariodataTransformSource: z.looseObject({}).optional().nullable(),
            parameterGroups: z.array(z.string().optional().nullable()).optional().nullable(),
            stackSteps: z.boolean().optional().nullable(),
            gitRepositoryUrl: z.string().optional().nullable(),
            gitBranchName: z.string().optional().nullable(),
            orchestratorType: z.string().optional().nullable(),
            runTemplateSourceDir: z.string().optional().nullable(),
            executionTimeout: z.number().optional().nullable(),
            deleteHistoricalData: z
              .strictObject({
                enable: z.boolean().optional().nullable(),
                pollFrequency: z.number().optional().nullable(),
                timeOut: z.number().optional().nullable(),
              })
              .optional()
              .nullable(),
          })
          .optional()
          .nullable()
      )
      .optional()
      .nullable(),
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
  })
  .optional()
  .nullable();
