/**
 * The script running in the background of the popup window. Calls the relevant scripts for bulletins and also
 * sets up the popup whenever the user opens it
 */

import {languages} from "./language_config.js";
import {min_sentences, max_sentences, sourcelinks, topiclinks} from "./preferences.js";
import {Bulletin} from "./bulletin.mjs";

const allsources = Object.keys(sourcelinks);
const alltopics = Object.keys(topiclinks);

document.addEventListener('readystatechange', function () {
   if (document.readyState === "complete")
       setUp();
});

/**
 * Sets up the popup window when the user opens it. Reads the data it needs for this from Chrome storage
 * @returns {boolean} - true if successful setup, false otherwise
 */
function setUp()
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
        const sources = result['sources'];
        const topics = result['topics'];

        //Change the style of the play/pause button depending on if an article is playing or not
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
        return true;
    }
    else    //some elements could not be found, setup failed
    {
        return false;
    }
}

/**
 * Populates the language selection dropdown element with the offered languages. Also sets the currently selected language with the one read from storage
 * @param language - the currently selected language
 */
function setLanguages(language)
{
    //Populate the dropdown
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
        languages_dropdown.value = language;    //set the currently selected language
    }
    else        //no language currently selected, default to English
    {
        chrome.storage.local.set({'language': Object.keys(languages)[0]});
    }

    //When the user changes the language, save this value to Chrome storage
    languages_dropdown.onchange = function () {
        const newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
        chrome.storage.local.set({'language': newSelection});
    };
}

/**
 * Populates the sentence dropdown with the offered sentences. Also sets the currently selected sentence number
 * @param sentences - the currently selected sentence number
 */
function setSentences(sentences)
{
    //Populate the dropdown
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
        sentences_dropdown.value = sentences.toString();        //set the current value
    }
    else
    {
        chrome.storage.local.set({'sentences': 3});     //no selection found, default to 3
    }

    //Saves the selection of sentences if the user changes it
    sentences_dropdown.onchange = function () {
        const newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
        chrome.storage.local.set({'sentences': parseInt(newSelection)});
    };
}

/**
 * Populates the tickboxes of sources and ticks the ones the user has saved
 * @param sources - the saved values for these
 */
function setSources(sources)
{
    if (!sources)       //no saved values, tick all boxes
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

        //Amends the true/false selection of each tickbox if the user clicks on any of them
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

/**
 * Populates the tickboxes of topics selected by the user
 * @param topics - the saved values of topics
 */
function setTopics(topics)
{
    if (!topics)        //no saved topics found, tick all boxes
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

        //Swaps the value of a tickbox in storage if the user clicks on it
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

/**
 * Changes the true/false value of the source/topic passed in in storage. Called whenever the user ticks or unticks a box
 * @param checkbox_name
 * @param item_name
 * @param value
 */
function changeCheckboxValue(checkbox_name, item_name, value) {
    chrome.storage.local.get([checkbox_name], function (result) {
        let replacement = result[checkbox_name];
        replacement[item_name] = value;
        if (checkbox_name === 'sources')                            //In ES5 and earlier, you cannot use a variable as a property name inside an object literal
            chrome.storage.local.set({'sources': replacement});     //So we cannot do ({checkbox_name: replacement});
        else                                                        //The more you know!
            chrome.storage.local.set({'topics': replacement});
    });
}

/**
 * Calls the relevant functions when the user clicks the play/pause button. Determines what to do by the current state of the program
 */
function playPauseToggle() {
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

        if (!currentlyplaying)      //if nothing is playing, play the bulletin
        {
            play();
        }
        else if (currentlyplaying && !currentlypaused)      //if something is playing and it isn't paused
        {
            pause();
        }
        else if (currentlyplaying && currentlypaused)       //if a bulletin is paused
        {
            resume();
        }
    });
}

/**
 * Play a new bulletin of news
 */
function play()
{
    getSources().then(sources => {      //read the user's selection of sources
        getTopics().then(topics => {    //read the user's selection of topics
            if (Bulletin.checkNewsAUUK(sources, topics))    //check if News.com.au and UK are the only boxes ticked. Can't get news if so
            {
                document.getElementById('headline').innerHTML = "News.com.au does not report UK news";
                return false;
            }

            let found = false;
            for (let i=0; i<Object.keys(sources).length; i++)       //verifies that at least one source is ticked
            {
                if (sources[Object.keys(sources)[i]])
                {
                    found = true;
                    break;
                }
            }

            if (!found)     //No sources ticked
            {
                document.getElementById('headline').innerHTML = "Select a source + topic";
                return false;
            }

            found = false;
            for (let i=0; i<Object.keys(topics).length; i++)        //Verifies that at least one topic is ticked
            {
                if (topics[Object.keys(topics)[i]])
                {
                    found = true;
                    break;
                }
            }

            if (!found)     //No topics ticked
            {
                document.getElementById('headline').innerHTML = "Select a source + topic";
                return false;
            }

            //Give visual output while bulletin is fetched
            document.getElementById('headline').innerHTML = "Fetching news...";
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
            chrome.storage.local.set({"playing": true});
            chrome.storage.local.set({"paused": false});
            chrome.runtime.sendMessage({greeting: "play"});
            return true;
        });
    });
}

/**
 * Changes pause button to play button and sends message to pause
 */
function pause()
{
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": true});
    chrome.runtime.sendMessage({greeting: "pause"});
}

/**
 * Changes play button to pause button and sends message to resume current bulletin
 */
function resume()
{
    document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    chrome.storage.local.set({"playing": true});
    chrome.storage.local.set({"paused": false});
    chrome.runtime.sendMessage({greeting: "resume"});
}

/**
 * Resets buttons and removes details of current article
 */
function stop() {
    document.getElementById('headline').innerHTML = "";
    document.getElementById('publisher').innerHTML = "";
    document.getElementById('topic').innerHTML = "";
    document.getElementById('playPauseBtnIcon').className = "icon-play btn";
    chrome.runtime.sendMessage({greeting: "stop"});
    chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
}

//Thanks to user Steve Harrison on Stack Overflow
//Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
/**
 * Capitalises the first letter of an input string
 * @param string - the input string
 * @returns {string|*} - the returned string
 */
function capitalizeFirstLetter(string) {
    if (string === 'uk' || string === 'Uk')
        return 'UK';

    try
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    catch(TypeError)
    {
        return string;
    }
}

/**
 * Reads the map of sources from storage and returns them
 * @returns {Promise<unknown>} - the stored sources
 */
export async function getSources()
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['sources'], function (result) {
            const sources = result['sources'];
            resolve(sources);
        });
    });
}

/**
 * Reads the map of topics from storage and returns them
 * @returns {Promise<unknown>} - the stored topics
 */
export async function getTopics()
{
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['topics'], function (result) {
            const topics = result['topics'];
            resolve(topics);
        });
    });
}

/**
 * Message listener to receive messages from bulletin regarding current article or having no more articles to read
 */
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