'use strict';
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const dockin = require('dockin');
const Document = dockin.Document;
const Promise = require('bluebird');

const getFilenames = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if(err) reject(err);
      resolve(files);
    });
  });
};

const filterMicrosoftExcelFiles = (files) => {
  return _.filter(files, (file) => _.includes(file, '.xlsm'));
};

const getScheets = (files) => {
  return Promise.map(files, function(file) {
    let doc = Document(path.resolve(__dirname, 'resources', file));
    return doc.getSheet('Controls Matrix');
  }).then(function(sheets) {
      return sheets;
  });
};

const SheetCube = (sheets) => {
  let findAllRowsByColumnTitleThatIncludesText = (columTitle, text) => {
    return _.map(sheets, (sheet) => {
      return sheet.findRowByColumnTitleThatIncludesText(columTitle, text);
    });
  };

  return {
    findAllRowsByColumnTitleThatIncludesText: findAllRowsByColumnTitleThatIncludesText
  };
};

const resourcePath = path.resolve(__dirname, 'resources');

getFilenames(resourcePath)
.then(filterMicrosoftExcelFiles)
.then(getScheets)
.then(sheets => SheetCube(sheets))
.then((cube) => {
  return _.map(cube.findAllRowsByColumnTitleThatIncludesText('Control Titel', 'IT Strategie'), (row) => {
    return _.result(row.getCellByTitle('Control Titel'), 'value', '');
  });
})
.then(console.log)
.catch(console.log);
