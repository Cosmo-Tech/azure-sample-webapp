// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AgGridReact } from 'ag-grid-react';
import { Button, CircularProgress } from '@material-ui/core';
import { AgGridUtils } from '../AgGridUtils';
import { UploadFileUtils } from '../UploadFileUtils';
import { UPLOAD_FILE_STATUS_KEY } from '@cosmotech/ui';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham-dark.css';

const PreviewUploadFile = (props) => {
  const { file, setFile, datasetId } = props;
  const isDownloading = file.preview === UPLOAD_FILE_STATUS_KEY.DOWNLOADING;
  const isCSVFile = file.file?.type === 'text/csv';
  const isJsonFile = file.file?.type === 'application/json';

  const [rawContent, setRawContent] = useState('');
  const [gridData, setGridData] = useState({
    columnDefs: [],
    rowData: []
  });

  const setPreviewFile = (event) => {
    event.preventDefault();
    UploadFileUtils.setPreviewFile(datasetId, file, setFile);
  };

  const handleContent = useCallback((reader) => {
    if (isCSVFile) {
      reader.onload = function (evt) {
        const fileData = evt.target.result;
        const { header, rowData } = AgGridUtils.constructPreviewData(fileData);
        setGridData({
          columnDefs: header,
          rowData: rowData
        });
      };
    } else {
      reader.onload = function (evt) {
        setRawContent(evt.target.result);
      };
    }
    reader.onerror = function (evt) {
      console.error('error reading file');
    };
  }, [isCSVFile]);

  const readFileData = useCallback((file) => {
    if (file) {
      const reader = new FileReader();
      reader.readAsText(file.file, 'UTF-8');
      handleContent(reader);
    }
  }, [handleContent]);

  useEffect(() => {
    if (file.status === UPLOAD_FILE_STATUS_KEY.READY_TO_UPLOAD ||
      file.preview === UPLOAD_FILE_STATUS_KEY.READY_TO_DISPLAY) {
      readFileData(file);
    } else {
      setGridData({ columnDefs: [], rowData: [] });
      setRawContent('');
    }
  }, [file, readFileData]);

  return (
    <>
      { file.preview !== UPLOAD_FILE_STATUS_KEY.PREVIEW_NONE &&
      <>
        { file.preview === UPLOAD_FILE_STATUS_KEY.PREVIEW_AVAILABLE
          ? <Button
            onClick={setPreviewFile}
            variant="contained"
            color="primary">
            Show Preview
          </Button>
          : <PreviewContent
            isDownloading={isDownloading}
            gridData={gridData}
            isCSVFile={isCSVFile}
            isJsonFile={isJsonFile}
            rawContent={rawContent}/>
        }
      </>
      }
    </>
  );
};

PreviewUploadFile.propTypes = {
  file: PropTypes.object.isRequired,
  setFile: PropTypes.func.isRequired,
  datasetId: PropTypes.string.isRequired
};

const PreviewContent = (props) => {
  const { isDownloading, gridData, isCSVFile, isJsonFile, rawContent } = props;

  return (
    <>
      { isDownloading
        ? <CircularProgress />
        : <BlockContent
          gridData={gridData}
          isCSVFile={isCSVFile}
          isJsonFile={isJsonFile}
          rawContent={rawContent}/>
      }
    </>
  );
};

PreviewContent.propTypes = {
  isDownloading: PropTypes.bool.isRequired,
  isCSVFile: PropTypes.bool.isRequired,
  isJsonFile: PropTypes.bool.isRequired,
  gridData: PropTypes.object.isRequired,
  rawContent: PropTypes.string.isRequired
};

const BlockContent = (props) => {
  const { isCSVFile, isJsonFile, gridData, rawContent } = props;
  const notDisplayableContent = !isCSVFile && !isJsonFile;
  // eslint-disable-next-line no-unused-vars
  const [gridApi, setGridApi] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [columnApi, setColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
  };

  return (
    <>
      { isCSVFile &&
      <div style={{ height: '100%' }}>
        <div
          id="myGrid"
          style={{
            height: '100%'
          }}
          className="ag-theme-balham-dark">
          <AgGridReact
            multiSortKey={'ctrl'}
            pagination={true}
            paginationPageSize={10}
            onGridReady={onGridReady}
            columnDefs={gridData.columnDefs}
            rowData={gridData.rowData}/>
        </div>
      </div>
      }
      { isJsonFile &&
      <div>
              <pre>
                 {rawContent}
              </pre>
      </div>
      }
      { notDisplayableContent &&
      <div>
        {'Content not displayable'}
      </div>
      }
    </>
  );
};

BlockContent.propTypes = {
  isCSVFile: PropTypes.bool.isRequired,
  isJsonFile: PropTypes.bool.isRequired,
  gridData: PropTypes.object.isRequired,
  rawContent: PropTypes.string.isRequired
};

export default PreviewUploadFile;
