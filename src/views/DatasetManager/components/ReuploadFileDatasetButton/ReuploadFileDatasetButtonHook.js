// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useSetApplicationErrorMessage } from '../../../../state/hooks/ApplicationHooks';
import { usePollTwingraphStatus, useUpdateDatasetInStore } from '../../../../state/hooks/DatasetHooks';
import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks';

export const useReuploadFileDatasetButton = () => {
  const organizationId = useOrganizationId();
  const pollTwingraphStatus = usePollTwingraphStatus();
  const updateDatasetInStore = useUpdateDatasetInStore();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  return { organizationId, pollTwingraphStatus, setApplicationErrorMessage, updateDatasetInStore };
};
