// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useOrganizationData } from '../../../../state/organizations/hooks';

export const useNoDatasetsPlaceholder = () => {
  const userPermissionsInCurrentOrganization = useOrganizationData()?.security?.currentUserPermissions ?? [];
  return { userPermissionsInCurrentOrganization };
};
