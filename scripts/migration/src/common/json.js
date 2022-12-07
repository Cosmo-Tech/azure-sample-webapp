// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const fs = require('fs');

const readFromFile = (filePath, encoding = 'utf8') => {
  try {
    JSON.parse(fs.readFileSync(filePath, encoding));
  } catch (e) {
    console.error(`Error when reading JSON file "${filePath}"`);
    console.error(e.message);
    throw e;
  }
};

const writeToFile = (object, filePath) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(object));
  } catch (e) {
    console.error(`Error when writing JSON file "${filePath}"`);
    console.error(e.message);
    throw e;
  }
};

module.exports = { readFromFile, writeToFile };
