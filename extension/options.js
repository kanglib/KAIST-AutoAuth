/* jshint esversion: 8 */
/* globals chrome */

var DEFAULT_SERVER = 'localhost:8080';

var server = document.getElementById('server');
var message = document.getElementById('message');

async function onClickSave() {
  var hostname = server.value.split(':')[0];
  setTimeout(() => message.textContent = '', 2000);
  var options = {server: server.value};
  chrome.storage.local.set(options)
      .then(() => message.textContent = 'Saved!')
      .catch(() => message.textContent = 'Error!');
}

chrome.storage.local.get('server').then(options => {
  server.value = options.server ? options.server : DEFAULT_SERVER;
  document.getElementById('save').onclick = onClickSave;
});
