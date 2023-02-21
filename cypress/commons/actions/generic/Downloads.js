// Copyright (c) Cosmo Tech.
// Licensed under the MIT license.

const path = require('path');

function _forgeFilePath(fileName) {
  const dir = Cypress.config('downloadsFolder');
  return path.join(dir, fileName);
}

function checkByContent(fileName, expectedContent, timeout = 15) {
  const filePath = _forgeFilePath(fileName);
  cy.readFile(filePath, 'binary', { timeout: timeout * 1000 }).should((buffer) => {
    expect(buffer).to.be.equal(expectedContent);
  });
}

function checkXLSXByContent(fileName, expectedData) {
  const filePath = _forgeFilePath(fileName);
  cy.task('parseXlsx', filePath).should((data) => {
    expect(data).to.deep.equal(expectedData);
  });
}

function checkBySize(fileName, expectedSize, timeout = 15) {
  const filePath = _forgeFilePath(fileName);
  cy.readFile(filePath, 'binary', { timeout: timeout * 1000 }).should((buffer) => {
    expect(buffer.length).to.be(expectedSize);
  });
}

function clearDownloadsFolder() {
  const downloadsFolder = Cypress.config('downloadsFolder');
  cy.task('deleteFolder', downloadsFolder);
}

export const Downloads = {
  checkByContent,
  checkXLSXByContent,
  checkBySize,
  clearDownloadsFolder,
};
