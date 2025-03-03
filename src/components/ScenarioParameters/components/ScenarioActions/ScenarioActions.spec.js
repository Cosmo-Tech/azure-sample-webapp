// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

/* eslint-disable react/prop-types */
import React from 'react';
import { useFormState } from 'react-hook-form';
import { ButtonTesting, TypographyTesting } from '../../../../../tests/MuiComponentsTesting';
import { customRender, getByDataCy } from '../../../../../tests/utils';
import { RUNNER_RUN_STATE } from '../../../../services/config/ApiConstants';
import { useCurrentSimulationRunnerState } from '../../../../state/runner/hooks';
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

const mockUseStartRunner = jest.fn();
const mockUseUpdateAndStartRunner = jest.fn();
const mockUseUpdateRunner = jest.fn();
const mockOpenDialog = jest.fn();

jest.mock('../../../../state/runner/hooks', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../state/runner/hooks'),
  useStartRunner: () => mockUseStartRunner,
  useUpdateAndStartRunner: () => mockUseUpdateAndStartRunner,
  useUpdateSimulationRunner: () => mockUseUpdateRunner,
  useCurrentSimulationRunnerState: jest.fn(),
  useStopSimulationRunner: jest.fn(),
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
    useCurrentSimulationRunnerState.mockReturnValue(() => null);
  });

  describe('Test scenario buttons if form is not dirty', () => {
    beforeAll(() => {
      useFormState.mockReturnValue({ isDirty: false });
      customRender(<ScenarioActions />);
    });

    beforeEach(() => {
      mockUseStartRunner.mockClear();
    });

    test('Check buttons', async () => {
      expect(launchScenarioButton.Button).toBeVisible();
      expect(getByDataCy('launch-label')).toBeVisible();
      await launchScenarioButton.click();
      expect(mockUseStartRunner).toHaveBeenCalled();

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
      mockUseUpdateAndStartRunner.mockClear();
      mockUseUpdateRunner.mockClear();
      mockOpenDialog.mockClear();
    });

    test('Check buttons', async () => {
      expect(launchScenarioButton.Button).toBeVisible();
      expect(getByDataCy('save-and-launch-label')).toBeVisible();
      await launchScenarioButton.click();
      expect(mockUseUpdateAndStartRunner).toHaveBeenCalled();

      expect(saveScenarioButton.Button).toBeVisible();
      await saveScenarioButton.click();
      expect(mockUseUpdateRunner).toHaveBeenCalled();

      expect(discardChangesButton.Button).toBeVisible();
      await discardChangesButton.click();
      await expect(mockOpenDialog).toHaveBeenCalled();
    });
  });
});

describe('Test scenario buttons when scenario is running', () => {
  beforeAll(() => {
    useCurrentSimulationRunnerState.mockReturnValue(RUNNER_RUN_STATE.RUNNING);
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
