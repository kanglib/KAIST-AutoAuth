/* jshint esversion: 8 */
/* globals chrome */

const digest = document.getElementById('digest');
const message = document.getElementById('message');

async function onClickSave() {
  setTimeout(() => message.textContent = '', 2000);
  chrome.storage.local.set({digest: digest.value})
      .then(() => message.textContent = 'Saved!')
      .catch(() => message.textContent = 'Error!');
}

chrome.storage.local.get('digest').then(options => {
  digest.value = options.digest;
  document.getElementById('save').onclick = onClickSave;
});
