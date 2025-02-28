import React from 'react';
import type { EditSettings, IGenericEditComponent } from './componentConfig';
import { ComponentType } from '../index';
import type { FormComponentType, IAppState, IThirdPartyComponent } from '../../types/global';
import { EditComponentId } from './editModal/EditComponentId';
import { componentSpecificEditConfig, configComponents } from './componentConfig';
import { ComponentSpecificContent } from './componentSpecificContent';
import { FieldSet } from '@digdir/design-system-react';
import classes from './EditModalContent.module.css';
import { useSelector } from 'react-redux';

export interface IEditModalContentProps {
  cancelEdit?: () => void;
  component: FormComponentType;
  handleComponentUpdate?: (updatedComponent: FormComponentType) => void;
  saveEdit?: (updatedComponent: FormComponentType) => void;
  thirdPartyComponentConfig?: EditSettings[];
}

export const EditModalContent = ({
  component,
  handleComponentUpdate,
  thirdPartyComponentConfig,
}: IEditModalContentProps) => {
  const selectedLayout = useSelector(
    (state: IAppState) => state.formDesigner.layout?.selectedLayout
  );
  const renderFromComponentSpecificDefinition = (configDef: EditSettings[]) => {
    if (!configDef) return null;

    return configDef.map((configType) => {
      const Tag = configComponents[configType];
      if (!Tag) return null;
      return React.createElement<IGenericEditComponent>(Tag, {
        key: configType,
        handleComponentChange: handleComponentUpdate,
        component,
      });
    });
  };

  const getConfigDefinitionForComponent = (): EditSettings[] => {
    if (component.type === ComponentType.ThirdParty) {
      return thirdPartyComponentConfig[(component as IThirdPartyComponent).tagName];
    }

    return componentSpecificEditConfig[component.type];
  };

  return (
    <FieldSet className={classes.root}>
      <EditComponentId component={component} handleComponentUpdate={handleComponentUpdate} />
      {renderFromComponentSpecificDefinition(getConfigDefinitionForComponent())}
      <ComponentSpecificContent
        component={component}
        handleComponentChange={handleComponentUpdate}
        layoutName={selectedLayout}
      />
    </FieldSet>
  );
};
