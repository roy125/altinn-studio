import { IInternalLayout } from '../../types/global';
import { useFormLayoutsSelector } from '../useFormLayoutsSelector';
import { selectedLayoutWithNameSelector } from '../../selectors/formLayoutSelectors';
import { useMutation } from '@tanstack/react-query';
import { useFormLayoutMutation } from './useFormLayoutMutation';
import { deepCopy } from 'app-shared/pure';

export const useDeleteFormContainerMutation = (org: string, app: string) =>  {
  const { layout, layoutName } = useFormLayoutsSelector(selectedLayoutWithNameSelector);
  const formLayoutsMutation = useFormLayoutMutation(org, app, layoutName);
  return useMutation({
    mutationFn: (id: string) => {

      const updatedLayout: IInternalLayout = deepCopy(layout);

      // Delete child components:
      // Todo: Consider if this should rather be done in the backend
      for (const componentId of layout.order[id]) {
        if (Object.keys(layout.components).indexOf(componentId) > -1) {
          delete updatedLayout.containers[componentId];
          delete updatedLayout.order[componentId];
          updatedLayout.order[id].splice(updatedLayout.order[id].indexOf(componentId), 1);
        }
      }

      // Find parent container ID:
      let parentContainerId = Object.keys(layout.order)[0];
      Object.keys(layout.order).forEach((cId) => {
        if (layout.order[cId].find((containerId) => containerId === id)) {
          parentContainerId = cId;
        }
      });

      // Delete container:
      delete updatedLayout.containers[id];
      delete updatedLayout.order[id];
      if (parentContainerId) {
        updatedLayout.order[parentContainerId].splice(
          updatedLayout.order[parentContainerId].indexOf(id),
          1
        );
      }

      return formLayoutsMutation.mutateAsync(updatedLayout);
    }
  });
};
