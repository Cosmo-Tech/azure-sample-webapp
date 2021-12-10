// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const { rmdir } = require('fs');

const deleteFolder = (folderName) => {
  return new Promise((resolve, reject) => {
    rmdir(folderName, { maxRetries: 2, recursive: true }, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error(err);
        return reject(err);
      }
      resolve(null);
    });
  });
};

module.exports = { deleteFolder };
