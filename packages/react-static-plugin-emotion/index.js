const { renderStylesToString } = require("emotion-server");

const plugin = options => ({
  // Tap into the beforeHtmlToDocument hook and use emotion-server
  // to critically inline the styles from the original
  // html into the a new html string
  beforeHtmlToDocument: html => renderStylesToString(html)
});

module.exports = plugin;
module.exports.default = plugin;
