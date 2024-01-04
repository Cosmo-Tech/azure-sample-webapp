// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import { useOrganizationId } from '../../../../state/hooks/OrganizationHooks';
import { useResetDatasetTwingraphQueriesResults } from '../../../../state/hooks/DatasetTwingraphQueriesResultsHooks';

export const useReuploadFileDatasetButton = () => {
  const organizationId = useOrganizationId();
  const resetDatasetTwingraphQueriesResults = useResetDatasetTwingraphQueriesResults();
  return { organizationId, resetDatasetTwingraphQueriesResults };
};
