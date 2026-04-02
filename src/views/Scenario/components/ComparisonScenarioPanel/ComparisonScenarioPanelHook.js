// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDatasets } from '../../../../state/datasets/hooks';
import { useRunners } from '../../../../state/runner/hooks';

export const useComparisonScenarioPanel = () => {
  const { t } = useTranslation();
  const runners = useRunners();
  const datasets = useDatasets();

  const [comparisonScenarioId, setComparisonScenarioId] = useState(null);

  const comparisonScenarioData = useMemo(
    () => runners?.find((runner) => runner.id === comparisonScenarioId) ?? null,
    [runners, comparisonScenarioId]
  );

  const comparisonDatasetName = useMemo(() => {
    const baseDatasetIds = comparisonScenarioData?.datasets?.bases;
    if (!baseDatasetIds || baseDatasetIds.length === 0) return t('views.scenario.text.nodataset', 'None');
    const dataset = datasets.find((d) => baseDatasetIds.includes(d.id));
    return dataset?.name ?? t('views.scenario.text.datasetNotFound', 'Not found');
  }, [comparisonScenarioData, datasets, t]);

  const selectComparisonScenario = useCallback(
    (event, scenario) => {
      if (scenario?.id) {
        setComparisonScenarioId(scenario.id);
      }
    },
    [setComparisonScenarioId]
  );

  return {
    comparisonScenarioData,
    comparisonDatasetName,
    selectComparisonScenario,
  };
};
