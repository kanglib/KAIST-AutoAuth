/* jshint esversion: 8 */
/* globals chrome, crypto */

var subtle = crypto.subtle;

document.getElementById('motp').click();

function check() {
  chrome.storage.local.get('digest').then(async (options) => {
    const digest = options.digest;

    // TOTP
    const a =
        new Uint8Array(digest.match(/../g).map(h => parseInt(h, 16))).buffer;
    const key = await subtle.importKey(
        'raw', a, {name: 'HMAC', hash: {name: 'SHA-512'}}, false, ['sign']);

    const m = new ArrayBuffer(8);
    const b = new DataView(m);
    const c = Math.floor(Date.now() / 60e3);
    b.setUint32(4, c);

    const s = await subtle.sign('HMAC', key, m);
    const d = new DataView(s);
    const e = d.getUint8(63) % 16;
    const f = d.getUint32(e) % 0x80000000 % 1e6;

    const authCode = f.toString().padStart(6, '0');

    // Simulate user input
    const pass = document.getElementsByClassName('pass')[0];
    const input = pass.getElementsByTagName('input')[0];
    input.value = authCode;
    input.dispatchEvent(
        new Event('input', {view: window, bubbles: true, cancelable: true}));

    const log = document.getElementsByClassName('log')[0];
    const button = log.getElementsByTagName('input')[0];
    button.click();
  });
}
check();
