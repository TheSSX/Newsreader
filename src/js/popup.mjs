import {Bulletin} from "./bulletin.mjs";

/**
 * The starting script which triggers when the user clicks the extension icon
 */

window.onload = function ()
{
    const playPauseButton = document.getElementById('playPauseBtn');
    const stopButton = document.getElementById('stopBtn');

    if (playPauseButton && stopButton)
    {
        playPauseButton.addEventListener('click', playPauseToggle);
        stopButton.addEventListener('click', stop);
    }
    else
    {
        //TODO something broke, what do we do, add something later
    }

    try {
        const currentlypaused = chrome.storage.local.get(['paused']);

        if (!currentlypaused)
        {
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
        }
    }
    catch (TypeError)
    {
        //stop();
        chrome.storage.local.set({"playing": false});
        chrome.storage.local.set({"paused": false});
    }
};

async function playPauseToggle() {
    chrome.storage.local.get(['playing', 'paused'], function(result) {
        const currentlyplaying = result['playing'];
        const currentlypaused = result['paused'];

        if (!currentlyplaying)
        {
            play();
        }
        else if (currentlyplaying && currentlypaused)
        {
            pause();
        }
        else if (currentlyplaying && !currentlypaused)
        {
            resume();
        }
    });
}

async function play()
{
    //Bulletin.fetchNews();
    document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "play"});
}

async function pause()
{
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "pause"});
}

async function resume()
{
    document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": true});
    chrome.runtime.sendMessage({greeting: "resume"});
}

export async function stop() {
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.storage.local.set({"playing": false});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "stop"});
}