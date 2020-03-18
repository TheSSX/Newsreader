import {Bulletin} from "./bulletin.mjs";
import {getTopics} from "./popup.mjs";

/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        if (request.greeting === "play") {
            getTopics().then(topics => {
                let found = false;
                for (let i = 0; i < Object.keys(topics).length; i++) {
                    if (topics[Object.keys(topics)[i]]) {
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    return false;
                }

                Bulletin.fetchNews(topics);
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

