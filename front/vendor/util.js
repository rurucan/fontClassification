import moment from 'moment';
import axios from 'axios';
import co from 'co';

const externals = global.externals || {};
global.externals = {
  ...externals,
  moment,
  axios,
  co,
};
