import React from 'react';
import axios from 'axios';
import type { IXSDUploadProps } from './XSDUpload';
import { XSDUpload } from './XSDUpload';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { textMock } from '../../../../../../testing/mocks/i18nMock';

const user = userEvent.setup();

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const clickUploadButton = async () => {
  const btn = screen.getByText(textMock('app_data_modelling.upload_xsd'));
  await act(() => user.click(btn));
};

const render = (props: Partial<IXSDUploadProps> = {}) => {
  const allProps = {
    language: {},
    org: 'test-org',
    repo: 'test-repo',
    onXSDUploaded: jest.fn(),
    labelTextResource: 'app_data_modelling.upload_xsd',
    isInTopToolbar: true,
    ...props,
  } as IXSDUploadProps;

  rtlRender(<XSDUpload {...allProps} />);
};

describe('XSDUpload', () => {
  afterEach(() => jest.restoreAllMocks());
  it('should show file picker button', () => {
    render();

    const button = screen.getByText(textMock('app_data_modelling.upload_xsd'));
    expect(button).toBeInTheDocument();

    const fileInput = screen.queryByTestId('FileSelector-input');
    expect(fileInput).toBeInTheDocument();
  });

  it('should show error text when file upload results in error', async () => {
    mockedAxios.post.mockImplementation(() => Promise.reject(new Error('mocked error')));
    const file = new File(['hello'], 'hello.xsd', { type: 'text/xml' });
    render();

    await clickUploadButton();

    expect(
      screen.queryByText(textMock('form_filler.file_uploader_validation_error_upload'))
    ).not.toBeInTheDocument();

    const fileInput = screen.getByTestId('FileSelector-input');

    await act(() => user.upload(fileInput, file));

    expect(
      screen.getByText(textMock('form_filler.file_uploader_validation_error_upload'))
    ).toBeInTheDocument();
  });

  it('should call onXSDUploaded callback when upload is successful', async () => {
    mockedAxios.post.mockImplementation(() => Promise.resolve({ status: 200 }));
    const file = new File(['hello'], 'hello.xsd', { type: 'text/xml' });
    const handleUpload = jest.fn();
    render({ onXSDUploaded: handleUpload });

    await clickUploadButton();

    const fileInput = screen.getByTestId('FileSelector-input');

    await act(() => user.upload(fileInput, file));

    expect(handleUpload).toHaveBeenCalledWith('hello.xsd');
  });
});
