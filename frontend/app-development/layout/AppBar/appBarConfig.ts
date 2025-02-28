import { RepositoryType } from 'app-shared/types/global';

export interface TopBarMenuItem {
  key: TopBarMenu;
  link: string;
  repositoryTypes: RepositoryType[];
}

export enum TopBarMenu {
  About = 'top_menu.about',
  Create = 'top_menu.create',
  Datamodel = 'top_menu.datamodel',
  Text = 'top_menu.texts',
  Preview = 'top_menu.preview',
  Deploy = 'top_menu.deploy',
  Access = 'top_menu.access-controll',
  None = '',
}

export const menu: TopBarMenuItem[] = [
  {
    key: TopBarMenu.About,
    link: '/:org/:app',
    repositoryTypes: [RepositoryType.App, RepositoryType.Datamodels],
  },
  {
    key: TopBarMenu.Create,
    link: '/:org/:app/ui-editor',
    repositoryTypes: [RepositoryType.App],
  },
  {
    key: TopBarMenu.Datamodel,
    link: '/:org/:app/datamodel',
    repositoryTypes: [RepositoryType.App, RepositoryType.Datamodels],
  },
  {
    key: TopBarMenu.Text,
    link: '/:org/:app/text-editor',
    repositoryTypes: [RepositoryType.App],
  },

];

export const getTopBarMenu = (repositoryType: RepositoryType) => {
  return menu.filter((menuItem) => menuItem.repositoryTypes.includes(repositoryType));
};
