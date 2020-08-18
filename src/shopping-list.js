import $ from 'jquery';
import api from './api';
import store from './store';

const generateItemElement = function (item) {
  let itemTitle = `<span class="shopping-item shopping-item__checked">${item.name}</span>`;
  if (!item.checked) {
    itemTitle = `
      <form class="js-edit-item">
        <input class="shopping-item" type="text" value="${item.name}" />
      </form>
    `;
  }

  return `
    <li class="js-item-element" data-item-id="${item.id}">
      ${itemTitle}
      <div class="shopping-item-controls">
        <button class="shopping-item-toggle js-item-toggle">
          <span class="button-label">check</span>
        </button>
        <button class="shopping-item-delete js-item-delete">
          <span class="button-label">delete</span>
        </button>
      </div>
    </li>`;
};

const generateShoppingItemsString = function (shoppingList) {
  const items = shoppingList.map((item) => generateItemElement(item));
  return items.join('');
};

// generate error html, intake the error.message

// render the error, if store.error, else empty the container that
// was put in before

// close error button handling
// set local error to null and 
// render error

const render = function () {
  // is there an error???

  // Filter item list if store prop is true by item.checked === false
  let items = [...store.items];
  if (store.hideCheckedItems) {
    items = items.filter(item => !item.checked);
  }
  // render the shopping list in the DOM
  const shoppingListItemsString = generateShoppingItemsString(items);
  // insert that HTML into the DOM
  $('.js-shopping-list').html(shoppingListItemsString);
};

const handleNewItemSubmit = function () {
  $('#js-shopping-list-form').submit(function (event) {
    event.preventDefault();
    const newItemName = $('.js-shopping-list-entry').val();
    $('.js-shopping-list-entry').val('');
    api.createItem(newItemName)
    // api call to create item, returns object in json format,
      .then((newItemName) => {
        // add new item to local store
        store.addItem(newItemName);
        // re render
        render();
      }).catch((e) => {
        store.setError(error.message);
        // renderError();

      });
  });
};

const getItemIdFromElement = function (item) {
  return $(item)
    .closest('.js-item-element')
    .data('item-id');
};

const handleDeleteItemClicked = function () {
  // like in `handleItemCheckClicked`, we use event delegation
  $('.js-shopping-list').on('click', '.js-item-delete', event => {
    // get the index of the item in store.items
    const id = getItemIdFromElement(event.currentTarget);
    api.deleteItem(id)
    // delete from api, when that's done,
      .then(() => {
      // delete that same item from the local store
        store.findAndDelete(id);
        // re render
        render();
      });
    // render the updated shopping list
  }).catch((e) => {
    console.log(e);
    store.setError(e.message);
    // renderError();
  });
};

const handleEditShoppingItemSubmit = function () {
  $('.js-shopping-list').on('submit', '.js-edit-item', event => {
    event.preventDefault();
    const id = getItemIdFromElement(event.currentTarget);
    const itemName = $(event.currentTarget).find('.shopping-item').val();
    // update item in api, with item and the object.assign
    api.updateItem(id, {name: itemName})
    // update item in local store
      .then(() => {
        store.findAndUpdate(id, {name: itemName});
        // rerender
        render();
      }).catch(e => {
        // console.log(e);
        store.setError(e.message);
        // renderError();
      });
  });
};

const handleItemCheckClicked = function () {
  $('.js-shopping-list').on('click', '.js-item-toggle', event => {
    const id = getItemIdFromElement(event.currentTarget);
    const item = store.findById(id);
    
    // api update for the checked property with object.assign
    api.updateItem(id, {checked: !item.checked})
      .then(() => {
        // local update by id, and reassign checked value
        store.findAndUpdate(id, {checked: !item.checked});
        // rerender
        render();
      }).catch(e => {
        store.setError(e.message);
        // renderError();
      };
  });
};

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
};

const bindEventListeners = function () {
  handleNewItemSubmit();
  handleItemCheckClicked();
  handleDeleteItemClicked();
  handleEditShoppingItemSubmit();
  handleToggleFilterClick();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};