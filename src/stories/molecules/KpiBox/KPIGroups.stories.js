import React from 'react';
import { PostRunKPIs, PreRunKPIs } from '../../../components/KpiBox';

export default {
  title: 'Molecules/KPIBoxes',
  argTypes: {
    status: {
      control: 'text',
      description: 'Helper / info text shown below KPI boxes',
    },
    comparisonColor: {
      control: { type: 'select' },
      options: ['positive', 'negative', 'neutral'],
      description: 'Comparison color applied to KPI comparison values',
    },
    items: {
      control: 'object',
      description: 'KPI items configuration',
    },
  },
};

export const PreRun = {
  args: {
    status: 'Note: These pre-run KPIs are based on your initial base dataset',
    items: [
      { title: 'Assets', value: '4,316', currency: '$', currencyPosition: 'before' },
      { title: 'Lines', value: '9', currency: '$', currencyPosition: 'before' },
      { title: 'Total Nodes', value: '9,929', currency: '$', currencyPosition: 'before' },
      { title: 'Total Relationships', value: '17,909', currency: '$', currencyPosition: 'before' },
    ],
  },
  render: (args) => <PreRunKPIs {...args} />,
};

export const PostRun = {
  args: {
    status: 'Note: These KPIs reflect post-run scenario results',
    comparisonColor: 'negative',
    items: [
      {
        title: 'TOTEX',
        value: '11.29B',
        comparison: '+6.8B',
        scenarioName: 'vs 4.49B - BAU Run To Fail',
        currency: '$',
        currencyPosition: 'after',
      },
      {
        title: 'Assets',
        value: '4,316',
        comparison: 'N/A',
        scenarioName: 'vs 4,316 - No Change',
        currency: '$',
        currencyPosition: 'after',
      },
      {
        title: 'Lines',
        value: '9',
        comparison: '+0%',
        scenarioName: 'vs 9 - Baseline',
        currency: '$',
        currencyPosition: 'after',
      },
      {
        title: 'Simulation Start',
        value: '2023',
        comparison: 'N/A',
        scenarioName: 'vs 2023 - Baseline Scenario',
      },
      {
        title: 'Simulation End',
        value: '2052',
        comparison: '+0%',
        scenarioName: 'vs 2052 - BAU',
      },
    ],
  },
  render: ({ comparisonColor, items, ...rest }) => (
    <PostRunKPIs
      {...rest}
      items={items.map((item) => ({
        ...item,
        comparisonColor,
      }))}
    />
  ),
};

export const PostRunLongNames = {
  args: {
    status: 'Note: These KPIs reflect post-run scenario results',
    comparisonColor: 'neutral',
    items: [
      {
        title: 'TOTEX',
        value: '11.29B',
        comparison: '+6.8B',
        scenarioName:
          'vs 4.49B - Extremely Long Scenario Name That Will Be Truncated With Ellipsis At The End, hover to see',
        currency: '$',
        currencyPosition: 'after',
      },
      {
        title: 'Assets',
        value: '4,316',
        comparison: '+0%',
        scenarioName: 'vs 4,316 - Another Very Long Scenario Name That Goes Beyond Bounds',
        currency: '$',
        currencyPosition: 'after',
      },
    ],
  },
  render: ({ comparisonColor, items, ...rest }) => (
    <PostRunKPIs
      {...rest}
      items={items.map((item) => ({
        ...item,
        comparisonColor,
      }))}
    />
  ),
};
