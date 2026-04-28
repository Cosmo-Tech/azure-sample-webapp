// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

// Each step has:
//   - target: CSS selector for the element to highlight
//   - titleKey / contentKey: i18n translation keys
//   - tab: (optional) the tab route the user must be on for this step's target to be visible
//   - placement: tooltip placement
//   - disableBeacon: skip the pulsing beacon and show tooltip directly

export const getTourSteps = (t) => [
  {
    target: 'body',
    title: t('onboardingTour.steps.welcome.title', 'Welcome to the application!'),
    content: t(
      'onboardingTour.steps.welcome.content',
      'This guided tour will walk you through the main features of the application. You can restart it anytime from the help area in the top bar.'
    ),
    placement: 'center',
    disableBeacon: true,
    tab: null,
  },
  {
    target: '[data-cy="workspace-info-avatar"]',
    title: t('onboardingTour.steps.workspace.title', 'Workspace'),
    content: t(
      'onboardingTour.steps.workspace.content',
      'This shows your current workspace. Click here to see workspace details or switch to another workspace. Each workspace isolates your data and scenarios.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: null,
  },
  {
    target: '[data-cy="tabs.datasetmanager.key"]',
    title: t('onboardingTour.steps.datasetManagerTab.title', 'Dataset Manager'),
    content: t(
      'onboardingTour.steps.datasetManagerTab.content',
      'The Dataset Manager lets you manage your datasets: import data, create sub-datasets with filters, and review your data before running simulations.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: null,
  },
  {
    target: '[data-cy="datasets-list"]',
    title: t('onboardingTour.steps.datasetList.title', 'Dataset list'),
    content: t(
      'onboardingTour.steps.datasetList.content',
      'Here you can browse all available datasets. Select a dataset to view its details and overview on the right panel.'
    ),
    placement: 'right',
    disableBeacon: true,
    tab: 'datasetmanager',
  },
  {
    target: '[data-cy="create-dataset-button"]',
    title: t('onboardingTour.steps.createDataset.title', 'Create a dataset'),
    content: t(
      'onboardingTour.steps.createDataset.content',
      'Use this button to create a new dataset or sub-dataset. You can filter data by asset classes, granularity, and other criteria.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: 'datasetmanager',
  },
  {
    target: '[data-cy="tabs.scenario.key"]',
    title: t('onboardingTour.steps.scenarioTab.title', 'Scenario View'),
    content: t(
      'onboardingTour.steps.scenarioTab.content',
      'The Scenario View is where you create, configure, and launch simulations. You can adjust parameters and view dashboards for each scenario.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: null,
  },
  {
    target: '[data-cy="create-scenario-button"]',
    title: t('onboardingTour.steps.createScenario.title', 'Create a scenario'),
    content: t(
      'onboardingTour.steps.createScenario.content',
      'Click here to create a new scenario. You will choose a name, a scenario type, and a dataset to use for the simulation.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: 'scenario',
  },
  {
    target: '[data-cy="scenario-params-accordion"]',
    title: t('onboardingTour.steps.scenarioParams.title', 'Scenario parameters'),
    content: t(
      'onboardingTour.steps.scenarioParams.content',
      'Expand this section to configure simulation parameters: duration, time step, aging laws, technical policies, budget, and more.'
    ),
    placement: 'top',
    disableBeacon: true,
    tab: 'scenario',
  },
  {
    target: '[data-cy="launch-scenario-button"]',
    title: t('onboardingTour.steps.launchScenario.title', 'Launch simulation'),
    content: t(
      'onboardingTour.steps.launchScenario.content',
      'Once your parameters are set, click this button to launch the simulation. Results will appear in the dashboard section below.'
    ),
    placement: 'left',
    disableBeacon: true,
    tab: 'scenario',
  },
  {
    target: '[data-cy="tabs.dashboards.key"]',
    title: t('onboardingTour.steps.dashboardsTab.title', 'Dashboards'),
    content: t(
      'onboardingTour.steps.dashboardsTab.content',
      'The Dashboards tab provides visual indicators and reports for your simulation results. You can compare scenarios and analyze key metrics.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: null,
  },
  {
    target: '[data-cy="onboarding-tour-trigger"]',
    title: t('onboardingTour.steps.helpMenu.title', 'Need help?'),
    content: t(
      'onboardingTour.steps.helpMenu.content',
      'You can restart this guided tour anytime by clicking this button. The help menu next to it also provides links to documentation and support.'
    ),
    placement: 'bottom',
    disableBeacon: true,
    tab: null,
  },
];
