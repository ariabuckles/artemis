// TODO(aria): Fix the dependency order issue here so these can be imports.
window.katex = require('katex');
// ugh mathquill global jQuery dep
window.jQuery = require('jquery');
// creates window.MathQuill
require('mathquill/build/mathquill.css');
require('mathquill/build/mathquill-basic.js');

// TODO(aria): Pull these dependencies into separate files so that import works instead of require.
window.i18n = {
  _: str => str,
};

module.exports = require('./lib/math-input/src/index.js');
