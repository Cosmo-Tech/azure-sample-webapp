// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React from 'react';
import rfdc from 'rfdc';
import { createMockStore } from '../../../tests/mocks';
import { ROLES } from '../../../tests/constants';
import { DEFAULT_REDUX_STATE, SCENARIODATA_WITHOUT_USERS } from '../../../tests/samples';
import { applyWorkspaceRoleToState } from '../../../tests/utils/security';
import { dispatchCreateScenario } from '../../state/dispatchers/scenario/ScenarioDispatcher';

import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import CreateScenarioButton from '.';
import { logsLabels } from './labels';

const clone = rfdc();

const spyConsoleWarn = jest.spyOn(console, 'warn');
let mockCreateScenarioUIProps;
jest.mock('@cosmotech/ui', () => ({
  ...jest.requireActual('@cosmotech/ui'),
  CreateScenarioButton: (props) => {
    mockCreateScenarioUIProps = props;
    return <div data-testid="create_scenario_ui_button" />;
  },
}));

jest.mock('@mui/styles/makeStyles', () => () => ({}));
jest.mock('@mui/styles/withStyles', () => () => () => ({}));

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
      expect(mockCreateScenarioUIProps.scenarios).toEqual(DEFAULT_REDUX_STATE.scenario.list.data);
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
    const applyDatasetFilterToState = (state, datasetFilter) => {
      state.workspace.current.data.webApp.options.datasetFilter = datasetFilter;
    };

    const setUpWithDatasetFilter = (datasetFilter) => {
      const initialState = getStateWithWorkspaceRole(ROLES.WORKSPACE.ADMIN);
      applyDatasetFilterToState(initialState, datasetFilter);
      setUp(initialState);
    };

    test('when filter is missing, datasets are not filtered', () => {
      setUpWithDatasetFilter(undefined);
      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
    });

    test('when filter is not a array, datasets are not filtered', () => {
      setUpWithDatasetFilter('notAArrayFilter');
      expect(spyConsoleWarn).toHaveBeenCalledWith(logsLabels.warning.datasetFilter.emptyOrNotArray);
      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
    });

    test('when filter is empty, datasets are not filtered', () => {
      setUpWithDatasetFilter([]);
      expect(spyConsoleWarn).toHaveBeenCalledWith(logsLabels.warning.datasetFilter.emptyOrNotArray);
      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
    });

    test('when dataset filter contains no dataset id on list it should be ignored', () => {
      const datasetFilter = ['fakeDatasetId1', 'fakeDatasetId2'];
      setUpWithDatasetFilter(datasetFilter);

      expect(spyConsoleWarn).toHaveBeenCalledWith(logsLabels.warning.datasetFilter.noDatasetFound);
      datasetFilter.forEach((dsetFilter) => {
        expect(spyConsoleWarn).toHaveBeenCalledWith(
          logsLabels.warning.datasetFilter.getDatasetNotFoundForFilter(dsetFilter)
        );
      });

      expect(mockCreateScenarioUIProps.datasets).toEqual(DEFAULT_REDUX_STATE.dataset.list.data);
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
      expect(spyConsoleWarn).toHaveBeenCalledWith(logsLabels.warning.datasetFilter.getNotAString(datasetFilter[1]));
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
