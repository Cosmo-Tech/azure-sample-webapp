// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { fireEvent } from '@testing-library/react';
import { getByDataCy } from '../utils';

export class ButtonTesting {
  constructor({ dataCy }) {
    this._dataCy = dataCy;
  }

  get Button() {
    return getByDataCy(this._dataCy);
  }

  click() {
    fireEvent.click(this.Button);
  }
}
