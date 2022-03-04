/* jshint esversion: 6 */
/* globals chrome */

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.endsWith('checkOtp'))
    chrome.scripting.executeScript(
        {target: {tabId: tabId}, files: ['main.js']});
});
