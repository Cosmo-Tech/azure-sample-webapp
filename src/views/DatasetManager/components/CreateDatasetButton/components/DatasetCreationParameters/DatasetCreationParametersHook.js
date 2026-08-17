// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useApplicationTheme } from '../../../../../../state/app/hooks';
import { useWorkspaceData } from '../../../../../../state/workspaces/hooks';
import { TranslationUtils } from '../../../../../../utils';

export const useDatasetCreationParameters = () => {
  const { t } = useTranslation();
  const { isDarkTheme } = useApplicationTheme();
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

  const datasourceParameterHelpers = useMemo(
    () => workspace?.additionalData?.webapp?.datasetManager?.datasourceParameterHelpers,
    [workspace?.additionalData?.webapp?.datasetManager?.datasourceParameterHelpers]
  );

  return {
    datasourceParameterHelpers,
    getDataSourceTypeEnumValues,
    isDarkTheme,
  };
};
