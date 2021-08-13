# Add a new Upload File tab

For the whole tutorial, let's assume you need a way to upload a file that change the numbers of waiters.

- Open [src/config/ScenarioParameters.js](../src/config/ScenarioParameters.js)
- Add a new object in the SCENARIO_PARAMETERS_TABS_CONFIG array:
```
export const SCENARIO_PARAMETERS_TABS_CONFIG = [
  ...
  {
    id: <incremental unique id | type: int>,
    translationKey: <path to translation key in translation files | type: string>,
    label: <label to display | type: string>,
    value: <unique value | type: string>,
    runTemplateIds: <templates that display the new tab | type: array>
  }
];
```


- Open [src/components/ScenarioParameters/UploadFileConfig.js](../src/components/ScenarioParameters/UploadFileConfig.js)
- Add the following constants:
```
// Nb waiters configuration
export const NB_WAITERS_PARAM_ID = <nb waiters dataset name | type: string>;
export const NB_WAITERS_PARAM_CONNECTOR_ID = <connector's id to database | type: string>;
export const NB_WAITERS_PARAM_ACCEPT_FILE_TYPE = <accepted file types, i.e. '.csv,.xls' | type: string>;
```


- Open [src/components/ScenarioParameters/ScenarioParameters.js](../src/components/ScenarioParameters/ScenarioParameters.js)
- Import previous constants:
```
import {
  NB_WAITERS_PARAM_ID,
  NB_WAITERS_PARAM_CONNECTOR_ID,
  NB_WAITERS_PARAM_ACCEPT_FILE_TYPE,
  ...
}
```


- Just before `useEfect`, add the following state:
```
// State for nb waiters File Upload
const [nbWaitersFile, setNbWaitersFile] = useState({
  parameterId: NB_WAITERS_PARAM_ID,
  description: 'Nb waiters dataset part',
  initialName: '',
  name: '',
  file: null,
  status: UPLOAD_FILE_STATUS_KEY.EMPTY
});
const [nbWaitersDataset, setNbWaitersDataset]  = useState({});
const [nbWaitersDatasetId, setNbWaitersDatasetId] = useState('');
```


- Within the useEffect, add an effect:
```
const nbWaitersParameter = currentScenario.data?.parametersValues?.find(el => el.parameterId === NB_WAITERS_PARAM_ID);
setNbWaitersDatasetId(nbWaitersParameter?.value === undefined ? '' : nbWaitersParameter.value);
```

- Call reset when necessary:
```
// Upload file
if (resetFile) {
  UploadFileUtils.resetUploadFile(nbWaitersDatasetId, nbWaitersStockFile, setNbWaitersFile);
  ...
}
```


- Send data to backend:
```
const getParametersDataForApi = (newDataset, runTemplateId) => {
  ...
  if (<array of run templates that display this new upload file tab>.indexOf(runTemplateId) !== -1) {
    if (newDataset && Object.keys(newDataset).length !== 0) {
      parametersData = parametersData.concat([
        {
          parameterId: NB_WAITERS_PARAM_ID,
          varType: DATASET_PARAM_VARTYPE,
          value: newDataset.id
        }
      ]);
    }
  }
  return parametersData;
};
```


- Handle data when scenario is launched
```
const handleClickOnUpdateAndLaunchScenarioButton = async () => {
  await UploadFileUtils.updateDatasetPartFile(
    nbWaitersFile,
    setNbWaitersFile,
    nbWaitersDatasetId,
    setNbWaitersDatasetId,
    NB_WAITERS_PARAM_ID,
    NB_WAITERS_PARAM_CONNECTOR_ID,
    currentScenario.data.id,
    workspaceId);
  ...
};
```


- Just before `const scenarioParametersTabs = [` construct a file upload component for nb waiters:
```
const nbWaitersFileUploadComponent = UploadFileUtils.constructFileUpload(
  <id defined previously in src/config/ScenarioParameters.js | type: string>,
  nbWaitersFile,
  setNbWaitersFile,
  nbWaitersDataset.id,
  nbWaitersDatasetId,
  NB_WAITERS_PARAM_ACCEPT_FILE_TYPE,
  editMode
);
```

- Use the component in tabs
```
const scenarioParametersTabs = [
  ...
  nbWaitersFileUploadComponent,
  ...
```
