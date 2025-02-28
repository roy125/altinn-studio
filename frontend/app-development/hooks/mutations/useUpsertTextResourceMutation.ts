import { useUpsertTextResourcesMutation } from './useUpsertTextResourcesMutation';
import { useMutation } from '@tanstack/react-query';
import { UpsertTextResourceMutation } from '@altinn/text-editor/src/types';

export const useUpsertTextResourceMutation = (owner, app) => {
  const { mutateAsync: upsertTextResources } = useUpsertTextResourcesMutation(owner, app);
  return useMutation({
    mutationFn: ({ textId, language, translation }: UpsertTextResourceMutation) =>
      upsertTextResources({ language, textResources: [{ id: textId, value: translation }] })
  });
};
