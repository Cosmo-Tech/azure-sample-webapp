// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.
import { useSetApplicationErrorMessage } from '../../../../state/app/hooks';
import { usePollTwingraphStatus, useUpdateDatasetInStore } from '../../../../state/datasets/hooks';
import { useOrganizationId } from '../../../../state/organizations/hooks';

export const useReuploadFileDatasetButton = () => {
  const organizationId = useOrganizationId();
  const pollTwingraphStatus = usePollTwingraphStatus();
  const updateDatasetInStore = useUpdateDatasetInStore();
  const setApplicationErrorMessage = useSetApplicationErrorMessage();
  return { organizationId, pollTwingraphStatus, setApplicationErrorMessage, updateDatasetInStore };
};
