// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { TranslationUtils, ConfigUtils } from '../../../../../../utils';

export const useDatasetCreationParameters = () => {
  const { t } = useTranslation();

  const getDataSourceTypeEnumValues = useCallback(
    (dataSources) =>
      Object.values(dataSources).map((dataSource) => ({
        key: dataSource.id,
        value: t(
          TranslationUtils.getRunTemplateTranslationKey(dataSource.id),
          dataSource.label ?? dataSource.name ?? dataSource.id
        ),
      })),
    [t]
  );

  const getParameterById = useCallback((dataSources, parameterId) => {
    for (const dataSource of Object.values(dataSources)) {
      const parameter = dataSource.parameters?.find((parameter) => parameter.id === parameterId);
      if (parameter != null) return parameter;
    }
  }, []);

  const getParameterEnumValues = useCallback(
    (dataSources, parameterId) => {
      const rawEnumValues =
        ConfigUtils.getParameterAttribute(getParameterById(dataSources, parameterId), 'enumValues') ?? [];
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
    (dataSources, parameterId) => getParameterById(dataSources, parameterId)?.options?.defaultFileTypeFilter,
    [getParameterById]
  );

  return {
    getParameterEnumValues,
    getDataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
  };
};
