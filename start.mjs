/**
 * The starting script which triggers when the user clicks the extension icon
 */

import {Bulletin} from "./bulletin.mjs";

const script = document.createElement('script');
script.src = 'jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    window.speechSynthesis.cancel();
    Bulletin.fetchNews();
});