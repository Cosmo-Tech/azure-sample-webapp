// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useSimulationViewContext } from '../../SimulationViewContext';

const FAKE_KPIS_SETTINGS = {
  fillRate: { minValue: 0.8, refValue: 0.9463721129222176, maxValue: 0.99 },
  grossMargin: { minValue: 4000000, refValue: 4957825.188193373, maxValue: 6000000 },
  totalCost: { minValue: 10000000, refValue: 10190201.094592003, maxValue: 13000000 },
  stockValue: { minValue: 200000, refValue: 222232.34299579775, maxValue: 250000 },
  co2Emissions: { minValue: 2000000, refValue: 2376382.101142066, maxValue: 2500000 },
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

const forgeKpi = (id, kpiValue, scenarioParentId) => {
  const min = FAKE_KPIS_SETTINGS[id].minValue;
  const max = FAKE_KPIS_SETTINGS[id].maxValue;
  const value = kpiValue ?? min + Math.random() * (max - min);
  const ref = FAKE_KPIS_SETTINGS[id].refValue;
  const diffValue = Math.abs(((value - ref) / ref) * 100.0);
  const diffElement = scenarioParentId != null && diffValue >= 0.001 ? diffValue : null;

  const unit = KPIS_METADATA[id].unit;
  const kpi = formatUnitAndValue(unit, value);

  return {
    ...kpi,
    label: KPIS_METADATA[id].label,
    isPositiveGreen: KPIS_METADATA[id].isPositiveGreen,
    difference: diffElement,
  };
};

export const useKpis = () => {
  const { currentScenario, graphRef } = useSimulationViewContext();

  const scenarioKpis = useMemo(() => {
    const kpis = {};
    const kpiIds = Object.keys(FAKE_KPIS_SETTINGS);
    const scenarioKpis = graphRef.current?.kpis?.[0];
    const scenarioParentId = currentScenario?.parentId;

    kpiIds.forEach((kpiId) => {
      kpis[kpiId] = forgeKpi(kpiId, scenarioKpis?.[kpiId], scenarioParentId);
    });

    return kpis;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graphRef.current, currentScenario?.id]);

  return { scenarioKpis };
};
