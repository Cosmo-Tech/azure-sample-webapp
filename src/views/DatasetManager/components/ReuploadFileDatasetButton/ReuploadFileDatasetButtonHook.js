// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks';
import { usePollTwingraphStatus, useUpdateDatasetInStore } from '../../../../state/hooks/DatasetHooks';

export const useReuploadFileDatasetButton = () => {
  const organizationId = useOrganizationId();
  const pollTwingraphStatus = usePollTwingraphStatus();
  const updateDatasetInStore = useUpdateDatasetInStore();
  return { organizationId, pollTwingraphStatus, updateDatasetInStore };
};
