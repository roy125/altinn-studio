import React from 'react';
import { PlusCircleIcon } from '@navikt/aksel-icons';
import type { IconImage } from './Icon';
import { Icon } from './Icon';
import classes from './ActionMenu.module.css';
import cn from 'classnames';

export interface IActionMenuProps {
  className?: string;
  items: IActionMenuItemProps[];
  openButtonText: string;
}

export interface IActionMenuItemProps {
  action: () => void;
  className?: string;
  icon: IconImage;
  text: string;
  testId?: string;
}

export const ActionMenu = ({ openButtonText, className, items }: IActionMenuProps) => (
  <div className={cn(classes.root, className)}>
    <div className={classes.menu}>
      <button className={classes.openButton}>
        <PlusCircleIcon className={classes.openButtonIcon} />
        <span className={classes.openButtonText}>{openButtonText}</span>
      </button>
      <ul className={classes.list}>
        {items.map((item) => (
          <ActionMenuItem key={item.text} {...item} />
        ))}
      </ul>
    </div>
  </div>
);

const ActionMenuItem = ({ action, className, icon, text, testId }: IActionMenuItemProps) => (
  <li className={cn(classes.item, className)} data-testid='menuitem-action-menu'>
    <button
      className={classes.itemButton}
      name={text}
      onClick={(event) => {
        action();
        event.currentTarget.blur();
      }}
      role='menuitem'
      data-testid={testId}
    >
      <Icon image={icon} className={classes.icon} />
      {text}
    </button>
  </li>
);
