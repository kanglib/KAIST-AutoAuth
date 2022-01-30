/* jshint esversion: 6 */
/* globals chrome */

var t0 = Date.now();
document.getElementById('email').click();

function check() {
  chrome.runtime.sendMessage(null, function(response) {
    if (response) {
      var [authCode, t1] = response.split(' ');
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
        return;
      }
    }
    setTimeout(check, 300);
  });
}
check();
