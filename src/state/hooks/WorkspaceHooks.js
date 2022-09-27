// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useSelector } from 'react-redux';

export const useWorkspace = () => {
  return useSelector((state) => state.workspace.current);
};
