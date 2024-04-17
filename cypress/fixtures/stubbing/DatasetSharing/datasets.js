// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { ROLES } from '../../../commons/constants/generic/TestConstants';
import { DEFAULT_DATASET } from '../default/datasets';
import { USER_EXAMPLE } from '../default/users';

const PRIVATE_DATASET = {
  ...DEFAULT_DATASET,
  id: 'd-privateDts_1',
  name: 'Dataset ADT 1',
  main: true,
  tags: ['initial tag', 'Brewery'],
  description: 'Initial description',
  security: {
    default: ROLES.DATASET.NONE,
    accessControlList: [{ id: USER_EXAMPLE.email, role: ROLES.DATASET.ADMIN }],
  },
};

export const PRIVATE_DATASETS_LIST = [PRIVATE_DATASET];
