// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import rfdc from 'rfdc';
import CreateScenarioButton from '.';
import { ROLES } from '../../../tests/constants';
import { createMockStore } from '../../../tests/mocks';
import {
  DEFAULT_ETL_RUNNER,
  DEFAULT_REDUX_STATE,
  SCENARIODATA_WITHOUT_USERS,
  DEFAULT_SCENARIOS_LIST_DATA,
  DEFAULT_DATASET,
  MAIN_DATASET,
} from '../../../tests/samples';
import { applyWorkspaceRoleToState } from '../../../tests/utils/security';
import { RUNNER_RUN_STATE } from '../../services/config/ApiConstants.js';
import { dispatchCreateSimulationRunner } from '../../state/runner/dispatchers';

const clone = rfdc();
const DEFAULT_SCENARIOS_LIST_DATA_WITH_DEPTHS = DEFAULT_SCENARIOS_LIST_DATA.map((scenario) => ({
  ...scenario,
  depth: 0,
}));

let mockCreateScenarioUIProps;
jest.mock('@cosmotech/ui', () => ({
  ...jest.requireActual('@cosmotech/ui'),
  CreateScenarioButton: (props) => {
    mockCreateScenarioUIProps = props;
    return <div data-testid="create_scenario_ui_button" />;
  },
}));

const getCreateScenarioButtonUI = () => screen.queryByTestId('create_scenario_ui_button');

const getStateWithWorkspaceRole = (role) => {
  const state = clone(DEFAULT_REDUX_STATE);
  applyWorkspaceRoleToState(state, role);
  return state;
};

const translateTemplatesInTest = (templates) => {
  return templates.map((rt) => ({
    ...rt,
    name: `solution.runTemplate.${rt.id}.name`,
  }));
};

const mockOnScenarioCreated = jest.fn();
const DEFAULT_PROPS = {
  disabled: false,
  onScenarioCreated: mockOnScenarioCreated,
};

let mockStore;
const setUp = (initialState, props = DEFAULT_PROPS) => {
  mockStore = createMockStore(initialState);
  render(
    <Provider store={mockStore}>
      <CreateScenarioButton {...props} />
    </Provider>
  );
};

describe('CreateScenarioButton', () => {
  beforeEach(() => {
    mockCreateScenarioUIProps = undefined;
    mockOnScenarioCreated.mockClear();
  });

  describe('Workspace Roles', () => {
    test.each([
      { role: ROLES.WORKSPACE.NONE, expected: true },
      { role: ROLES.WORKSPACE.VIEWER, expected: true },
      { role: ROLES.WORKSPACE.EDITOR, expected: false },
      { role: ROLES.WORKSPACE.USER, expected: false },
      { role: ROLES.WORKSPACE.ADMIN, expected: false },
    ])('$role role display Create Scenario button with disabled $expected', ({ role, expected }) => {
      const initialState = getStateWithWorkspaceRole(role);
      setUp(initialState);
      expect(getCreateScenarioButtonUI()).toBeInTheDocument();
      expect(mockCreateScenarioUIProps.disabled).toEqual(expected);
    });
  });

  describe('CreateScenarioButtonUI Props match to state', () => {
    beforeEach(() => {
      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      setUp(initialState);
    });

    test('solution prop match to solution current state', () => {
      expect(mockCreateScenarioUIProps.solution).toEqual(DEFAULT_REDUX_STATE.solution.current);
    });

    test('workspaceId prop match to current workspace id state', () => {
      expect(mockCreateScenarioUIProps.workspaceId).toEqual(DEFAULT_REDUX_STATE.workspace.current.data.id);
    });

    test('currentScenario prop match to current scenario state', () => {
      expect(mockCreateScenarioUIProps.currentScenario).toEqual(DEFAULT_REDUX_STATE.runner.simulationRunners.current);
    });

    test('scenarios prop match to scenario list data state', () => {
      expect(mockCreateScenarioUIProps.scenarios).toEqual(DEFAULT_SCENARIOS_LIST_DATA_WITH_DEPTHS);
    });

    test('user prop match to auth state', () => {
      expect(mockCreateScenarioUIProps.user).toEqual(DEFAULT_REDUX_STATE.auth);
    });
  });

  describe('CreateScenarioButtonUI disabled prop', () => {
    const setUpWithDisabledProp = (disabled) => {
      const props = {
        disabled,
        onScenarioCreated: () => {},
      };

      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      setUp(initialState, props);
    };

    test('CreateScenarioButtonUI disabled prop is true if prop is true', () => {
      setUpWithDisabledProp(true);
      expect(mockCreateScenarioUIProps.disabled).toBeTruthy();
    });
  });

  describe('Filter dataset List', () => {
    const setUpWithCustomDatasetsAndRunners = (datasets, runners) => {
      const state = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      if (datasets) state.dataset.list.data = datasets;
      if (runners) state.runner.etlRunners.list.data = runners;
      setUp(state);
    };

    test('must show only datasets with scenarioCreation=true (a.k.a. "main" datasets)', () => {
      setUpWithCustomDatasetsAndRunners([DEFAULT_DATASET, MAIN_DATASET]);
      expect(mockCreateScenarioUIProps.datasets).toEqual([MAIN_DATASET]);
    });

    test('must not show main datasets if created by an ETL and if this creation has failed', () => {
      const successfulRunner = clone(DEFAULT_ETL_RUNNER);
      successfulRunner.id = 'r-successful';
      successfulRunner.lastRunInfo.lastRunStatus = RUNNER_RUN_STATE.SUCCESSFUL;
      const failedRunner = clone(DEFAULT_ETL_RUNNER);
      failedRunner.id = 'r-failed';
      failedRunner.lastRunInfo.lastRunStatus = RUNNER_RUN_STATE.FAILED;
      const runningRunner = clone(DEFAULT_ETL_RUNNER);
      runningRunner.id = 'r-running';
      runningRunner.lastRunInfo.lastRunStatus = RUNNER_RUN_STATE.RUNNING;

      const successfulETLDataset = clone(MAIN_DATASET);
      successfulETLDataset.id = 'd-successful';
      successfulETLDataset.additionalData.webapp.runnerId = 'r-successful';
      const failedETLDataset = clone(MAIN_DATASET);
      failedETLDataset.id = 'd-failed';
      failedETLDataset.additionalData.webapp.runnerId = 'r-failed';
      const runningETLDataset = clone(MAIN_DATASET);
      runningETLDataset.id = 'd-running';
      runningETLDataset.additionalData.webapp.runnerId = 'r-running';
      const nativeDatasourceDataset = clone(MAIN_DATASET); // Not created by an ETL
      nativeDatasourceDataset.id = 'd-nativeDatasource';

      const datasets = [successfulETLDataset, failedETLDataset, runningETLDataset, nativeDatasourceDataset];
      const runners = [successfulRunner, failedRunner, runningRunner];
      setUpWithCustomDatasetsAndRunners(datasets, runners);
      expect(mockCreateScenarioUIProps.datasets).toEqual([successfulETLDataset, nativeDatasourceDataset]);
    });
  });

  describe('Filter run template', () => {
    const applyRunTemplateFilterToState = (state, runTemplateFilter) => {
      state.workspace.current.data.additionalData.webapp.solution.runTemplateFilter = runTemplateFilter;
    };

    const setUpWithRunTemplateFilter = (runTemplateFilter) => {
      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      applyRunTemplateFilterToState(initialState, runTemplateFilter);
      setUp(initialState);
    };

    test('when filter is missing runTemplates are not filtered', () => {
      setUpWithRunTemplateFilter(undefined);
      const simulationRunTemplates = DEFAULT_REDUX_STATE.solution.current.data.runTemplates.filter(
        (runTemplate) => !runTemplate.tags.includes('datasource') && !runTemplate.tags.includes('subdatasource')
      );
      const expectedTranslatedTemplates = translateTemplatesInTest(simulationRunTemplates);
      expect(mockCreateScenarioUIProps.runTemplates).toEqual(expectedTranslatedTemplates);
    });

    test('when filter is empty runTemplates are all filtered', () => {
      setUpWithRunTemplateFilter([]);
      expect(mockCreateScenarioUIProps.runTemplates).toHaveLength(0);
    });

    test('when filter is present only datasets with id filtered are present', () => {
      const runTemplateFilter = [
        DEFAULT_REDUX_STATE.solution.current.data.runTemplates[1].id,
        DEFAULT_REDUX_STATE.solution.current.data.runTemplates[2].id,
      ];

      setUpWithRunTemplateFilter(runTemplateFilter);
      expect(mockCreateScenarioUIProps.runTemplates).toHaveLength(runTemplateFilter.length);

      runTemplateFilter.forEach((rtplFilter) =>
        expect(mockCreateScenarioUIProps.runTemplates.some((rtpl) => rtpl.id === rtplFilter)).toBeTruthy()
      );
    });
  });

  describe('CreateScenario callback', () => {
    beforeEach(() => {
      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      setUp(initialState);
    });

    test('createScenario dispatch createScenario action and call onScenarioCreated callback', () => {
      const scenarioToCreate = SCENARIODATA_WITHOUT_USERS;

      const actionExpected = dispatchCreateSimulationRunner(
        DEFAULT_REDUX_STATE.organization.current.data.id,
        DEFAULT_REDUX_STATE.workspace.current.data.id,
        scenarioToCreate
      );

      expect(mockStore.dispatch).not.toHaveBeenCalledWith(actionExpected);
      expect(mockOnScenarioCreated).not.toHaveBeenCalled();

      mockCreateScenarioUIProps.createScenario('fakeWorkspaceId', scenarioToCreate);

      expect(mockStore.dispatch).toHaveBeenCalledWith(actionExpected);
      expect(mockOnScenarioCreated).toHaveBeenCalled();
    });
  });
});
