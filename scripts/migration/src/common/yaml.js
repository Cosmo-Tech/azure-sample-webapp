// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const yaml = require('js-yaml');
const fs = require('fs');

const readFromFile = (filePath, encoding = 'utf8') => {
  try {
    return yaml.load(fs.readFileSync(filePath, encoding));
  } catch (e) {
    console.log(e);
  }
};

const writeToFile = (object, filePath, options) => {
  const defaultOptions = {
    forceQuotes: true,
    noRefs: true,
  };

  try {
    fs.writeFileSync(
      filePath,
      yaml.dump(object, {
        ...defaultOptions,
        ...options,
      })
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = { readFromFile, writeToFile };
