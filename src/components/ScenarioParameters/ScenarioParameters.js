// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Typography,
  makeStyles
} from '@material-ui/core';
import { SCENARIO_RUN_STATE } from '../../utils/ApiUtils';
import { SCENARIO_PARAMETERS_TABS_CONFIG } from '../../configs/ScenarioParametersTabs.config';
import { EditModeButton, NormalModeButton, ScenarioParametersTabs } from './components';
import { useTranslation } from 'react-i18next';
import { SimpleTwoActionsDialog } from '@cosmotech/ui';
import { BasicTypes, BarParameters, FileUpload } from './components/tabs';
import { ORGANISATION_ID, acceptedFileTypesToUpload } from '../../configs/App.config';
import WorkspaceService from '../../services/workspace/WorkspaceService.js';
import DatasetService from '../../services/dataset/DatasetService.js';
import fileDownload from 'js-file-download';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui/src/UploadFile/StatusConstants';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    background: theme.palette.background.secondary,
    color: '#FFFFFF',
    marginLeft: '30px',
    height: '50px',
    paddingTop: '10px'
  },
  rightBar: {
    textAlign: 'right',
    display: 'flex',
    alignItems: 'center',
    margin: `0 ${theme.spacing(3)}px`
  }
}));

const fetchDatasetById = async (existingDatasetId) => {
  const { error, data } = await DatasetService.findDatasetById(ORGANISATION_ID, existingDatasetId);
  if (error) {
    console.log(error);
  }
  return data;
};

const ScenarioParameters = ({
  editMode,
  changeEditMode,
  updateAndLaunchScenario,
  launchScenario,
  workspaceId,
  currentScenario,
  scenarioId
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  let currentDataset = {};

  // General states
  const [displayPopup, setDisplayPopup] = useState(false);

  // Current scenario parameters
  const [parameters, setParameters] = useState([]);

  // Update the parameters form when scenario parameters change
  useEffect(() => {
    const scenarioParameters = currentScenario.data.parametersValues;
    const datasetParam = scenarioParameters?.find(el => el.parameterId === 'initial_stock_dataset');
    const existingDatasetId = datasetParam?.value;
    if (existingDatasetId) {
      currentDataset = fetchDatasetById(existingDatasetId);
    }
    setParameters(scenarioParameters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScenario, currentDataset, fetchDatasetById]);

  const getValueFromParameters = (parameterId, defaultValue) => {
    if (parameters === null || parameters === undefined) {
      return defaultValue;
    }
    const param = parameters.find(element => element.parameterId === parameterId);
    if (param !== undefined) {
      return param.value;
    }
    return defaultValue;
  };

  // State for bar parameters
  const [stock, setStock] = useState(
    getValueFromParameters('stock', 100));
  const [restockQuantity, setRestockQuantity] = useState(
    getValueFromParameters('restock_qty', 25));
  const [waitersNumber, setWaitersNumber] = useState(
    getValueFromParameters('nb_waiters', 5));
  // State for basic input types examples parameters
  const [currency, setCurrency] = useState(
    getValueFromParameters('currency', 'USD'));
  const [currencyName, setCurrencyName] = useState(
    getValueFromParameters('currency_name', 'EUR'));
  const [currencyValue, setCurrencyValue] = useState(
    getValueFromParameters('currency_value', 1000));
  const [currencyUsed, setCurrencyUsed] = useState(
    getValueFromParameters('currency_used', false));
  const [startDate, setStartDate] = useState(
    getValueFromParameters('start_date', new Date('2014-08-18T21:11:54')));
  // State for File Upload
  const [fileCache, setFileCache] = useState(null);
  const [fileToDownload, setFileToDownload] = useState(null);
  const [fileStatus, setFileStatus] = useState(UPLOAD_FILE_STATUS_KEY.IDLE);

  const resetParameters = () => {
    setStock(getValueFromParameters('stock', 100));
    setRestockQuantity(getValueFromParameters('restock_qty', 25));
    setWaitersNumber(getValueFromParameters('nb_waiters', 5));
    setCurrency(getValueFromParameters('currency', 'USD'));
    setCurrencyName(getValueFromParameters('currency_name', 'EUR'));
    setCurrencyValue(getValueFromParameters('currency_value', 1000));
    setCurrencyUsed(getValueFromParameters('currency_used', false));
    setStartDate(getValueFromParameters(
      'start_date', new Date('2014-08-18T21:11:54')));

    // TODO: Replace these resets with backend calls to get file on server
    setFileCache(null);
    setFileToDownload(null);
  };
  // eslint-disable-next-line
  const getParametersDataForApi = (runTemplateId) => {
    let parametersData = [];
    // Add bar parameters if necessary (run templates '1' and '2')
    if (['1', '2'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'stock',
          varType: 'int',
          value: stock,
          isInherited: stock !== getValueFromParameters('stock')
        },
        {
          parameterId: 'restock_qty',
          varType: 'int',
          value: restockQuantity,
          isInherited: restockQuantity !== getValueFromParameters('restock_qty')
        },
        {
          parameterId: 'nb_waiters',
          varType: 'int',
          value: waitersNumber,
          isInherited: waitersNumber !== getValueFromParameters('nb_waiters')
        }
      ]);
    }

    // Add basic inputs examples parameters if necessary (run template '4')
    if (['3'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'currency',
          varType: 'enum',
          value: currency,
          isInherited: currency !== getValueFromParameters('currency')
        },
        {
          parameterId: 'currency_name',
          varType: 'string',
          value: currencyName,
          isInherited: currencyName !== getValueFromParameters('currency_name')
        },
        {
          parameterId: 'currency_value',
          varType: 'number',
          value: currencyValue,
          isInherited: currencyValue !== getValueFromParameters('currency_value')
        },
        {
          parameterId: 'currency_used',
          varType: 'bool',
          value: currencyUsed,
          isInherited: currencyUsed !== getValueFromParameters('currency_used')
        },
        {
          parameterId: 'start_date',
          varType: 'date',
          value: startDate,
          isInherited: startDate !== getValueFromParameters('start_date')
        }
      ]);
    }

    if (['1', '2', '3', '4'].indexOf(runTemplateId) !== -1) {
      parametersData = parametersData.concat([
        {
          parameterId: 'initial_stock_dataset',
          varType: '%DATASETID%',
          value: currentDataset
        }
      ]);
    }
    // TODO Add array template parameters if necessary
    return parametersData;
  };

  // Popup part
  const handleClickOnDiscardChangeButton = () => setDisplayPopup(true);
  const handleClickOnPopupCancelButton = () => setDisplayPopup(false);
  const handleClickOnPopupDiscardChangeButton = () => {
    setDisplayPopup(false);
    changeEditMode(false);
    // Reset form values
    resetParameters();
  };

  // Normal Mode Screen
  const handleClickOnEditButton = () => changeEditMode(true);
  const isCurrentScenarioRunning = () => (
    currentScenario.data.state === SCENARIO_RUN_STATE.RUNNING);

  const handleClickOnLaunchScenarioButton = () => {
    // If scenario parameters have never been updated, do it now
    if (!currentScenario.data.parametersValues) {
      handleClickOnUpdateAndLaunchScenarioButton();
    } else {
      launchScenario(workspaceId, scenarioId);
      changeEditMode(false);
    }
  };

  const handleClickOnUpdateAndLaunchScenarioButton = async () => {
    if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
      await uploadFile();
      if (currentDataset) {
        deleteFile(currentDataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX);
        const { error, data } = await DatasetService.updateDataset(ORGANISATION_ID, currentDataset.id, currentDataset);
        if (error) {
          console.error(error);
        } else {
          currentDataset = data;
          setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
        }
      } else {
        const connector = {
          id: 'C-XPv4LBVGAL',
          parametersValues: {
            AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/' + 'initial_stock_dataset/'
          }
        };
        const { error, data } = await DatasetService.createDataset(ORGANISATION_ID, 'initial_stock_dataset', 'Dataset with file', connector);
        if (error) {
          console.log(error);
        } else {
          setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
          currentDataset = data;
        }
        const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
        updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
        changeEditMode(false);
      }
    }
  };

  /*
  const handleClickOnUpdateAndLaunchScenarioButton = () => {
    const prepareToUpdatePromise = new Promise((resolve, reject) => {
      if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
        uploadFile();
        if (initialStockDataset) {
          console.log('Do da update');
        } else {
          const connector = {
            id: 'C-XPv4LBVGAL',
            parametersValues: {
              AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/' + 'initial_stock_dataset/'
            }
          };
          DatasetService.createDataset(ORGANISATION_ID, 'initial_stock_dataset', 'Dataset with file', connector)
            .then(response => {
              const currentDataset = response.data;
              setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
              setInitialStockDataset(currentDataset.id);
              resolve(currentDataset);
            });
        }
      }
    });

    prepareToUpdatePromise
      .then((dataset) => {
        const parametersData = getParametersDataForApi(currentScenario.data.runTemplateId);
        // TODO: FIX THAT UGLY HACK
        parametersData.map(obj => {
          if (obj.parameterId === 'initial_stock_dataset') {
            obj.value = dataset.id;
            obj.isInherited = (dataset.id !== getValueFromParameters('initial_stock_dataset')?.id);
          }
          return obj;
        });
        console.log('!!');
        console.log(parametersData);
        updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
        changeEditMode(false);
      });
  };
*/

  // Edit Mode Screen
  // const handleClickOnUpdateAndLaunchScenarioButton = () => {
  //   // Handle uploading-deleting file
  //   const prepareToUpdatePromise = new Promise((resolve) => {
  //     if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD) {
  //       let currentDataset;
  //       uploadFile();

  //       console.log('1');

  //       if (initialStockDataset) {
  //         console.log('1.1');

  //         deleteFile(initialStockDataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX);
  //         DatasetService.updateDataset(ORGANISATION_ID, initialStockDataset.id, initialStockDataset).then(result => {
  //           currentDataset = result.data;
  //           // TODO Synchro with uploadFile() then
  //           setInitialStockDataset(currentDataset);
  //           setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  //         });
  //       } else {
  //         console.log('1.2');

  //         const connector = {
  //           id: 'C-XPv4LBVGAL',
  //           paramatersValues: {
  //             AZURE_STORAGE_CONTAINER_BLOB_PREFIX: '%WORKSPACE_FILE%/' + fileCache.name
  //           }
  //         };
  //         DatasetService.createDataset(ORGANISATION_ID, 'datasetWithFile', 'Dataset with file', connector).then(result => {
  //           currentDataset = result.data;
  //           console.log('@@@@@@@@@@@@@@@@@@@@@@');
  //           console.log(currentDataset.tags);
  //           console.log('@@@@@@@@@@@@@@@@@@@@@@');
  //           // TODO Synchro with uploadFile() then
  //           setInitialStockDataset(currentDataset);
  //           setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
  //         });
  //       }
  //     } else if (fileStatus === UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE && initialStockDataset) {
  //       DatasetService.deleteDataset(ORGANISATION_ID, workspaceId, initialStockDataset.id);
  //       deleteFile(initialStockDataset.connector.parametersValues.AZURE_STORAGE_CONTAINER_BLOB_PREFIX);
  //       setFileStatus(UPLOAD_FILE_STATUS_KEY.IDLE);
  //     }
  //   });

  //   // See https://github.com/jreynard-code/cosmotech-api-javascript-client/blob/master/docs/ScenarioApi.md#addorreplacescenarioparametervalues
  //   prepareToUpdatePromise.then(result => {
  //     const parametersData = getParametersDataForApi(
  //       currentScenario.data.runTemplateId);
  //     console.log('§§§§§§§§§§§§§§§');
  //     console.log(parametersData);
  //     console.log('§§§§§§§§§§§§§§§');
  //     updateAndLaunchScenario(workspaceId, scenarioId, parametersData);
  //     changeEditMode(false);
  //   }).catch(error => {
  //     console.log('ERROR ');
  //     console.log(error);
  //   });
  // };

  // Methods to handle upload file tab
  const handlePrepareToUpload = (event) => {
    const file = event.target.files[0];
    if (file === undefined) {
      return;
    }
    setFileCache(file);
    setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD);
  };

  const uploadFile = () => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.UPLOADING);
    const overwrite = true;
    const destination = scenarioId + '/initial_stock_dataset/';
    WorkspaceService.uploadWorkspaceFile(ORGANISATION_ID, workspaceId, fileCache, overwrite, destination)
      .then((error, data, response) => {
        if (error) {
          console.log(error);
        } else {
          setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DOWNLOAD);
        }
      });
  };

  const handlePrepareToDeleteFile = () => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.READY_TO_DELETE);
    setFileCache(null);
  };

  // eslint-disable-next-line
  const deleteFile = (connectorFilePath) => {
    setFileStatus(UPLOAD_FILE_STATUS_KEY.DELETING);
    WorkspaceService.deleteWorkspaceFile(ORGANISATION_ID, workspaceId, connectorFilePath);
    // resolve('File ' + fileCache.name + ' succefully deleted');
    // deletePromise.then(result => {
    //   setFileStatus(UPLOAD_FILE_STATUS_KEY.IDLE);
    // });
  };

  const handleDownloadFile = () => {
    const downloadPromise = new Promise((resolve) => {
      // setFileStatus(UPLOAD_FILE_STATUS_KEY.DOWNLOADING);
      const fileToDownload = WorkspaceService.downloadWorkspaceFile(ORGANISATION_ID, workspaceId, fileCache.name);
      setFileCache(fileToDownload);
      resolve('File ' + fileToDownload.name + ' successfully downloaded');
    });
    downloadPromise.then(result => {
      // setFileStatus(UPLOAD_FILE_STATUS_KEY.IDLE);
      fileDownload(fileCache, fileCache.name);
    });
  };

  // Indices in this array must match indices in the tabs configuration file
  // configs/ScenarioParametersTabs.config.js
  const scenarioParametersTabs = [
    <FileUpload key="0"
      fileToDownload={fileToDownload}
      fileCache={fileCache}
      fileStatus={fileStatus}
      acceptedFileTypesToUpload={acceptedFileTypesToUpload}
      handleUploadFile={handlePrepareToUpload}
      handleDeleteFile={handlePrepareToDeleteFile}
      handleDownloadFile={handleDownloadFile}
      editMode={editMode}
    />,
    <BarParameters key="1"
      stock={stock}
      changeStock={setStock}
      restockQuantity={restockQuantity}
      changeRestockQuantity={setRestockQuantity}
      waitersNumber={waitersNumber}
      changeWaitersNumber={setWaitersNumber}
      editMode={editMode}
    />,
    <BasicTypes key="2"
      textFieldValue={currencyName}
      changeTextField={setCurrencyName}
      numberFieldValue={currencyValue}
      changeNumberField={setCurrencyValue}
      enumFieldValue={currency}
      changeEnumField={setCurrency}
      switchFieldValue={currencyUsed}
      changeSwitchType={setCurrencyUsed}
      selectedDate={startDate}
      changeSelectedDate={setStartDate}
      editMode={editMode}
    />,
    <Typography key="3">Empty</Typography> // Array template
  ];

  // Disable edit button if no tabs are shown
  let tabsShown = false;
  for (const tab of SCENARIO_PARAMETERS_TABS_CONFIG) {
    if (tab.runTemplateIds.indexOf(currentScenario.data.runTemplateId) !== -1) {
      tabsShown = true;
      break;
    }
  }

  return (
      <div>
        <Grid container direction="column" justify="center" alignContent="flex-start" >
          <Grid container className={classes.root} direction="row" justify="space-between" alignContent="flex-start" spacing={5}>
            <Grid item >
              <Typography variant='subtitle1'>
                { t('genericcomponent.text.scenario.parameters.title', 'Scenario parameters') }

              </Typography>
            </Grid>
            <Grid item >
              { editMode
                ? (<EditModeButton classes={classes}
                  handleClickOnDiscardChange={handleClickOnDiscardChangeButton}
                  handleClickOnUpdateAndLaunchScenario={handleClickOnUpdateAndLaunchScenarioButton}/>)
                : (<NormalModeButton classes={classes}
                  handleClickOnEdit={handleClickOnEditButton}
                  handleClickOnLaunchScenario={handleClickOnLaunchScenarioButton}
                  editDisabled={!tabsShown || isCurrentScenarioRunning()}
                  runDisabled={isCurrentScenarioRunning()}/>)
              }
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={classes.tabs}>
          {
            <form>
              <ScenarioParametersTabs
                tabs={scenarioParametersTabs}
                currentScenario={currentScenario}
              />
            </form>
          }
        </Grid>
        <SimpleTwoActionsDialog
            open={displayPopup}
            dialogTitleKey='genericcomponent.dialog.scenario.parameters.title'
            dialogBodyKey='genericcomponent.dialog.scenario.parameters.body'
            cancelLabelKey='genericcomponent.dialog.scenario.parameters.button.cancel'
            validateLabelKey='genericcomponent.dialog.scenario.parameters.button.validate'
            handleClickOnCancel={handleClickOnPopupCancelButton}
            handleClickOnValidate={handleClickOnPopupDiscardChangeButton}
          />
      </div>
  );
};

ScenarioParameters.propTypes = {
  editMode: PropTypes.bool.isRequired,
  changeEditMode: PropTypes.func.isRequired,
  updateAndLaunchScenario: PropTypes.func.isRequired,
  launchScenario: PropTypes.func.isRequired,
  workspaceId: PropTypes.string.isRequired,
  scenarioId: PropTypes.string.isRequired,
  currentScenario: PropTypes.object.isRequired
};

export default ScenarioParameters;
