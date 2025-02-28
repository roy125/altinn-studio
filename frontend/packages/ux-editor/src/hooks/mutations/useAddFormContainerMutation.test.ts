import { layout1NameMock, queriesMock, renderHookWithMockStore } from '../../testing/mocks';
import { useFormLayoutsQuery } from '../queries/useFormLayoutsQuery';
import { waitFor } from '@testing-library/react';
import { AddFormContainerMutationArgs, useAddFormContainerMutation } from './useAddFormContainerMutation';
import { ICreateFormContainer } from '../../types/global';
import { ComponentType } from '../../components';

// Test data:
const org = 'org';
const app = 'app';
const id = 'testid';
const container: ICreateFormContainer = {
  itemType: 'CONTAINER',
}
const defaultArgs: AddFormContainerMutationArgs = {
  container
};

// Mocks:
jest.mock('../../utils/generateId', () => ({
  generateComponentId: () => id,
}));

describe('useAddFormContainerMutation', () => {
  it('Calls saveFormLayout with correct arguments and payload', async () => {
    const { result } = await renderAddFormContainerMutation();
    await result.current.mutateAsync(defaultArgs);
    expect(queriesMock.saveFormLayout).toHaveBeenCalledTimes(1);
    expect(queriesMock.saveFormLayout).toHaveBeenCalledWith(
      org,
      app,
      layout1NameMock,
      expect.objectContaining({
        data: expect.objectContaining({
          layout: expect.arrayContaining([
            {
              id,
              type: ComponentType.Group,
              children: [],
            }
          ])
        })
      })
    );
  });
});

const renderAddFormContainerMutation = async () => {
  const formLayoutsResult = renderHookWithMockStore()(() => useFormLayoutsQuery(org, app)).renderHookResult.result;
  await waitFor(() => expect(formLayoutsResult.current.isSuccess).toBe(true));
  return renderHookWithMockStore()(() => useAddFormContainerMutation(org, app)).renderHookResult;
};
