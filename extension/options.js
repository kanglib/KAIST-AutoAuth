/* jshint esversion: 6 */
/* globals browser */

var DEFAULT_SERVER = 'localhost:8080';

var server = document.getElementById('server');
var message = document.getElementById('message');

server.value = DEFAULT_SERVER;
browser.storage.local.get('server').then(function(options) {
  if ('server' in options) server.value = options.server;
});

document.getElementById('save').onclick = function() {
  var hostname = server.value.split(':')[0];
  var permission = {origins: [`http://${hostname}/`]};
  browser.permissions.request(permission).then(function() {
    var options = {server: server.value};
    browser.storage.local.set(options).then(
        () => message.textContent = 'Saved!',
        () => message.textContent = 'Error!');
    setTimeout(() => message.textContent = '', 2000);
  });
};
