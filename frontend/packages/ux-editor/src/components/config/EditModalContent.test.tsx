import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { EditModalContent } from './EditModalContent';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IAppState } from '../../types/global';
import { appStateMock, queriesMock } from '../../testing/mocks';
import { mockUseTranslation } from '../../../../../testing/mocks/i18nMock';
import { ServicesContextProvider } from '../../../../../app-development/common/ServiceContext';

const user = userEvent.setup();

// Test data:
const srcValueLabel = 'Source';
const texts = {
  'general.label': '',
  'general.value': '',
  'ux_editor.modal_header_type_h2': 'H2',
  'ux_editor.modal_header_type_h3': 'H3',
  'ux_editor.modal_header_type_h4': 'H4',
  'ux_editor.modal_properties_image_src_value_label': srcValueLabel,
  'ux_editor.modal_properties_image_placement_label': 'Placement',
  'ux_editor.modal_properties_image_alt_text_label': 'Alt text',
  'ux_editor.modal_properties_image_width_label': 'Width',
};

// Mocks:
jest.mock('react-i18next', () => ({ useTranslation: () => mockUseTranslation(texts) }));

describe('EditModalContent', () => {
  test('should return input specific content when type input', () => {
    render({
      componentProps: {
        type: 'Input',
      },
    });

    const labels = [
      'ux_editor.modal_properties_component_change_id',
      'ux_editor.modal_properties_data_model_helper',
      'ux_editor.modal_configure_read_only',
    ];

    labels.map((label) => expect(screen.getByLabelText(label)));
    expect(screen.getByRole('combobox'));
    expect(screen.getByLabelText('Autocomplete (WCAG)'));
  });

  test('should return header specific content when type header', () => {
    render({
      componentProps: {
        type: 'Header',
      },
    });

    const labels = [
      'ux_editor.modal_properties_component_change_id',
      'ux_editor.modal_header_type_helper',
    ];
    labels.map((label) => expect(screen.getByLabelText(label)));
  });

  test('should return file uploader specific content when type file uploader', () => {
    render({
      componentProps: {
        type: 'FileUpload',
      },
    });

    const labels = [
      'ux_editor.modal_properties_component_change_id',
      'ux_editor.modal_properties_file_upload_simple',
      'ux_editor.modal_properties_file_upload_list',
      'ux_editor.modal_properties_valid_file_endings_all',
      'ux_editor.modal_properties_valid_file_endings_custom',
      'ux_editor.modal_properties_minimum_files',
      'ux_editor.modal_properties_maximum_files',
      'ux_editor.modal_properties_maximum_file_size (ux_editor.modal_properties_maximum_file_size_helper)',
    ];

    labels.map((label) => expect(screen.getByLabelText(label)));
  });

  test('should call handleComponentUpdate with max number of attachments to 1 when clearing max number of attachments', async () => {
    const handleUpdate = jest.fn();
    const { allComponentProps } = render({
      componentProps: {
        maxNumberOfAttachments: 3,
        type: 'FileUpload',
      },
      handleComponentUpdate: handleUpdate,
    });

    const maxFilesInput = screen.getByLabelText('ux_editor.modal_properties_maximum_files');

    await act(() => user.clear(maxFilesInput));
    expect(handleUpdate).toHaveBeenCalledWith({
      ...allComponentProps,
      maxNumberOfAttachments: 1,
    });
  });

  test('should call handleComponentUpdate with required: false when min number of attachments is set to 0', async () => {
    const handleUpdate = jest.fn();
    const { allComponentProps } = render({
      componentProps: {
        required: true,
        minNumberOfAttachments: 1,
        type: 'FileUpload',
      },
      handleComponentUpdate: handleUpdate,
    });

    const minFilesInput = screen.getByLabelText('ux_editor.modal_properties_minimum_files');

    await act(() => user.clear(minFilesInput));
    expect(handleUpdate).toHaveBeenCalledWith({
      ...allComponentProps,
      required: false,
      minNumberOfAttachments: 0,
    });
  });

  test('should return button spesific content when type button', () => {
    render({
      componentProps: {
        type: 'Button',
      },
    });

    expect(screen.getByTestId('component-id-inputundefined-default')).toBeInTheDocument();
    expect(screen.queryAllByRole('combobox').length).toBe(1);
  });

  test('should render Image component when component type is Image', () => {
    render({
      componentProps: {
        type: 'Image',
      },
    });

    expect(screen.getByLabelText(srcValueLabel)).toBeInTheDocument();
  });

  it('should not render Image component when component type is not Image', () => {
    render({
      componentProps: {
        type: 'Button',
      },
    });

    expect(screen.queryByLabelText(srcValueLabel)).not.toBeInTheDocument();
  });
});

const render = ({ componentProps = undefined, handleComponentUpdate = jest.fn } = {}) => {
  const createStore = configureStore();
  const initialState: IAppState = {
    ...appStateMock,
    formDesigner: {
      layout: {
        activeContainer: null,
        activeList: null,
        error: null,
        invalidLayouts: [],
        saving: false,
        selectedLayout: 'FormLayout',
        unSavedChanges: false,
      },
    },
  };

  const store = createStore(initialState);

  const allComponentProps = {
    dataModelBindings: {},
    readOnly: false,
    required: false,
    textResourceBindings: {
      title: 'title',
    },
    type: 'Input',
    ...componentProps,
  };

  return {
    rendered: rtlRender(
      <Provider store={store}>
        <ServicesContextProvider {...queriesMock}>
          <EditModalContent
            component={allComponentProps}
            handleComponentUpdate={handleComponentUpdate}
          />
        </ServicesContextProvider>
      </Provider>
    ),
    allComponentProps,
  };
};
