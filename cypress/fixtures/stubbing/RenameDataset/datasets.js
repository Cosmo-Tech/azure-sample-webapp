// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { DEFAULT_DATASET } from '../default';

export const NON_EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'd-noneditable',
  name: 'non editable dataset',
  security: { default: 'viewer', accessControlList: [] },
};

export const EDITABLE_DATASET = {
  ...DEFAULT_DATASET,
  additionalData: { webapp: { visible: { datasetManager: true, scenarioCreation: true } } },
  id: 'd-editable',
  name: 'editable dataset',
  security: { default: 'editor', accessControlList: [] },
};
