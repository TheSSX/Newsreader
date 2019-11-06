/**
 * The starting script which triggers when the user clicks the extension icon
 */

//import {Bulletin} from "./bulletin.mjs";

window.onload=function(){
    const playButton = document.getElementById('playBtn');
    const stopButton = document.getElementById('stopBtn');

    if (playButton)
    {
        playButton.addEventListener('click', starter);
    }

    if (stopButton)
    {
        stopButton.addEventListener('click', stopper);
    }
};

// const script = document.createElement('script');
// script.src = 'jquery.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);

// // Called when the user clicks on the browser action.
// chrome.browserAction.onClicked.addListener(function(tab) {
//     window.speechSynthesis.cancel();
//     Bulletin.fetchNews();
// });

function starter()
{
    stopper();
    // chrome.runtime.getBackgroundPage(function(backgroundPage){
    //     backgroundPage.fetchNews()
    // });
    //chrome.extension.getBackgroundPage();
    //Bulletin.fetchNews();

    chrome.runtime.sendMessage({greeting: "play"});
}

function stopper()
{
    chrome.runtime.sendMessage({greeting: "stop"});
}