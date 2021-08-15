/* jshint esversion: 6 */
/* globals browser */

var DEFAULT_SERVER = 'localhost:8080';

var t0 = Date.now();

function check() {
  var server = DEFAULT_SERVER;
  browser.storage.local.get('server').then(function(options) {
    if ('server' in options) server = options.server;
  });

  fetch(`http://${server}/`)
      .then(function(response) {
        response.text().then(function(text) {
          var [auth_code, t1] = text.split(' ');
          if (t1 > t0) {
            // Simulate user input
            var pass = document.getElementsByClassName('pass')[0];
            var input = pass.getElementsByTagName('input')[0];
            input.value = auth_code;
            input.dispatchEvent(new Event(
                'input', {view: window, bubbles: true, cancelable: true}));

            var log = document.getElementsByClassName('log')[0];
            var button = log.getElementsByTagName('input')[0];
            button.click();
          } else {
            setTimeout(check, 300);
          }
        });
      })
      .catch(() => setTimeout(check, 300));
}

document.getElementById('email').click();
check();
