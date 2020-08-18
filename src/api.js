/* eslint-disable indent */
const BASE_URL = 'https://thinkful-list-api.herokuapp.com/michaelsliger';

const apiFetch = function (...args) {
    let error;
    // declare error variable
    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                // error handling
                // if res is not ok,
                // error = results status
                error = {
                    code: res.status
                };
                // if the res headers dont include CT: application/json,
                // error message = results statusText
                // returns promise reject
                if (!res.headers.get('Content-Type').includes('json')) {
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }
            // if everything is good, return data parsed json
            return res.json();
        })
        .then(data => {
            // if an error exists, error message = data.message
            // reject promise
            if (error) {
              error.message = data.message;
              return Promise.reject(error);
            }
            // else return data
            return data;
        });
};

function getItems() {
    // api call to get(default) all items
  return fetch(`${BASE_URL}/items`);
}
// api call 
// to display in dom, need to add each to local store, and render from local store


function createItem(name){
    // new object to go into the fetch api call, with JSON.stringify(obj)
    // post method to create
  const newItem = JSON.stringify({
    name: name,
  });
  return apiFetch(`${BASE_URL}/items`, {method: 'POST', headers:{'Content-Type': 'application/json'}, body: newItem});
}

function updateItem(id, obj) {
    // similar to create, but uses patch method and id to find
    const newData = JSON.stringify(obj);
    return apiFetch(`${BASE_URL}/items/${id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: newData
    });
}

function deleteItem(id) {
    // method delete
    return apiFetch(`${BASE_URL}/items/${id}`,
     {method: 'DELETE'}
     );
}
export default {
  getItems,
  createItem,
  updateItem,
  deleteItem
};
