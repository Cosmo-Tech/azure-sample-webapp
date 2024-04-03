import { useDeleteDataset } from '../../../../state/hooks/DatasetHooks';
import { useWorkspaceData } from '../../../../state/hooks/WorkspaceHooks';

export const useDeleteDatasetButton = () => {
  const isDatasetCopyEnabledInWorkspace = useWorkspaceData()?.datasetCopy ?? false;
  const deleteDataset = useDeleteDataset();
  return {
    deleteDataset,
    isDatasetCopyEnabledInWorkspace,
  };
};
