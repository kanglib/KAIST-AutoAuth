/* jshint esversion: 8 */
/* globals browser */

var DEFAULT_SERVER = 'localhost:8080';

var server = document.getElementById('server');
var message = document.getElementById('message');

async function onClickSave() {
  var permissions;
  permissions = {origins: ['<all_urls>']};
  await browser.permissions.remove(permissions);

  var hostname = server.value.split(':')[0];
  permissions = {origins: [`http://${hostname}/`]};
  browser.permissions.request(permissions)
      .then(r => {
        setTimeout(() => message.textContent = '', 2000);
        if (!r) throw 0;
        var options = {server: server.value};
        return browser.storage.local.set(options);
      })
      .then(() => message.textContent = 'Saved!')
      .catch(() => message.textContent = 'Error!');
}

browser.storage.local.get('server')
    .then(options => server.value = options.server)
    .catch(() => server.value = DEFAULT_SERVER)
    .then(() => document.getElementById('save').onclick = onClickSave);
