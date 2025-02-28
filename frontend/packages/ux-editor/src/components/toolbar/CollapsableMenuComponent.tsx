import React from 'react';
import classes from './CollapsableMenuComponent.module.css';
import type { CollapsableMenus } from '../../types/global';
import { ChevronDownIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { getCollapsableMenuTitleByType } from '../../utils/language';
import { useTranslation } from 'react-i18next';

export interface ICollapsableMenuProvidedProps {
  onClick: any;
  menuType: CollapsableMenus;
  menuIsOpen: boolean;
}

export const CollapsableMenuComponent = (props: ICollapsableMenuProvidedProps) => {
  const { t } = useTranslation();
  return (
    <button
      className={classes.collapsableMenuComponent}
      onClick={() => props.onClick(props.menuType)}
    >
      <div className={classes.icon}>
        {props.menuIsOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </div>
      <div className={classes.text}>{getCollapsableMenuTitleByType(props.menuType, t)}</div>
    </button>
  );
};
