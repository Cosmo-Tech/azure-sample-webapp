/* eslint-disable react/prop-types */
import { CircleArrowRight } from 'lucide-react';
import React, { Fragment } from 'react';
import { Link as MuiLink, Typography } from '@mui/material';
import { AppBar } from '../../../components/AppBar';

export default {
  title: 'Molecule/Breadcrumb Bar',
  component: AppBar,
  parameters: {
    layout: 'fullscreen',
  },
};

const MockBreadcrumb = ({ workspaceName, scenarioName }) => (
  <Fragment>
    <MuiLink underline="hover" color="inherit" href="#">
      <Typography fontSize={14}>{workspaceName}</Typography>
    </MuiLink>

    {scenarioName && (
      <Fragment>
        <CircleArrowRight size={14} />
        <MuiLink underline="hover" color="inherit" href="#">
          <Typography fontSize={14}>Scenarios</Typography>
        </MuiLink>
      </Fragment>
    )}

    {scenarioName && (
      <>
        <CircleArrowRight size={14} />
        <MuiLink underline="hover" color="inherit" href="#">
          <Typography fontSize={14}>{scenarioName}</Typography>
        </MuiLink>
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
