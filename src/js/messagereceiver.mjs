import {Bulletin} from "./bulletin.mjs";
import {getSources, getTopics} from "./popup.mjs";

/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        if (request.greeting === "play") {
            getSources().then(sources => {
                getTopics().then(topics => {
                    Bulletin.fetchNews(sources, topics);
                });
            });
        }
        else if (request.greeting === "pause")
            window.speechSynthesis.pause();
        else if (request.greeting === "resume")
            window.speechSynthesis.resume();
        else if (request.greeting === "stop")
            window.speechSynthesis.cancel();
    });

let topics = undefined;

