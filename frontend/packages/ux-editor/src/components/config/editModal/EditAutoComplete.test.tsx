import React from 'react';
import { EditAutoComplete } from './EditAutoComplete';
import { act, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { FormComponentType } from '../../../types/global';
import { ComponentType } from '../../index';

const componentMock: FormComponentType = {
  id: 'random-id',
  autocomplete: '',
  type: ComponentType.Input,
  itemType: 'COMPONENT'
};

test('should render first 6 suggestions on search field focused', async () => {
  render(<EditAutoComplete handleComponentChange={() => {}} component={componentMock} />);
  const user = userEvent.setup();

  const inputField = screen.getByRole('textbox');
  expect(inputField).toBeInTheDocument();

  await act(() => user.click(inputField));

  expect(await screen.findByRole('dialog')).toBeInTheDocument();
  expect(screen.getAllByRole('option')).toHaveLength(6);
});

test('should filter options while typing in search field', async () => {
  render(<EditAutoComplete handleComponentChange={() => {}} component={componentMock} />);
  const user = userEvent.setup();

  await act(() => user.type(screen.getByRole('textbox'), 'off'));

  await waitFor(() => expect(screen.getByRole('textbox')).toHaveValue('off'));

  expect(screen.getByRole('option', { name: 'off' })).toBeInTheDocument();
  expect(screen.queryByRole('option', { name: 'given-name' })).not.toBeInTheDocument();
});

test('should set the chosen options within the search field', async () => {
  render(<EditAutoComplete handleComponentChange={() => {}} component={componentMock} />);
  const user = userEvent.setup();

  const searchField = screen.getByRole('textbox');

  await act(() => user.type(searchField, 'of'));
  await waitFor(() => expect(searchField).toHaveValue('of'));
  await act(() => user.click(screen.getByRole('option', { name: 'off' })));

  await waitForElementToBeRemoved(screen.queryByRole('dialog'));
  await waitFor(() => expect(searchField).toHaveValue('off'));
});

test('should toggle autocomplete-popup based onFocus and onBlur', async () => {
  render(<EditAutoComplete handleComponentChange={() => {}} component={componentMock} />);
  const user = userEvent.setup();
  await act(() => user.click(screen.getByRole('textbox')));

  expect(await screen.findByRole('dialog')).toBeInTheDocument();

  await act(() => user.tab());
  await waitForElementToBeRemoved(screen.queryByRole('dialog'));
});

test('should call handleComponentChangeMock callback ', async () => {
  const handleComponentChangeMock = jest.fn();
  render(
    <EditAutoComplete handleComponentChange={handleComponentChangeMock} component={componentMock} />
  );

  const user = userEvent.setup();

  const inputField = screen.getByRole('textbox');
  expect(inputField).toBeInTheDocument();

  await act(() => user.click(inputField));
  await screen.findByRole('dialog');

  await act(() => user.click(screen.getByRole('option', { name: 'on' })));
  await waitForElementToBeRemoved(screen.queryByRole('dialog'));
  expect(handleComponentChangeMock).toHaveBeenCalledWith({
    autocomplete: 'on',
    id: 'random-id',
    itemType: 'COMPONENT',
    type: 'Input',
  });
});
