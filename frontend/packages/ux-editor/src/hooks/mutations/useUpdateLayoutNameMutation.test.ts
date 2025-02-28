import { layout1NameMock, queriesMock, renderHookWithMockStore } from '../../testing/mocks';
import { useFormLayoutsQuery } from '../queries/useFormLayoutsQuery';
import { useFormLayoutSettingsQuery } from '../queries/useFormLayoutSettingsQuery';
import { waitFor } from '@testing-library/react';
import { UpdateLayoutNameMutationArgs, useUpdateLayoutNameMutation } from './useUpdateLayoutNameMutation';

// Test data:
const org = 'org';
const app = 'app';
const newName = 'newName';
const oldName = layout1NameMock;
const args: UpdateLayoutNameMutationArgs = { newName, oldName };

describe('useUpdateLayoutNameMutation', () => {
  afterEach(jest.clearAllMocks);

  it('Updates layout name', async () => {
    await renderAndWaitForData();

    const updateLayoutNameResult = renderHookWithMockStore()(() => useUpdateLayoutNameMutation(org, app))
      .renderHookResult
      .result;

    await updateLayoutNameResult.current.mutateAsync(args);

    expect(queriesMock.updateFormLayoutName).toHaveBeenCalledTimes(1);
    expect(queriesMock.updateFormLayoutName).toHaveBeenCalledWith(org, app, oldName, newName);
  });
});

const renderAndWaitForData = async () => {
  const formLayoutsResult = renderHookWithMockStore()(() => useFormLayoutsQuery(org, app)).renderHookResult.result;
  const settingsResult = renderHookWithMockStore()(() => useFormLayoutSettingsQuery(org, app)).renderHookResult.result;
  await waitFor(() => expect(formLayoutsResult.current.isSuccess).toBe(true));
  await waitFor(() => expect(settingsResult.current.isSuccess).toBe(true));
}
