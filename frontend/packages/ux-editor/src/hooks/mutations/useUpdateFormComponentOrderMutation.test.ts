// Test data:
import {
  component1IdMock,
  component2IdMock,
  container1IdMock, layout1NameMock,
  layoutMock, queriesMock,
  renderHookWithMockStore
} from '../../testing/mocks';
import { useFormLayoutsQuery } from '../queries/useFormLayoutsQuery';
import { waitFor } from '@testing-library/react';
import { useUpdateFormComponentOrderMutation } from './useUpdateFormComponentOrderMutation';
import { IFormLayoutOrder } from '../../types/global';

const org = 'org';
const app = 'app';

describe('useUpdateFormComponentOrderMutation', () => {
  afterEach(jest.clearAllMocks);

  it('Calls updateFormComponentOrder with correct arguments and payload', async () => {
    await renderAndWaitForData();

    const componentOrderResult = renderHookWithMockStore()(() => useUpdateFormComponentOrderMutation(org, app))
      .renderHookResult
      .result;

    const newOrder: IFormLayoutOrder = {
      ...layoutMock.order,
      [container1IdMock]: [component2IdMock, component1IdMock]
    };
    await componentOrderResult.current.mutateAsync(newOrder);

    expect(queriesMock.saveFormLayout).toHaveBeenCalledTimes(1);
    expect(queriesMock.saveFormLayout).toHaveBeenCalledWith(
      org,
      app,
      layout1NameMock,
      expect.objectContaining({
        data: expect.objectContaining({
          layout: [
            expect.objectContaining({ id: container1IdMock }),
            expect.objectContaining({ id: component2IdMock }),
            expect.objectContaining({ id: component1IdMock }),
          ]
        })
      })
    );
  });
});

const renderAndWaitForData = async () => {
  const formLayoutsResult = renderHookWithMockStore()(() => useFormLayoutsQuery(org, app)).renderHookResult.result;
  await waitFor(() => expect(formLayoutsResult.current.isSuccess).toBe(true));
}
