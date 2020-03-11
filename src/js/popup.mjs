/**
 * The starting script which triggers when the user clicks the extension icon
 */

document.addEventListener("DOMContentLoaded", setUp);

async function setUp()
{
    //Setting play/pause button state

    chrome.storage.local.get(['playing', 'paused', 'headline', 'publisher', 'topic'], function(result) {
        const currentlyplaying = result['playing'];
        const currentlypaused = result['paused'];
        const headline = result['headline'];
        const publisher = result['publisher'];
        const topic = result['topic'];

        if (currentlyplaying && !currentlypaused) {
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
        }
    });

    //Add event listeners for when buttons are clicked

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
}

async function playPauseToggle() {
    chrome.storage.local.get(['playing', 'paused'], function(result) {
        let currentlypaused, currentlyplaying;
        try {
            currentlyplaying = result['playing'];
            currentlypaused = result['paused'];
        }
        catch (TypeError)
        {
            play();
            return;
        }

        if (!currentlyplaying)
        {
            play();
        }
        else if (currentlyplaying && !currentlypaused)
        {
            pause();
        }
        else if (currentlyplaying && currentlypaused)
        {
            resume();
        }
    });
}

async function play()
{
    document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "play"});
}

async function pause()
{
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": true});
    chrome.runtime.sendMessage({greeting: "pause"});
}

async function resume()
{
    document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "resume"});
}

async function stop() {
    document.getElementById('headline').innerHTML = "";
    document.getElementById('publisher').innerHTML = "";
    document.getElementById('topic').innerHTML = "";
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.storage.local.set({"playing": false});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "stop"});
}

//HTML stuff

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        if (typeof request.greeting === 'object' && request.greeting !== null)
        {
            document.getElementById('headline').innerHTML = request.greeting.headline;
            document.getElementById('publisher').innerHTML = request.greeting.publisher;
            document.getElementById('topic').innerHTML = request.greeting.topic;
            chrome.storage.local.set({"headline": request.greeting.headline});
            chrome.storage.local.set({"publisher": request.greeting.publisher});
            chrome.storage.local.set({"topic": request.greeting.topic});
        }
    });