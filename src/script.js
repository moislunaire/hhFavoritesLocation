'use strict';

const mdl = require('exports?componentHandler!material-design-lite/material');
import mapTpl from './map/mapTpl';

import { initMap, placeVacancies } from './map/map';
import initVacancies from './hh/hh';
import { oauth } from './auth/auth';

mdl.upgradeDom();

document.getElementById('app').insertAdjacentHTML('afterbegin', mapTpl());

ymaps.ready(() => {
  Promise.all([initMap(), oauth])
    .then( values => initVacancies(values[1]) )
    .then( res => placeVacancies(res) )
});


