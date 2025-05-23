// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useMemo } from 'react';
import { useCurrentScenarioId } from '../../../../state/hooks/ScenarioHooks';

const FAKE_KPIS_SETTINGS = {
  fillRate: {
    label: 'Fill rate service level',
    unit: '%',
    minValue: 40,
    refValue: 50,
    maxValue: 60,
    isPositiveGreen: true,
  },
  grossMargin: {
    label: 'Gross margin',
    unit: '%',
    minValue: 20,
    refValue: 25,
    maxValue: 30,
    isPositiveGreen: true,
  },
  totalCost: {
    label: 'Total costs',
    unit: 'M€',
    minValue: 7,
    refValue: 10,
    maxValue: 13,
    isPositiveGreen: false,
  },
  stockValue: {
    label: 'Stock value',
    unit: 'K€',
    minValue: 210,
    refValue: 230,
    maxValue: 250,
    isPositiveGreen: true,
  },
  co2Emissions: {
    label: 'CO2 emissions (KgCO2Eq)',
    minValue: 980,
    refValue: 1000,
    maxValue: 1005,
    isPositiveGreen: false,
  },
};

const forgeKpi = (id) => {
  const min = FAKE_KPIS_SETTINGS[id].minValue;
  const ref = FAKE_KPIS_SETTINGS[id].refValue;
  const max = FAKE_KPIS_SETTINGS[id].maxValue;
  const value = min + Math.random() * (max - min);
  const diffPercentage = ((value - ref) / ref) * 100.0;

  return {
    label: FAKE_KPIS_SETTINGS[id].label,
    unit: FAKE_KPIS_SETTINGS[id].unit,
    isPositiveGreen: FAKE_KPIS_SETTINGS[id].isPositiveGreen,
    value,
    difference: diffPercentage,
  };
};

export const useKpis = () => {
  const selectedScenarioId = useCurrentScenarioId();

  const scenarioKpis = useMemo(() => {
    const kpiIds = Object.keys(FAKE_KPIS_SETTINGS);
    const kpis = {};
    kpiIds.forEach((kpiId) => {
      kpis[kpiId] = forgeKpi(kpiId);
    });

    return kpis;
    // Draw new random values when picking a different scenario
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScenarioId]);

  return { scenarioKpis };
};
