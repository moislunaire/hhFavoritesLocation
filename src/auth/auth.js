'use strict';

import dialogTpl from '../dialog/dialogTpl';
import Dialog from '../dialog/dialog';

document.body.insertAdjacentHTML('beforeend', dialogTpl());
const dialog = new Dialog();
dialog.show();
const form = dialog.dialog.querySelector('form');

export let oauth = new Promise(
  function(resolve, reject) {
    form.addEventListener('submit', function(e){
      e.preventDefault();
      const formData = new FormData(this);
      const token = formData.get('token');
      dialog.close();
      resolve(token);
    });
  }
);

