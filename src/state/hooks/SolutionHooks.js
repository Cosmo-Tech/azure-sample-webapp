// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSelector } from 'react-redux';

export const useSolution = () => {
  return useSelector((state) => state.solution.current);
};
