'use strict';

export default class {
  constructor() {
    this.dialog = document.getElementById('dialog');
  }
  
  show() {
    this.dialog.showModal();
  }
  
  close() {
    this.dialog.close();
  }
}
