import { ICreateFormContainer, IInternalLayout } from '../../types/global';
import { useFormLayoutsSelector } from '../useFormLayoutsSelector';
import { selectedLayoutWithNameSelector } from '../../selectors/formLayoutSelectors';
import { useMutation } from '@tanstack/react-query';
import { useFormLayoutMutation } from './useFormLayoutMutation';
import { deepCopy } from 'app-shared/pure';

export interface UpdateFormContainerMutationArgs {
  updatedContainer: ICreateFormContainer;
  id: string;
}

export const useUpdateFormContainerMutation = (org: string, app: string) => {
  const { layout, layoutName } = useFormLayoutsSelector(selectedLayoutWithNameSelector);
  const formLayoutMutation = useFormLayoutMutation(org, app, layoutName);

  return useMutation({
    mutationFn: ({ updatedContainer, id }: UpdateFormContainerMutationArgs) => {
      const oldLayout = deepCopy(layout);
      const newLayout: IInternalLayout = {
        ...oldLayout,
        containers: {
          ...oldLayout.containers,
          [id]: {
            ...oldLayout.containers[id],
            ...updatedContainer,
          }
        }
      }
      return formLayoutMutation.mutateAsync(newLayout);
    }
  });
};
