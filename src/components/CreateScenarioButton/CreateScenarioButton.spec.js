// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import rfdc from 'rfdc';
import CreateScenarioButton from '.';
import { ROLES } from '../../../tests/constants';
import { createMockStore } from '../../../tests/mocks';
import { DEFAULT_REDUX_STATE, SCENARIODATA_WITHOUT_USERS, DEFAULT_SCENARIOS_LIST_DATA } from '../../../tests/samples';
import { applyWorkspaceRoleToState } from '../../../tests/utils/security';
import { dispatchCreateScenario } from '../../state/dispatchers/scenario/ScenarioDispatcher';

const clone = rfdc();
const DEFAULT_SCENARIOS_LIST_DATA_WITH_DEPTHS = DEFAULT_SCENARIOS_LIST_DATA.map((scenario) => ({
  ...scenario,
  depth: 0,
}));

const spyConsoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
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
    spyConsoleWarn.mockClear();
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
      expect(mockCreateScenarioUIProps.currentScenario).toEqual(DEFAULT_REDUX_STATE.scenario.current);
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
    const setUpWithDatasetFilter = (linkedDatasetIdList) => {
      const state = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      state.workspace.current.data.linkedDatasetIdList = linkedDatasetIdList;
      setUp(state);
    };

    test('when filter is missing, all datasets are shown', () => {
      setUpWithDatasetFilter(undefined);
      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
    });

    test('when filter is not an array, it is ignored and all datasets are shown', () => {
      setUpWithDatasetFilter('notAnArrayFilter');
      expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
    });

    test('must return an empty list of datasets if the filter is an empty list', () => {
      setUpWithDatasetFilter([]);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(0);
      expect(mockCreateScenarioUIProps.datasets).toEqual([]);
    });

    test('when dataset filter contains no dataset id on list, the resulting list should be empty', () => {
      const datasetFilter = ['fakeDatasetId1', 'fakeDatasetId2'];
      setUpWithDatasetFilter(datasetFilter);
      expect(mockCreateScenarioUIProps.datasets).toEqual([]);
    });

    test('when filter is present only datasets with id filtered should be present', () => {
      const datasetFilter = [DEFAULT_REDUX_STATE.dataset.list.data[1].id, DEFAULT_REDUX_STATE.dataset.list.data[2].id];

      setUpWithDatasetFilter(datasetFilter);
      expect(mockCreateScenarioUIProps.datasets).toHaveLength(datasetFilter.length);

      datasetFilter.forEach((dsetFilter) =>
        expect(mockCreateScenarioUIProps.datasets.some((dset) => dset.id === dsetFilter)).toBeTruthy()
      );
    });

    test('when a filter is not string it should be ignored', () => {
      const datasetFilter = [DEFAULT_REDUX_STATE.dataset.list.data[1].id, { id: 'fakeDatasetId' }];
      setUpWithDatasetFilter(datasetFilter);
      expect(spyConsoleWarn).toHaveBeenCalledTimes(1);
      expect(mockCreateScenarioUIProps.datasets).toHaveLength(1);
    });
  });

  describe('Filter run template', () => {
    const applyRunTemplateFilterToState = (state, runTemplateFilter) => {
      state.workspace.current.data.solution.runTemplateFilter = runTemplateFilter;
    };

    const setUpWithRunTemplateFilter = (runTemplateFilter) => {
      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      applyRunTemplateFilterToState(initialState, runTemplateFilter);
      setUp(initialState);
    };

    test('when filter is missing runTemplates are not filtered', () => {
      setUpWithRunTemplateFilter(undefined);
      expect(mockCreateScenarioUIProps.runTemplates).toEqual(DEFAULT_REDUX_STATE.solution.current.data.runTemplates);
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

      const actionExpected = dispatchCreateScenario(
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
