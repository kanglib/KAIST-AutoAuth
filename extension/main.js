/* jshint esversion: 8 */
/* globals browser */

var DEFAULT_SERVER = 'localhost:8080';

var t0 = Date.now();
document.getElementById('email').click();

function check() {
  var server;
  browser.storage.local.get('server')
      .then(options => server = options.server)
      .catch(() => server = DEFAULT_SERVER)

      .then(() => fetch(`http://${server}/`))
      .then(response => response.text())
      .then(text => {
        var [authCode, t1] = text.split(' ');
        if (t1 > t0) {
          // Simulate user input
          var pass = document.getElementsByClassName('pass')[0];
          var input = pass.getElementsByTagName('input')[0];
          input.value = authCode;
          input.dispatchEvent(new Event(
              'input', {view: window, bubbles: true, cancelable: true}));

          var log = document.getElementsByClassName('log')[0];
          var button = log.getElementsByTagName('input')[0];
          button.click();
        } else {
          throw 0;
        }
      })
      .catch(() => setTimeout(check, 300));
}
check();
