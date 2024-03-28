// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DATASET_SOURCES } from '../../../../../../services/config/ApiConstants';
import { useDataSourceRunTemplates, useSolutionData } from '../../../../../../state/hooks/SolutionHooks';
import { TranslationUtils, ConfigUtils } from '../../../../../../utils';

export const useDatasetCreationParameters = () => {
  const solutionData = useSolutionData();
  const customDataSourceRunTemplates = useDataSourceRunTemplates();
  const { t } = useTranslation();

  const dataSourceRunTemplates = useMemo(() => {
    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;
    const dataSourcesWithParameters = customDataSourceRunTemplates.map((dataSource) => ({
      ...dataSource,
      parameters: parameters.filter((parameter) => runTemplatesParameters[dataSource.id].includes(parameter.id)),
    }));

    const runTemplates = {};
    [...DATASET_SOURCES, ...dataSourcesWithParameters].forEach(
      (runTemplate) => (runTemplates[runTemplate.id] = runTemplate)
    );
    return runTemplates;
  }, [customDataSourceRunTemplates, solutionData.parameters, solutionData.runTemplatesParametersIdsDict]);

  const dataSourceTypeEnumValues = useMemo(
    () =>
      Object.values(dataSourceRunTemplates).map((dataSource) => ({
        key: dataSource.id,
        value: t(
          TranslationUtils.getRunTemplateTranslationKey(dataSource.id),
          dataSource.label ?? dataSource.name ?? dataSource.id
        ),
      })),
    [t, dataSourceRunTemplates]
  );

  const getParameterById = useCallback(
    (parameterId) => {
      for (const dataSource of Object.values(dataSourceRunTemplates)) {
        const parameter = dataSource.parameters?.find((parameter) => parameter.id === parameterId);
        if (parameter != null) return parameter;
      }
    },
    [dataSourceRunTemplates]
  );

  const getParameterEnumValues = useCallback(
    (parameterId) => {
      const rawEnumValues = ConfigUtils.getParameterAttribute(getParameterById(parameterId), 'enumValues') ?? [];
      return rawEnumValues.map((enumValue) => {
        const valueTranslationKey = TranslationUtils.getParameterEnumValueTranslationKey(parameterId, enumValue.key);
        const tooltipTranslationKey = TranslationUtils.getParameterEnumValueTooltipTranslationKey(
          parameterId,
          enumValue.key
        );
        return {
          key: enumValue.key,
          value: t(valueTranslationKey, enumValue.value),
          tooltip: t(tooltipTranslationKey, ''),
        };
      });
    },
    [t, getParameterById]
  );

  const getUploadFileLabels = useCallback(
    (parameterId) => {
      return {
        button: t('genericcomponent.uploadfile.button.browse'),
        invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
        label: t(TranslationUtils.getParameterTranslationKey(parameterId), parameterId),
        delete: t('genericcomponent.uploadfile.tooltip.delete'),
        noFileMessage: t('genericcomponent.uploadfile.noFileMessage', 'None'),
        getFileNamePlaceholder: (fileExtension) =>
          t('genericcomponent.uploadfile.fileNamePlaceholder', '{{fileExtension}} file', { fileExtension }),
      };
    },
    [t]
  );

  const getDefaultFileTypeFilter = useCallback(
    (parameterId) => getParameterById(parameterId)?.options?.defaultFileTypeFilter,
    [getParameterById]
  );

  return {
    dataSourceRunTemplates,
    getParameterEnumValues,
    dataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
  };
};
