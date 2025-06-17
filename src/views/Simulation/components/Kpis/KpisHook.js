// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useCurrentScenarioId } from '../../../../state/hooks/ScenarioHooks';
import { useSimulationViewContext } from '../../SimulationViewContext';

const FAKE_KPIS_SETTINGS = {
  fillRate: { minValue: 40, refValue: 50, maxValue: 60 },
  grossMargin: { minValue: 20, refValue: 25, maxValue: 30 },
  totalCost: { minValue: 7, refValue: 10, maxValue: 13 },
  stockValue: { minValue: 210, refValue: 230, maxValue: 250 },
  co2Emissions: { minValue: 980, refValue: 1000, maxValue: 1005 },
};

const KPIS_METADATA = {
  fillRate: { label: 'Fill rate service level', unit: '%', isPositiveGreen: true },
  grossMargin: { label: 'Gross margin', unit: '€', isPositiveGreen: true },
  totalCost: { label: 'Total costs', unit: '€', isPositiveGreen: false },
  stockValue: { label: 'Stock value', unit: '€', isPositiveGreen: true },
  co2Emissions: { label: 'CO2 emissions (CO2Eq)', unit: 'kg', isPositiveGreen: false },
};

const formatPercentage = (value) => ({ value: 100 * value, suffix: '%' });
const formatWeight = (value) => ({
  value: value > 1000 ? value / 1000 : value,
  suffix: value > 1000 ? 'tons' : 'kg',
});
const formatCurrency = (unit, value) => {
  const base10Index = Math.log10(value);
  let formattedValue = value;
  let suffix;
  if (base10Index >= 9) {
    suffix = 'B';
    formattedValue = value / 1e9;
  } else if (base10Index >= 6) {
    suffix = 'M';
    formattedValue = value / 1e6;
  } else if (base10Index >= 3) {
    suffix = 'k';
    formattedValue = value / 1e3;
  }

  if (unit === '$') return { prefix: '$', value: formattedValue, suffix };
  else return { value: formattedValue, suffix: `${suffix}${unit}` };
};

const formatUnitAndValue = (unit, value) => {
  let kpi;
  if (unit === '%') kpi = formatPercentage(value);
  else if (unit === 'kg') kpi = formatWeight(value);
  else if (unit === '$' || unit === '€') kpi = formatCurrency(unit, value);
  else kpi = { value, suffix: unit };

  if (kpi.value > 1000) kpi.value = kpi.value.toExponential(2);
  return kpi;
};

const forgeKpi = (id, optionalValue) => {
  const min = FAKE_KPIS_SETTINGS[id].minValue;
  const max = FAKE_KPIS_SETTINGS[id].maxValue;
  const value = optionalValue ?? min + Math.random() * (max - min);
  // TODO: compute diffPercentage when we have reference data
  // const ref = FAKE_KPIS_SETTINGS[id].refValue;
  // const diffPercentage = ((value - ref) / ref) * 100.0;
  const diffPercentage = null;

  const unit = KPIS_METADATA[id].unit;
  const kpi = formatUnitAndValue(unit, value);

  return {
    ...kpi,
    label: KPIS_METADATA[id].label,
    isPositiveGreen: KPIS_METADATA[id].isPositiveGreen,
    difference: diffPercentage,
  };
};

export const useKpis = () => {
  const selectedScenarioId = useCurrentScenarioId();
  const { graphRef } = useSimulationViewContext();

  const scenarioKpis = useMemo(() => {
    const kpis = {};
    const kpiIds = Object.keys(FAKE_KPIS_SETTINGS);
    const allScenariosKpis = graphRef.current?.kpis;
    // TODO: Switch to actual scenario id or scenario run id when we have the data
    // const selectedScenarioKpis = allScenariosKpis.find(item => item.simulationRun === currentScenarioRunId);
    const selectedScenarioKpis = allScenariosKpis
      ? allScenariosKpis.find((item) => item.simulationRun === 'sr-mgmo6vqg7e2l')
      : {};

    kpiIds.forEach((kpiId) => {
      kpis[kpiId] = forgeKpi(kpiId, selectedScenarioKpis?.[kpiId]);
    });

    return kpis;
    // Draw new random values when picking a different scenario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphRef.current, selectedScenarioId]);

  return { scenarioKpis };
};
