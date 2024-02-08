// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/* eslint-disable react/prop-types */
import React from 'react';
import { useFormState } from 'react-hook-form';
import { ButtonTesting, TypographyTesting } from '../../../../../tests/MuiComponentsTesting';
import { customRender, getByDataCy } from '../../../../../tests/utils';
import { SCENARIO_RUN_STATE } from '../../../../services/config/ApiConstants';
import { useCurrentScenarioState } from '../../../../state/hooks/ScenarioHooks';
import { ScenarioActions } from './';

jest.mock('react-hook-form', () => ({
  __esModule: true,
  ...jest.requireActual('react-hook-form'),
  useFormState: jest.fn(),
}));

jest.mock('@cosmotech/ui', () => ({
  __esModule: true,
  ...jest.requireActual('@cosmotech/ui'),
  PermissionsGate: ({ children }) => {
    return <div data-testid="PermissionsGate">{children}</div>;
  },
}));

const mockUseLaunchScenario = jest.fn();
const mockUseSaveAndLaunchScenario = jest.fn();
const mockUseSaveScenario = jest.fn();
const mockOpenDialog = jest.fn();

jest.mock('../../../../state/hooks/ScenarioHooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../state/hooks/ScenarioHooks'),
  useLaunchScenario: () => mockUseLaunchScenario,
  useSaveAndLaunchScenario: () => mockUseSaveAndLaunchScenario,
  useSaveScenario: () => mockUseSaveScenario,
  useCurrentScenarioState: jest.fn(),
}));

jest.mock('../../../../state/hooks/ScenarioRunHooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../state/hooks/ScenarioRunHooks'),
  useStopScenarioRun: () => jest.fn(),
}));

jest.mock('../../../../hooks/ScenarioParametersHooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../hooks/ScenarioParametersHooks'),
  useUpdateParameters: () => ({
    forceUpdate: false,
    processFilesToUpload: jest.fn(),
    getParametersToUpdate: jest.fn(),
  }),
}));

jest.mock('../../../../services/twoActionsDialog/twoActionsDialogService', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../services/twoActionsDialog/twoActionsDialogService'),
  TwoActionsDialogService: {
    openDialog: () => Promise.resolve(mockOpenDialog()),
  },
}));

const launchScenarioButton = new ButtonTesting({ dataCy: 'launch-scenario-button' });
const saveScenarioButton = new ButtonTesting({ dataCy: 'save-button' });
const discardChangesButton = new ButtonTesting({ dataCy: 'discard-button' });
const stopRunButton = new ButtonTesting({ dataCy: 'stop-scenario-run-button' });
const runningStateLabel = new TypographyTesting({ dataCy: 'running-state-label' });

describe('Test scenario buttons when scenario is not running', () => {
  beforeAll(() => {
    useCurrentScenarioState.mockReturnValue(() => null);
  });

  describe('Test scenario buttons if form is not dirty', () => {
    beforeAll(() => {
      useFormState.mockReturnValue({ isDirty: false });
      customRender(<ScenarioActions />);
    });

    beforeEach(() => {
      mockUseLaunchScenario.mockClear();
    });

    test('Check buttons', async () => {
      expect(launchScenarioButton.Button).toBeVisible();
      expect(getByDataCy('launch-label')).toBeVisible();
      await launchScenarioButton.click();
      expect(mockUseLaunchScenario).toHaveBeenCalled();

      expect(saveScenarioButton.Button).not.toBeInTheDocument();
      expect(discardChangesButton.Button).not.toBeInTheDocument();
      expect(stopRunButton.Button).not.toBeInTheDocument();
      expect(getByDataCy('running-state-spinner')).not.toBeInTheDocument();
      expect(runningStateLabel.Typography).not.toBeInTheDocument();
    });
  });

  describe('Test scenario buttons if form is dirty', () => {
    beforeAll(() => {
      useFormState.mockReturnValue({ isDirty: true });
      customRender(<ScenarioActions />);
    });

    beforeEach(() => {
      mockUseSaveAndLaunchScenario.mockClear();
      mockUseSaveScenario.mockClear();
      mockOpenDialog.mockClear();
    });

    test('Check buttons', async () => {
      expect(launchScenarioButton.Button).toBeVisible();
      expect(getByDataCy('save-and-launch-label')).toBeVisible();
      await launchScenarioButton.click();
      expect(mockUseSaveAndLaunchScenario).toHaveBeenCalled();

      expect(saveScenarioButton.Button).toBeVisible();
      await saveScenarioButton.click();
      expect(mockUseSaveScenario).toHaveBeenCalled();

      expect(discardChangesButton.Button).toBeVisible();
      await discardChangesButton.click();
      await expect(mockOpenDialog).toHaveBeenCalled();
    });
  });
});

describe('Test scenario buttons when scenario is running', () => {
  beforeAll(() => {
    useCurrentScenarioState.mockReturnValue(SCENARIO_RUN_STATE.RUNNING);
    useFormState.mockReturnValue({ isDirty: false });
    customRender(<ScenarioActions />);
  });

  beforeEach(() => {
    mockOpenDialog.mockClear();
  });

  test('Check buttons', async () => {
    expect(launchScenarioButton.Button).not.toBeInTheDocument();
    expect(saveScenarioButton.Button).not.toBeInTheDocument();
    expect(discardChangesButton.Button).not.toBeInTheDocument();

    expect(stopRunButton.Button).toBeVisible();
    expect(getByDataCy('running-state-spinner')).toBeVisible();
    expect(runningStateLabel.Typography).toBeVisible();
    await stopRunButton.click();
    await expect(mockOpenDialog).toHaveBeenCalled();
  });
});
