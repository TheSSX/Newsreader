import {Bulletin} from "./bulletin.mjs";

/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        if (request.greeting === "play")
            getTopics().then(topics => {
                Bulletin.fetchNews(topics);
            });
        else if (request.greeting === "pause")
            window.speechSynthesis.pause();
        else if (request.greeting === "resume")
            window.speechSynthesis.resume();
        else if (request.greeting === "stop")
            window.speechSynthesis.cancel();
    });

async function getTopics()
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['topics'], function (result) {
            const topics = result['topics'];
            resolve(topics);
        });
    });
}