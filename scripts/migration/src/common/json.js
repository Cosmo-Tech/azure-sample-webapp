// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');
const prettier = require('prettier');

const PRETTIER_DEFAULT_OPTIONS = {
  parser: 'json',
  printWidth: 120,
  singleQuote: true,
};

const readFromFile = (filePath, encoding = 'utf8') => {
  try {
    return JSON.parse(fs.readFileSync(filePath, encoding));
  } catch (e) {
    console.error(`Error when reading JSON file "${filePath}"`);
    console.error(e.message);
    throw e;
  }
};

const writeToFile = async (object, filePath) => {
  try {
    let fileContent = JSON.stringify(object);
    fileContent = await prettier.format(fileContent, PRETTIER_DEFAULT_OPTIONS);
    fs.writeFileSync(filePath, fileContent);
  } catch (e) {
    console.error(`Error when writing JSON file "${filePath}"`);
    console.error(e.message);
    throw e;
  }
};

module.exports = { readFromFile, writeToFile };
