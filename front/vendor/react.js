import React from 'react';
import ReactDom from 'react-dom';

const externals = global.externals || {};
global.externals = {
  ...externals,
  React,
  ReactDom,
};
