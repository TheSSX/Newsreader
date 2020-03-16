/**
 * The starting script which triggers when the user clicks the extension icon
 */

import {languages} from "./language_config.js";

document.addEventListener("DOMContentLoaded", setUp);

async function setUp()
{
    //Setting play/pause button state

    chrome.storage.local.get(['playing', 'paused', 'headline', 'publisher', 'topic', 'language', 'sentences'], function(result) {
        const currentlyplaying = result['playing'];
        const currentlypaused = result['paused'];
        const headline = result['headline'];
        const publisher = result['publisher'];
        const topic = result['topic'];
        const language = result['language'];
        const sentences = result['sentences'];

        if (currentlyplaying && !currentlypaused) {
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
        }

        const languages_dropdown = document.getElementById('languages');
        for (let i = 0; i < Object.keys(languages).length; i++)
        {
            const option = Object.keys(languages)[i];
            const element = document.createElement("option");
            element.textContent = option;
            element.value = option;
            languages_dropdown.appendChild(element);
        }

        if (language)
        {
            languages_dropdown.value = language;
        }
        else
        {
            chrome.storage.local.set({'language': Object.keys(languages)[0]});
        }
        
        const sentences_dropdown = document.getElementById('sentences');

        if (sentences)
        {
            sentences_dropdown.value = sentences;
        }
        else
        {
            chrome.storage.local.set({'sentences': 3});
        }

        document.getElementById('headline').innerHTML = headline || "";
        document.getElementById('publisher').innerHTML = publisher || "";
        document.getElementById('topic').innerHTML = topic || "";
    });

    const languages_dropdown = document.getElementById('languages');
    languages_dropdown.onchange = function () {
        const newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
        chrome.storage.local.set({'language': newSelection});
    };

    const sentences_dropdown = document.getElementById('sentences');
    sentences_dropdown.onchange = function () {
        const newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
        chrome.storage.local.set({'sentences': newSelection});
    };

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
    document.getElementById('headline').innerHTML = "Fetching news...";
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
    chrome.runtime.sendMessage({greeting: "stop"});
    chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
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
        }
        else if (request.greeting === "stop")
        {
            stop();
        }
    });