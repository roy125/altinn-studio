import type { IThirdPartyComponent, IWidgetTexts } from '../types/global';
import type { EditSettings } from './config/componentConfig';

export interface IComponentIcon {
  [key: string]: string;
}

export interface IComponent {
  name: string;
  customProperties?: any;
  Icon: string;
}

export interface IThirdPartyComponentDefinition {
  displayName: string;
  componentDefinition: IThirdPartyComponent;
  editSettings: EditSettings[];
  texts: IWidgetTexts[];
}

export interface IThirdPartyComponentCustomProps {
  tagName: string;
  framework: 'WebComponent' | string;
  [id: string]: any;
}

// The order here should be the same as
// the exported 'components' list (drag and drop)
export enum ComponentType {
  Header = 'Header',
  Paragraph = 'Paragraph',
  Input = 'Input',
  Image = 'Image',
  Datepicker = 'Datepicker',
  Dropdown = 'Dropdown',
  Checkboxes = 'Checkboxes',
  RadioButtons = 'RadioButtons',
  TextArea = 'TextArea',
  FileUpload = 'FileUpload',
  FileUploadWithTag = 'FileUploadWithTag',
  Button = 'Button',
  AddressComponent = 'AddressComponent',
  Group = 'Group',
  NavigationBar = 'NavigationBar',
  NavigationButtons = 'NavigationButtons',
  AttachmentList = 'AttachmentList',
  ThirdParty = 'ThirdParty',
  Panel = 'Panel',
  Map = 'Map',
}

export const componentIcons: IComponentIcon = {
  Header: 'fa fa-title',
  Paragraph: 'fa fa-paragraph',
  Input: 'fa fa-short-answer',
  Image: 'fa fa-bilde',
  Datepicker: 'fa fa-date',
  Dropdown: 'fa fa-drop-down',
  Checkboxes: 'fa fa-checkbox',
  RadioButtons: 'fa fa-radio-button',
  TextArea: 'fa fa-long-answer',
  FileUpload: 'fa fa-attachment',
  FileUploadWithTag: 'fa fa-attachment',
  Button: 'fa fa-button',
  AddressComponent: 'fa fa-address',
  Group: 'fa fa-group',
  NavigationBar: 'fa fa-page-navigation',
  NavigationButtons: 'fa fa-button',
  AttachmentList: 'fa fa-attachment',
  Panel: 'fa fa-paragraph', // TODO make sure to use the correct icon.
  Map: 'fa fa-address',
};
const Header: IComponent = {
  name: ComponentType.Header,
  Icon: componentIcons.Header,
  customProperties: {
    size: 'L',
  },
};
const Paragraph: IComponent = {
  name: ComponentType.Paragraph,
  Icon: componentIcons.Paragraph,
};

const Input: IComponent = {
  name: ComponentType.Input,
  customProperties: {
    required: true,
    readOnly: false,
  },
  Icon: componentIcons.Input,
};

const TextArea: IComponent = {
  name: ComponentType.TextArea,
  customProperties: {
    required: true,
    readOnly: false,
  },
  Icon: componentIcons.TextArea,
};
const Checkboxes: IComponent = {
  name: ComponentType.Checkboxes,
  Icon: componentIcons.Checkboxes,
  customProperties: {
    options: [],
    required: true,
  },
};
const RadioButtons: IComponent = {
  name: ComponentType.RadioButtons,
  Icon: componentIcons.RadioButtons,
  customProperties: {
    options: [],
    required: true,
  },
};
const Dropdown: IComponent = {
  name: ComponentType.Dropdown,
  Icon: componentIcons.Dropdown,
};
const FileUpload: IComponent = {
  name: ComponentType.FileUpload,
  Icon: componentIcons.FileUpload,
  customProperties: {
    maxFileSizeInMB: 25,
    maxNumberOfAttachments: 1,
    minNumberOfAttachments: 1,
    displayMode: 'simple',
    required: true,
  },
};
const FileUploadWithTag: IComponent = {
  name: ComponentType.FileUploadWithTag,
  Icon: componentIcons.FileUploadWithTag,
  customProperties: {
    maxFileSizeInMB: 25,
    maxNumberOfAttachments: 1,
    minNumberOfAttachments: 1,
    required: true,
  },
};
const Datepicker: IComponent = {
  name: ComponentType.Datepicker,
  customProperties: {
    readOnly: false,
    minDate: '1900-01-01T12:00:00.000Z',
    maxDate: '2100-01-01T12:00:00.000Z',
  },
  Icon: componentIcons.Datepicker,
};
const Button: IComponent = {
  name: ComponentType.Button,
  Icon: componentIcons.Button,
};
const Image: IComponent = {
  name: ComponentType.Image,
  Icon: componentIcons.Image,
  customProperties: {
    image: {
      src: {},
      width: '100%',
      align: 'center',
    },
  },
};

const AddressComponent: IComponent = {
  name: ComponentType.AddressComponent,
  Icon: componentIcons.AddressComponent,
  customProperties: {
    simplified: true,
    readOnly: false,
  },
};
const AttachmentList: IComponent = {
  name: ComponentType.AttachmentList,
  Icon: componentIcons.AttachmentList,
};
const Group: IComponent = {
  name: ComponentType.Group,
  Icon: componentIcons.Group,
  customProperties: {
    maxCount: 0,
    children: [],
  },
};
const NavigationBar: IComponent = {
  name: ComponentType.NavigationBar,
  Icon: componentIcons.NavigationBar,
};

const InformationPanel: IComponent = {
  name: ComponentType.Panel,
  Icon: componentIcons.Panel,
};

const Map: IComponent = {
  name: ComponentType.Map,
  Icon: componentIcons.Map,
};

export const advancedComponents: IComponent[] = [
  AddressComponent,
  AttachmentList,
  Group,
  NavigationBar,
  Map,
];

export const schemaComponents: IComponent[] = [
  Input,
  TextArea,
  Checkboxes,
  RadioButtons,
  Dropdown,
  FileUpload,
  FileUploadWithTag,
  Datepicker,
  Button,
  Image,
];

export const textComponents: IComponent[] = [Header, Paragraph, InformationPanel];

export const confOnScreenComponents: IComponent[] = [Header, Paragraph, AttachmentList, Image];
