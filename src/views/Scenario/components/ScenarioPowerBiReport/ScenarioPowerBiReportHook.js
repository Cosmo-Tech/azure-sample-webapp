import { useMemo } from 'react';
import { SCENARIO_DASHBOARD_CONFIG } from '../../../../config/PowerBI';
import { useCurrentScenarioData } from '../../../../state/hooks/ScenarioHooks';

export const useScenarioPowerBiReport = () => {
  const currentScenarioData = useCurrentScenarioData();

  const currentScenarioRunTemplateReport = useMemo(
    () =>
      Array.isArray(SCENARIO_DASHBOARD_CONFIG)
        ? SCENARIO_DASHBOARD_CONFIG
        : currentScenarioData?.runTemplateId in SCENARIO_DASHBOARD_CONFIG
        ? [SCENARIO_DASHBOARD_CONFIG[currentScenarioData.runTemplateId]]
        : [],
    [currentScenarioData?.runTemplateId]
  );

  return { currentScenarioData, currentScenarioRunTemplateReport };
};
