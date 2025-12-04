/* eslint-disable react/prop-types */
import { CircleArrowRight } from 'lucide-react';
import React, { Fragment } from 'react';
import { AppBar } from '../../../components/AppBar';
import { BreadcrumbItem } from '../../../components/AppBar/components/BreadcrumbItem';

export default {
  title: 'Molecules/Breadcrumb Bar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
};

const MockBreadcrumb = ({ workspaceName, scenarioName }) => (
  <Fragment>
    <BreadcrumbItem href="/scenarios" maxWidth="33%">
      {workspaceName}
    </BreadcrumbItem>

    {scenarioName && (
      <Fragment>
        <CircleArrowRight size={14} />
        <BreadcrumbItem href="/scenarios" maxWidth="33%">
          Scenarios
        </BreadcrumbItem>
      </Fragment>
    )}

    {scenarioName && (
      <>
        <CircleArrowRight size={14} />
        <BreadcrumbItem href="/scenarios" maxWidth="33%">
          {scenarioName}
        </BreadcrumbItem>
      </>
    )}
  </Fragment>
);

const Template = (args) => (
  <AppBar currentScenario={args.currentScenario}>
    <MockBreadcrumb {...args} />
  </AppBar>
);

export const Default = Template.bind({});
Default.args = {
  workspaceName: 'Logistics Optimization',
  scenarioName: 'Baseline Scenario',
  currentScenario: { data: { name: 'Baseline Scenario' } },
};

export const WorkspaceOnly = Template.bind({});
WorkspaceOnly.args = {
  workspaceName: 'Asset Aip Workspaces',
  scenarioName: null,
  currentScenario: null,
};

export const LongNames = Template.bind({});
LongNames.args = {
  workspaceName: 'Very Long Workspace Name To Test UI Layout',
  scenarioName: 'Extremely Detailed Scenario',
  currentScenario: { data: { name: 'Extremely Detailed Scenario Title Mock For Visual Testing Purposes' } },
};
