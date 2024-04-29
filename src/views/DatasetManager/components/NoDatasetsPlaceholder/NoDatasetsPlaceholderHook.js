// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useOrganizationData } from '../../../../state/hooks/OrganizationHooks';

export const useNoDatasetsPlaceholder = () => {
  const userPermissionsInCurrentOrganization = useOrganizationData()?.security?.currentUserPermissions ?? [];
  return { userPermissionsInCurrentOrganization };
};
