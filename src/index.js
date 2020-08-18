/* eslint-disable indent */
import $ from 'jquery';

import 'normalize.css';
import './index.css';
import api from './api';
import store from './store';

import shoppingList from './shopping-list';

const main = function () {
  api.getItems()
    // get items from api, returned as json already
    // .then(res => res.json()) handled by apifetch func
    .then((items) => {
      // iterate through items, add to local store,
      items.forEach((item) => store.addItem(item));
      // render from local store
      shoppingList.render();
    });
  // api.getItems()
  //   .then(res => res.json())
  //   .then(res => console.log(res));
  shoppingList.bindEventListeners();
  shoppingList.render();
};

$(main);
