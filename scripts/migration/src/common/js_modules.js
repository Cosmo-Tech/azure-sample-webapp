// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');
const { join } = require('path');

const copyFileToMJS = (inputFolder, inputFileName, outputFolder) => {
  const newFileName = inputFileName.slice(0, -2) + 'mjs';
  const oldFilePath = join(inputFolder, inputFileName);
  const newFilePath = join(outputFolder, newFileName);
  fs.copyFileSync(oldFilePath, newFilePath);
  return newFilePath;
};

const parseESFile = async (filePath) => {
  return await import(filePath);
};

module.exports = { copyFileToMJS, parseESFile };
