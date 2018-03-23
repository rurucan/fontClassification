import React from 'react';
import ReactDom from 'react-dom';
import classnames from 'classnames';

const externals = global.externals || {};
global.externals = {
  ...externals,
  React,
  ReactDom,
  classnames,
};
