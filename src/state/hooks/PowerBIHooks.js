// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSelector } from 'react-redux';

export const usePowerBIInfo = () => {
  return useSelector((state) => state.powerBI);
};
