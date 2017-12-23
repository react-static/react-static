var React = require('react');
var Router = require('../../..').Router;
var Routes = require('react-static-routes').default;

require('./app.css');

module.exports = function(){
  return React.createElement(Router, {}, React.createElement(Routes));
};
