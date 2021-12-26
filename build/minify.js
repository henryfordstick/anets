const {minify} = require('uglify-js');
const fs = require('fs');
const package = require('../package.json');
const {resolve,join} = require('path');
console.log(1111);

const banner = `/*! Anets ${package.version} - ${package.license} | ${package.repository.url} */\n`
console.log(__dirname);
fs.writeFileSync(
  `./dist/Anets.min.js`,
  banner + minify(fs.readFileSync(`./dist/Anets.js`,'utf8')).code,
  'utf8'
);