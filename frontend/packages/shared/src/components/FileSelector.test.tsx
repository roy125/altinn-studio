import React from 'react';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { IFileSelectorProps } from './FileSelector';
import FileSelector from './FileSelector';
import { mockUseTranslation } from '../../../../testing/mocks/i18nMock';
import { Button } from '@digdir/design-system-react';

const user = userEvent.setup();

// Test data:
const texts = {
  'general.label': 'download',
  'shared.submit_upload': 'upload',
  'app_data_modelling.upload_xsd': 'Upload button text',
};

jest.mock('react-i18next', () => ({ useTranslation: () => mockUseTranslation(texts) }));

const render = (props: Partial<IFileSelectorProps> = {}) => {
  const allProps: IFileSelectorProps = {
    submitHandler: jest.fn(),
    busy: false,
    formFileName: '',
    ...props,
  };

  rtlRender(<FileSelector {...allProps} />);
};

const testCustomButtonRenderer = (onClick: React.MouseEventHandler<HTMLButtonElement>) => (
  <Button onClick={onClick}>Lorem ipsum</Button>
);

describe('FileSelector', () => {
  it('should not call submitHandler when no files are selected', async () => {
    const handleSubmit = jest.fn();
    render({ submitHandler: handleSubmit });

    const fileInput = screen.getByTestId('FileSelector-input');
    await act(() => user.upload(fileInput, null));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should call submitHandler when a file is selected', async () => {
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });
    const handleSubmit = jest.fn();
    render({ submitHandler: handleSubmit });

    const fileInput = screen.getByTestId('FileSelector-input');
    await act(() => user.upload(fileInput, file));

    expect(handleSubmit).toHaveBeenCalledWith(expect.any(FormData), 'hello.png');
  });

  it('Should show text on the button by default', async () => {
    render();
    expect(screen.getByText('Upload button text')).toBeInTheDocument();
  });

  it('Should show custom button', async () => {
    render({ submitButtonRenderer: testCustomButtonRenderer });
    expect(screen.getByText('Lorem ipsum')).toBeInTheDocument();
  });

  it('Should call file input onClick handler when the default upload button is clicked', async () => {
    render();
    const button = screen.getByText('Upload button text');
    const fileInput = screen.getByTestId('FileSelector-input');
    fileInput.onclick = jest.fn();
    await act(() => user.click(button));
    expect(fileInput.onclick).toHaveBeenCalled();
  });

  it('Should call file input onClick handler when the custom upload button is clicked', async () => {
    render({ submitButtonRenderer: testCustomButtonRenderer });
    const button = screen.getByText('Lorem ipsum');
    const fileInput = screen.getByTestId('FileSelector-input');
    fileInput.onclick = jest.fn();
    await act(() => user.click(button));
    expect(fileInput.onclick).toHaveBeenCalled();
  });
});
