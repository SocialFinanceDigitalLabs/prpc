/* eslint-disable */
var fs = require('fs');
const Path = require('path');
/* eslint-enable */

const apiFile = Path.join(__dirname, '../dist/esm/api/pyodide.js');

fs.readFile(apiFile, 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  const result = data.replace(/.worker.ts/g, '.worker.js');

  fs.writeFile(apiFile, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});
