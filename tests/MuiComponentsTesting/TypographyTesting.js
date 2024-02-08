// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { getByDataCy } from '../utils';

export class TypographyTesting {
  constructor({ dataCy }) {
    this._dataCy = dataCy;
  }

  get Typography() {
    return getByDataCy(this._dataCy);
  }

  get text() {
    return this.Typography.textContent;
  }
}
