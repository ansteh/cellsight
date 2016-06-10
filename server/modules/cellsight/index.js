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
  return _.filter(files, file => getFileTypeOf(file) === 'xlsm');
};

const getFileTypeOf = (filename) => {
  return _.chain(filename)
    .split('.')
    .last()
    .lowerCase()
    .value();
};

const getScheets = (files) => {
  return Promise.map(files, function(file) {
    let doc = Document(path.resolve(__dirname, 'resources', file));
    return doc.getSheet('Controls Matrix');
  }).then(function(sheets) {
      return sheets;
  });
};

const Rows = (rows) => {

  let getVariationsOfColumn = (title) => {
    return _.chain(rows)
      .map(row => _.result(row.getCellByTitle(title), 'value', ''))
      .without('')
      .uniqBy(value => value)
      .value();
  };

  return {
    getVariationsOfColumn: getVariationsOfColumn
  };
};

const SheetCube = (sheets) => {
  let findRowsByColumnTitleThatIncludesText = (columnTitle, text) => {
    return Rows(_.map(sheets, sheet => {
      return sheet.findRowByColumnTitleThatIncludesText(columnTitle, text);
    }));
  };

  let getTitles = () => {
    return _.reduce(sheets, (titles, sheet) => {
      //return _.uniqBy(_.concat(titles, sheet.getTitles()), x => x);
      return _.chain(titles)
        .concat(sheet.getTitles())
        .without('')
        .uniqBy(x => x)
        .value();
    }, []);
  };

  return {
    findRowsByColumnTitleThatIncludesText: findRowsByColumnTitleThatIncludesText,
    getTitles: getTitles
  };
};

const resourcePath = path.resolve(__dirname, 'resources');

const getCube = () => {
  return getFilenames(resourcePath)
    .then(filterMicrosoftExcelFiles)
    .then(getScheets)
    .then(sheets => SheetCube(sheets));
};

module.exports = {
  getCube: getCube
};
