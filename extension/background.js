/* jshint esversion: 6 */
/* globals chrome */

var DEFAULT_SERVER = 'localhost:8080';

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.storage.local.get('server').then(options => {
    var server = options.server ? options.server : DEFAULT_SERVER;
    fetch(`http://${server}/`)
        .then(response => response.text())
        .then(text => sendResponse(text))
        .catch(() => sendResponse(null));
  });
  return true;
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.endsWith('checkOtp'))
    chrome.scripting.executeScript(
        {target: {tabId: tabId}, files: ['main.js']});
});
