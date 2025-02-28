import React from 'react';
import { fireEvent, screen, within } from '@testing-library/react';

import { EditHeaderSize } from './EditHeaderSize';
import { renderWithMockStore } from '../../../testing/mocks';
import { mockUseTranslation } from '../../../../../../testing/mocks/i18nMock';
import { ComponentType } from '../../index';

const h4Text = 'Undertittel (H4)';
const h3Text = 'Undertittel (H3)';
const h2Text = 'Undertittel (H2)';

jest.mock('react-i18next', () => ({
  useTranslation: () => mockUseTranslation({
    'ux_editor.modal_header_type_h4': h4Text,
    'ux_editor.modal_header_type_h3': h3Text,
    'ux_editor.modal_header_type_h2': h2Text,
  })
}));

const render = ({ size = undefined, handleComponentChange = jest.fn() } = {}) => {
  renderWithMockStore()(
    <EditHeaderSize
      handleComponentChange={handleComponentChange}
      component={{
        id: 'c24d0812-0c34-4582-8f31-ff4ce9795e96',
        type: ComponentType.Header,
        textResourceBindings: {
          title: 'ServiceName',
        },
        size,
        itemType: 'COMPONENT',
      }}
    />,
  );
};

interface IOpenHeaderSelect {
  selectWrapperTestId: string;
}

const openHeaderSelect = ({ selectWrapperTestId }: IOpenHeaderSelect) => {
  const headerSizeSelectWrapper = screen.getByTestId(selectWrapperTestId);
  const toggle = within(headerSizeSelectWrapper).getByDisplayValue('');

  fireEvent.focus(toggle);
  fireEvent.keyDown(toggle, { key: 'ArrowDown', keyCode: 40 });
};

describe('HeaderSizeSelect', () => {
  it('should show selected title size as h4 when no size is set', () => {
    render();

    expect(screen.getByText(h4Text)).toBeInTheDocument();
    expect(screen.queryByText(h3Text)).not.toBeInTheDocument();
    expect(screen.queryByText(h2Text)).not.toBeInTheDocument();
  });

  it('should show selected title size as h4 when "h4" size is set', () => {
    render({ size: 'h4' });

    expect(screen.getByText(h4Text)).toBeInTheDocument();
    expect(screen.queryByText(h3Text)).not.toBeInTheDocument();
    expect(screen.queryByText(h2Text)).not.toBeInTheDocument();
  });

  it('should show selected title size as h4 when "S" size is set', () => {
    render({ size: 'S' });

    expect(screen.getByText(h4Text)).toBeInTheDocument();
    expect(screen.queryByText(h3Text)).not.toBeInTheDocument();
    expect(screen.queryByText(h2Text)).not.toBeInTheDocument();
  });

  it('should show selected title size as h3 when "h3" size is set', () => {
    render({ size: 'h3' });

    expect(screen.queryByText(h4Text)).not.toBeInTheDocument();
    expect(screen.getByText(h3Text)).toBeInTheDocument();
    expect(screen.queryByText(h2Text)).not.toBeInTheDocument();
  });

  it('should show selected title size as h3 when "M" size is set', () => {
    render({ size: 'M' });

    expect(screen.queryByText(h4Text)).not.toBeInTheDocument();
    expect(screen.getByText(h3Text)).toBeInTheDocument();
    expect(screen.queryByText(h2Text)).not.toBeInTheDocument();
  });

  it('should show selected title size as h2 when "h2" size is set', () => {
    render({ size: 'h2' });

    expect(screen.queryByText(h4Text)).not.toBeInTheDocument();
    expect(screen.queryByText(h3Text)).not.toBeInTheDocument();
    expect(screen.getByText(h2Text)).toBeInTheDocument();
  });

  it('should show selected title size as h2 when "L" size is set', () => {
    render({ size: 'L' });

    expect(screen.queryByText(h4Text)).not.toBeInTheDocument();
    expect(screen.queryByText(h3Text)).not.toBeInTheDocument();
    expect(screen.getByText(h2Text)).toBeInTheDocument();
  });

  it('should call handleUpdateHeaderSize when size is changed', () => {
    const handleComponentChange = jest.fn();
    render({ handleComponentChange, size: 'h4' });

    openHeaderSelect({ selectWrapperTestId: 'header-size-select-wrapper' });

    const h2Select = screen.getByText(h2Text);

    fireEvent.click(h2Select);

    expect(handleComponentChange).toHaveBeenCalledWith({
      id: 'c24d0812-0c34-4582-8f31-ff4ce9795e96',
      itemType: 'COMPONENT',
      type: ComponentType.Header,
      textResourceBindings: {
        title: 'ServiceName',
      },
      size: 'h2',
    });
  });
});
