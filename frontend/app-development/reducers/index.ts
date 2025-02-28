import { dataModellingReducer } from 'app-shared/features/dataModelling/sagas';
import { dataModelsMetadataReducer } from 'app-shared/features/dataModelling/sagas/metadata';
import handleServiceInformationReducer from '../features/administration/handleServiceInformationSlice';
import appDeploymentReducer from '../sharedResources/appDeployment/appDeploymentSlice';
import applicationMetadataReducer from '../sharedResources/applicationMetadata/applicationMetadataSlice';
import appReleaseReducer from '../sharedResources/appRelease/appReleaseSlice';
import configurationReducer from '../sharedResources/configuration/configurationSlice';
import repoStatusReducer from '../sharedResources/repoStatus/repoStatusSlice';
import userReducer from '../sharedResources/user/userSlice';

export const rootReducer = {
  serviceInformation: handleServiceInformationReducer,
  applicationMetadataState: applicationMetadataReducer,
  repoStatus: repoStatusReducer,
  appReleases: appReleaseReducer,
  appDeployments: appDeploymentReducer,
  configuration: configurationReducer,
  dataModelling: dataModellingReducer,
  dataModelsMetadataState: dataModelsMetadataReducer,
  userState: userReducer,
};
