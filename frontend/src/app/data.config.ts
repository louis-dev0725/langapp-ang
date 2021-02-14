import { EntityMetadataMap, EntityDataModuleConfig, DefaultDataServiceConfig } from '@ngrx/data';

const entityMetadata: EntityMetadataMap = {
  Content: {}
};

const pluralNames = {
};

export const entityConfig: EntityDataModuleConfig = {
  entityMetadata,
  pluralNames
};


export const dataServiceConfig : DefaultDataServiceConfig = {
  root: '/api',
  timeout: 15000,
  getDelay: 300,
  saveDelay: 300,
  entityHttpResourceUrls: {
    Content: {
      entityResourceUrl: '/api/contents/',
        collectionResourceUrl: '/api/contents/',
    },
  }, 
};