// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks';
import { usePollTwingraphStatus, useUpdateDatasetInStore } from '../../../../state/hooks/DatasetHooks';
import { useSetApplicationErrorMessage } from '../../../../state/hooks/ApplicationHooks';

export const useReuploadFileDatasetButton = () => {
  const organizationId = useOrganizationId();
  const pollTwingraphStatus = usePollTwingraphStatus();
  const updateDatasetInStore = useUpdateDatasetInStore();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  return { organizationId, pollTwingraphStatus, setApplicationErrorMessage, updateDatasetInStore };
};
