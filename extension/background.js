/* globals browser */

browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.url && changeInfo.url.endsWith('checkOtp'))
    browser.tabs.executeScript(null, {file: 'main.js'});
}, {urls: ['*://iam2.kaist.ac.kr/*']});
