import { useDeleteDataset } from '../../../../state/datasets/hooks';

export const useDeleteDatasetButton = () => {
  const deleteDataset = useDeleteDataset();
  return {
    deleteDataset,
  };
};
