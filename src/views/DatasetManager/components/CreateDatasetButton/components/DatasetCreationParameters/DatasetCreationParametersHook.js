// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { DATASET_SOURCE_TYPE } from '../../../../../../services/config/ApiConstants';
import { useSolutionData } from '../../../../../../state/hooks/SolutionHooks';
import { TranslationUtils, ConfigUtils } from '../../../../../../utils';

export const useDatasetCreationParameters = () => {
  const solutionData = useSolutionData();
  const { t } = useTranslation();

  // Each parameter must have a id strictly unique.
  const hardCodedDataSources = useMemo(() => {
    const dataSources = [
      {
        id: DATASET_SOURCE_TYPE.AZURE_STORAGE,
        labels: {
          en: 'Graph Format from Azure Storage',
          fr: 'Format Graph depuis Azure Storage',
        },
        parameters: [
          {
            id: `name`,
            varType: 'string',
            labels: { en: 'Account name', fr: 'Nom du compte' },
          },
          {
            id: `location`,
            varType: 'string',
            labels: { en: 'Container name', fr: 'Nom du container' },
          },
          {
            id: `path`,
            varType: 'string',
            labels: { en: 'Path', fr: 'Chemin' },
          },
        ],
      },
      {
        id: DATASET_SOURCE_TYPE.ADT,
        labels: {
          en: 'Azure Digital Twin',
          fr: 'Azure Digital Twin',
        },
        parameters: [
          {
            id: `location`,
            varType: 'string',
            labels: { en: 'Path', fr: 'Chemin' },
          },
        ],
      },
      {
        id: DATASET_SOURCE_TYPE.LOCAL_FILE,
        labels: {
          en: 'Graph Format from Local File',
          fr: 'Format Graph depuis un fichier local',
        },
        parameters: [{ id: `file`, varType: '%DATASETID%', labels: { en: '', fr: '' } }],
      },
      {
        id: DATASET_SOURCE_TYPE.NONE,
        labels: {
          en: 'Empty',
          fr: 'Dataset vide',
        },
        parameters: [],
      },
    ];

    dataSources.forEach((dataSource) => {
      dataSource.parameters.forEach((parameter) => (parameter.id = `${dataSource.id}.${parameter.id}`));
    });

    TranslationUtils.addTranslationRunTemplateLabels(dataSources);
    TranslationUtils.addTranslationParametersLabels(dataSources.flatMap((dataSource) => dataSource?.parameters));

    return dataSources;
  }, []);

  const dataSourceRunTemplates = useMemo(() => {
    const dataSources = solutionData.runTemplates.filter((runTemplate) => runTemplate?.tags.includes('datasource'));

    const parameters = solutionData.parameters;
    const runTemplatesParameters = solutionData.runTemplatesParametersIdsDict;

    const dataSourcesWithParameters = dataSources.map((dataSource) => {
      const dataSourceWithParameters = { ...dataSource };
      dataSourceWithParameters.parameters = parameters.filter((parameter) =>
        runTemplatesParameters[dataSource.id].includes(parameter.id)
      );
      return dataSourceWithParameters;
    });

    return [...hardCodedDataSources, ...dataSourcesWithParameters];
  }, [
    solutionData.parameters,
    solutionData.runTemplates,
    solutionData.runTemplatesParametersIdsDict,
    hardCodedDataSources,
  ]);

  const dataSourceTypeEnumValues = useMemo(() => {
    return [
      ...dataSourceRunTemplates.map((dataSource) => {
        return {
          key: dataSource.id,
          value: t(TranslationUtils.getRunTemplateTranslationKey(dataSource.id), dataSource.label),
        };
      }),
    ];
  }, [t, dataSourceRunTemplates]);

  const getDataSource = useCallback(
    (dataSourceId) => {
      return dataSourceRunTemplates.find((dataSource) => dataSource.id === dataSourceId);
    },
    [dataSourceRunTemplates]
  );

  const isDataSourceTypeRunner = useCallback(
    (dataSourceId) => {
      return getDataSource(dataSourceId)?.tags != null && getDataSource(dataSourceId)?.tags?.includes('datasource');
    },
    [getDataSource]
  );

  const getParameter = useCallback(
    (parameterId) => {
      for (const dataSource of dataSourceRunTemplates) {
        const parameter = dataSource?.parameters.find((parameter) => parameter.id === parameterId);
        if (parameter != null) return parameter;
      }
    },
    [dataSourceRunTemplates]
  );

  const getParameterEnumValues = useCallback(
    (parameterId) => {
      const rawEnumValues = ConfigUtils.getParameterAttribute(getParameter(parameterId), 'enumValues') ?? [];
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
    [t, getParameter]
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
    (parameterId) => {
      return getParameter(parameterId)?.options?.defaultFileTypeFilter;
    },
    [getParameter]
  );

  return {
    isDataSourceTypeRunner,
    getParameterEnumValues,
    dataSourceTypeEnumValues,
    getUploadFileLabels,
    getDefaultFileTypeFilter,
    getDataSource,
  };
};
