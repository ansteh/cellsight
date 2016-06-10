'use strict';
const cellsight = require('./index.js');

cellsight.getCube()
  .then(cube => cube.findRowsByColumnTitleThatIncludesText('Control Titel', 'IT Strategie'))
  .then(rows => rows.getVariationsOfColumn('Control Titel'))
  .then(console.log)
  .catch(console.log);
