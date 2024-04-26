// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useWorkspaceData } from '../../../../../../state/hooks/WorkspaceHooks';
import { TranslationUtils } from '../../../../../../utils';

export const useDatasetCreationParameters = () => {
  const { t } = useTranslation();
  const workspace = useWorkspaceData();

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

  const getUploadFileLabels = useCallback(
    (parameterId, idForTranslationKey) => {
      return {
        button: t('genericcomponent.uploadfile.button.browse'),
        invalidFileMessage: t('genericcomponent.uploadfile.tooltip.isvalidfile'),
        label: t(TranslationUtils.getParameterTranslationKey(idForTranslationKey ?? parameterId), parameterId),
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

  const datasourceParameterHelpers = useMemo(
    () => workspace?.webApp?.options?.datasetManager?.datasourceParameterHelpers,
    [workspace?.webApp?.options?.datasetManager?.datasourceParameterHelpers]
  );

  return {
    datasourceParameterHelpers,
    getDataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
  };
};
