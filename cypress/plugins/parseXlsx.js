// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const readXlsxFile = require('read-excel-file/node');

const parseXlsx = async (filePath) => {
  return readXlsxFile(filePath);

  //   .then((rows) => {
  //   // `rows` is an array of rows
  //   // each row being an array of cells.
  // })
};

module.exports = { parseXlsx };
