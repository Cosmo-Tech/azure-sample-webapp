// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { getByRole } from '@testing-library/react';
import { getByDataCy } from '../utils';

export class AccordionTesting {
  constructor({ dataCy, dataCyList }) {
    this._dataCy = dataCy;
    this._dataCyList = dataCyList;
  }

  get Container() {
    return getByDataCy(this._dataCy);
  }

  get ToggleButton() {
    return getByRole(this.Container, 'button');
  }
}
