import React from 'react';
import { PostRunKPIs, PreRunKPIs } from '../../../components/KpiBox';

export default {
  title: 'Molecules/KPIBoxes',
};

export const PreRun = {
  render: () => {
    const items = [
      { title: 'Assets', value: '4,316' },
      { title: 'Lines', value: '9' },
      { title: 'Total Nodes', value: '9,929' },
      { title: 'Total Relationships', value: '17,909' },
    ];
    return <PreRunKPIs items={items} status="Note: These pre-run KPIs are based on your initial base dataset" />;
  },
};

export const PostRun = {
  render: () => {
    const items = [
      {
        title: 'TOTEX ($)',
        value: '11.29B',
        comparison: '+6.8B',
        comparisonColor: 'negative',
        scenarioName: 'vs 4.49B - BAU Run To Fail',
      },
      {
        title: 'Assets',
        value: '4,316',
        comparison: 'N/A',
        comparisonColor: 'neutral',
        scenarioName: 'vs 4,316 - No Change',
      },
      {
        title: 'Lines',
        value: '9',
        comparison: '+0%',
        comparisonColor: 'neutral',
        scenarioName: 'vs 9 - Baseline',
      },
      {
        title: 'Simulation Start',
        value: '2023',
        comparison: 'N/A',
        comparisonColor: 'neutral',
        scenarioName: 'vs 2023 - Baseline Scenario',
      },
      {
        title: 'Simulation End',
        value: '2052',
        comparison: '+0%',
        comparisonColor: 'neutral',
        scenarioName: 'vs 2052 - BAU',
      },
    ];

    return <PostRunKPIs items={items} status="Note: These KPIs reflect post-run scenario results" />;
  },
};

export const PostRunLongNames = {
  render: () => {
    const items = [
      {
        title: 'TOTEX ($)',
        value: '11.29B',
        comparison: '+6.8B',
        comparisonColor: 'negative',
        scenarioName: 'vs 4.49B - Extremely Long Scenario Name That Will Be Truncated With Ellipsis',
      },
      {
        title: 'Assets',
        value: '4,316',
        comparison: '+0%',
        comparisonColor: 'neutral',
        scenarioName: 'vs 4,316 - Another Very Long Scenario Name That Goes Beyond Bounds',
      },
    ];

    return <PostRunKPIs items={items} status="Note: These KPIs reflect post-run scenario results" />;
  },
};
