import React from 'react';
import { ShareChangesButton } from './ShareChangesButton';
import type { IShareChangesComponentProps } from './ShareChangesButton';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { textMock } from '../../../testing/mocks/i18nMock';

const user = userEvent.setup();

describe('shareChanges', () => {
  it('should call mock function when changes in local repo on click button', async () => {
    const handleShareChanges = jest.fn();
    render({ shareChanges: handleShareChanges });

    const shareButton = screen.getByRole('button', {
      name: textMock('sync_header.changes_to_share'),
    });
    await act(() => user.click(shareButton));

    expect(handleShareChanges).toHaveBeenCalled();
  });
});

const render = (props: Partial<IShareChangesComponentProps> = {}) => {
  const allProps = {
    classes: {},
    shareChanges: jest.fn(),
    changesInLocalRepo: true,
    hasPushRight: true,
    hasMergeConflict: false,
    language: {},
    ...props,
  };

  return rtlRender(<ShareChangesButton {...allProps} />);
};
