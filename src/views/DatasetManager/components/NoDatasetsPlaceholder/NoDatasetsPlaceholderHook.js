// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useUserPermissionsOnCurrentWorkspace } from '../../../../state/workspaces/hooks';

export const useNoDatasetsPlaceholder = () => {
  const userPermissionsOnCurrentWorkspace = useUserPermissionsOnCurrentWorkspace();
  return { userPermissionsOnCurrentWorkspace };
};
