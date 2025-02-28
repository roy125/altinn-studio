export interface ISelfLinks {
  apps: string;
  platform: string;
}

export interface IAttachment {
  name: string;
  iconClass: string;
  url: string;
}

export interface IData {
  id: string;
  dataType: string;
  filename: string;
  contentType: string;
  storageUrl: string;
  selfLinks: ISelfLinks;
  size: number;
  locked: boolean;
  created: Date;
  lastChanged: Date;
}

export interface ILayoutSettings {
  $schema?: string;
  pages?: IPagesSettings;
  components?: IComponentsSettings;
  receiptLayoutName?: string;
}

export interface IPagesSettings {
  order?: string[];
  excludeFromPdf?: string[];
}

export interface IComponentsSettings {
  excludeFromPdf?: string[];
}

export interface IRepository {
  name: string;
  full_name: string;
  owner: IUser;
  description: string;
  is_cloned_to_local: boolean;
  updated_at: string;
  html_url: string;
  clone_url: string;
  id: number;
  user_has_starred: boolean;
}

export enum RepositoryType {
  App = 'App',
  Datamodels = 'Datamodels',
  Unknown = 'Unknown',
}

export interface IUser {
  avatar_url: string;
  login: string;
  full_name: string;
}

export interface IGiteaOrganisation {
  avatar_url: string;
  description?: string;
  id: number;
  location?: string;
  username: string;
  website?: string;
  full_name?: string;
}

export interface IContentStatus {
  filePath: string;
  fileStatus: string;
}

export interface IGitStatus {
  behindBy: number;
  aheadBy: number;
  contentStatus: IContentStatus[];
  repositoryStatus: string;
  hasMergeConflict: boolean;
}

export interface GenerateSchemaState {
  error?: Error;
  saving: boolean;
}

export interface ITextResources {
  [langCode: string]: ITextResource[];
}

export interface ITextResource {
  id: string;
  value: string;
  unparsedValue?: string;
  variables?: ITextResourceVariable[];
}

export interface ITextResourceVariable {
  key: string;
  dataSource: string;
}

export interface ITextResourcesObjectFormat {
  [key: string]: string;
}

export interface ITextResourcesWithLanguage {
  language: string;
  resources: ITextResource[];
}
