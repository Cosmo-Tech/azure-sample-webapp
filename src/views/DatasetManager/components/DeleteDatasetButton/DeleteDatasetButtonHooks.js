import { useDeleteDataset } from '../../../../state/datasets/hooks';
import { useWorkspaceData } from '../../../../state/workspaces/hooks';

export const useDeleteDatasetButton = () => {
  const isDatasetCopyEnabledInWorkspace = useWorkspaceData()?.datasetCopy ?? false;
  const deleteDataset = useDeleteDataset();
  return {
    deleteDataset,
    isDatasetCopyEnabledInWorkspace,
  };
};
