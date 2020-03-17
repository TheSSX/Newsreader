/**
 * The starting script which triggers when the user clicks the extension icon
 */

import {languages} from "./language_config.js";
import {min_sentences, max_sentences, sources, topiclinks} from "./preferences.js";

const allsources = Object.keys(sources);
const alltopics = Object.keys(topiclinks);

document.addEventListener("DOMContentLoaded", setUp);

async function setUp()
{
    //Setting up the UI with user preferences

    chrome.storage.local.get(['playing', 'paused', 'headline', 'publisher', 'topic', 'language', 'sentences', 'sources', 'topics'], function(result) {
        const currentlyplaying = result['playing'];
        const currentlypaused = result['paused'];
        const headline = result['headline'];
        const publisher = result['publisher'];
        const topic = result['topic'];
        const language = result['language'];
        const sentences = result['sentences'];
        let sources = result['sources'];
        let topics = result['topics'];

        if (currentlyplaying && !currentlypaused) {
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
        }

        setLanguages(language);
        setSentences(sentences);
        setSources(sources);
        setTopics(topics);

        document.getElementById('headline').innerHTML = headline || "";
        document.getElementById('publisher').innerHTML = publisher || "";
        document.getElementById('topic').innerHTML = topic || "";
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

async function setLanguages(language)
{
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

    languages_dropdown.onchange = function () {
        const newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
        chrome.storage.local.set({'language': newSelection});
    };
}

async function setSentences(sentences)
{
    const sentences_dropdown = document.getElementById('sentences');
    for (let i = min_sentences; i <= max_sentences; i++)
    {
        const option = i.toString();
        const element = document.createElement("option");
        element.textContent = option;
        element.value = option;
        sentences_dropdown.appendChild(element);
    }

    if (sentences)
    {
        sentences_dropdown.value = sentences.toString();
    }
    else
    {
        chrome.storage.local.set({'sentences': 3});
    }

    sentences_dropdown.onchange = function () {
        const newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
        chrome.storage.local.set({'sentences': parseInt(newSelection)});
    };
}

async function setSources(sources)
{
    if (!sources)
    {
        sources = {};

        for (let i=0; i<allsources.length; i++)
        {
            sources[allsources[i]] = true;
        }

        chrome.storage.local.set({'sources': sources});
    }

    const sources_checkboxes = document.getElementById('sources-checkboxes');

    for (let i=0; i<allsources.length; i++)
    {
        const name = allsources[i];

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = name;
        checkbox.value = name;
        if (sources[name])
        {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                changeCheckboxValue('sources', checkbox.name, true);
            } else {
                changeCheckboxValue('sources', checkbox.name, false);
            }
        });

        const label = document.createElement('label');
        label.htmlFor = name;
        label.appendChild(document.createTextNode(name));

        const br = document.createElement('br');

        sources_checkboxes.appendChild(checkbox);
        sources_checkboxes.appendChild(label);
        sources_checkboxes.appendChild(br);
    }
}

async function setTopics(topics)
{
    if (!topics)
    {
        topics = {};

        for (let i=0; i<alltopics.length; i++)
        {
            const current = alltopics[i];
            topics[current] = true;
        }

        chrome.storage.local.set({'topics': topics});
    }

    const topics_checkboxes = document.getElementById('topics-checkboxes');

    for (let i=0; i<alltopics.length; i++)
    {
        const name = alltopics[i];

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = name;
        checkbox.value = name;
        if (topics[name])
        {
            checkbox.checked = true;
        }

        checkbox.addEventListener('change', (event) => {
            if (event.target.checked) {
                changeCheckboxValue('topics', checkbox.name, true);
            } else {
                changeCheckboxValue('topics', checkbox.name, false);
            }
        });

        const label = document.createElement('label');
        label.htmlFor = name;
        label.appendChild(document.createTextNode(capitalizeFirstLetter(name)));

        const br = document.createElement('br');

        topics_checkboxes.appendChild(checkbox);
        topics_checkboxes.appendChild(label);
        topics_checkboxes.appendChild(br);
    }
}

async function changeCheckboxValue(checkbox_name, item_name, value) {
    chrome.storage.local.get([checkbox_name], function (result) {
        let replacement = result[checkbox_name];
        replacement[item_name] = value;
        if (checkbox_name === 'sources')                            //In ES5 and earlier, you cannot use a variable as a property name inside an object literal
            chrome.storage.local.set({'sources': replacement});     //So we cannot do ({checkbox_name: replacement});
        else                                                        //The more you know!
            chrome.storage.local.set({'topics': replacement});
    });
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

//Thanks to user Steve Harrison on Stack Overflow
//Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
    try
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    catch(TypeError)
    {
        return string;
    }
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