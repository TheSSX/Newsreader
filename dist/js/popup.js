"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSources = getSources;
exports.getTopics = getTopics;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _language_config = require("./language_config.js");

var _preferences = require("./preferences.js");

var _bulletin = require("../../dist/js/bulletin");

/**
 * The script running in the background of the popup window. Calls the relevant scripts for bulletins and also
 * sets up the popup whenever the user opens it
 */
var allsources = Object.keys(_preferences.sourcelinks);
var alltopics = Object.keys(_preferences.topiclinks);
document.addEventListener('readystatechange', function () {
  if (document.readyState === "complete") setUp();
});
/**
 * Sets up the popup window when the user opens it. Reads the data it needs for this from Chrome storage
 * @returns {boolean} - true if successful setup, false otherwise
 */

function setUp() {
  //Setting up the UI with user preferences
  chrome.storage.local.get(['playing', 'paused', 'headline', 'publisher', 'topic', 'language', 'sentences', 'sources', 'topics'], function (result) {
    var currentlyplaying = result['playing'];
    var currentlypaused = result['paused'];
    var headline = result['headline'];
    var publisher = result['publisher'];
    var topic = result['topic'];
    var language = result['language'];
    var sentences = result['sentences'];
    var sources = result['sources'];
    var topics = result['topics']; //Change the style of the play/pause button depending on if an article is playing or not

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
  }); //Add event listeners for when buttons are clicked

  var playPauseButton = document.getElementById('playPauseBtn');
  var stopButton = document.getElementById('stopBtn');

  if (playPauseButton && stopButton) {
    playPauseButton.addEventListener('click', playPauseToggle);
    stopButton.addEventListener('click', stop);
    return true;
  } else //some elements could not be found, setup failed
    {
      return false;
    }
}
/**
 * Populates the language selection dropdown element with the offered languages. Also sets the currently selected language with the one read from storage
 * @param language - the currently selected language
 */


function setLanguages(language) {
  //Populate the dropdown
  var languages_dropdown = document.getElementById('languages');

  for (var i = 0; i < Object.keys(_language_config.languages).length; i++) {
    var option = Object.keys(_language_config.languages)[i];
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;
    languages_dropdown.appendChild(element);
  }

  if (language) {
    languages_dropdown.value = language; //set the currently selected language
  } else //no language currently selected, default to English
    {
      chrome.storage.local.set({
        'language': Object.keys(_language_config.languages)[0]
      });
    } //When the user changes the language, save this value to Chrome storage


  languages_dropdown.onchange = function () {
    var newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
    chrome.storage.local.set({
      'language': newSelection
    });
  };
}
/**
 * Populates the sentence dropdown with the offered sentences. Also sets the currently selected sentence number
 * @param sentences - the currently selected sentence number
 */


function setSentences(sentences) {
  //Populate the dropdown
  var sentences_dropdown = document.getElementById('sentences');

  for (var i = _preferences.min_sentences; i <= _preferences.max_sentences; i++) {
    var option = i.toString();
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;
    sentences_dropdown.appendChild(element);
  }

  if (sentences) {
    sentences_dropdown.value = sentences.toString(); //set the current value
  } else {
    chrome.storage.local.set({
      'sentences': 3
    }); //no selection found, default to 3
  } //Saves the selection of sentences if the user changes it


  sentences_dropdown.onchange = function () {
    var newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
    chrome.storage.local.set({
      'sentences': parseInt(newSelection)
    });
  };
}
/**
 * Populates the tickboxes of sources and ticks the ones the user has saved
 * @param sources - the saved values for these
 */


function setSources(sources) {
  if (!sources) //no saved values, tick all boxes
    {
      sources = {};

      for (var i = 0; i < allsources.length; i++) {
        sources[allsources[i]] = true;
      }

      chrome.storage.local.set({
        'sources': sources
      });
    }

  var sources_checkboxes = document.getElementById('sources-checkboxes');

  var _loop = function _loop(_i) {
    var name = allsources[_i];
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = name;

    if (sources[name]) {
      checkbox.checked = true;
    } //Amends the true/false selection of each tickbox if the user clicks on any of them


    checkbox.addEventListener('change', function (event) {
      if (event.target.checked) {
        changeCheckboxValue('sources', checkbox.name, true);
      } else {
        changeCheckboxValue('sources', checkbox.name, false);
      }
    });
    var label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(name));
    var br = document.createElement('br');
    sources_checkboxes.appendChild(checkbox);
    sources_checkboxes.appendChild(label);
    sources_checkboxes.appendChild(br);
  };

  for (var _i = 0; _i < allsources.length; _i++) {
    _loop(_i);
  }
}
/**
 * Populates the tickboxes of topics selected by the user
 * @param topics - the saved values of topics
 */


function setTopics(topics) {
  if (!topics) //no saved topics found, tick all boxes
    {
      topics = {};

      for (var i = 0; i < alltopics.length; i++) {
        var current = alltopics[i];
        topics[current] = true;
      }

      chrome.storage.local.set({
        'topics': topics
      });
    }

  var topics_checkboxes = document.getElementById('topics-checkboxes');

  var _loop2 = function _loop2(_i2) {
    var name = alltopics[_i2];
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = name;
    checkbox.value = name;

    if (topics[name]) {
      checkbox.checked = true;
    } //Swaps the value of a tickbox in storage if the user clicks on it


    checkbox.addEventListener('change', function (event) {
      if (event.target.checked) {
        changeCheckboxValue('topics', checkbox.name, true);
      } else {
        changeCheckboxValue('topics', checkbox.name, false);
      }
    });
    var label = document.createElement('label');
    label.htmlFor = name;
    label.appendChild(document.createTextNode(capitalizeFirstLetter(name)));
    var br = document.createElement('br');
    topics_checkboxes.appendChild(checkbox);
    topics_checkboxes.appendChild(label);
    topics_checkboxes.appendChild(br);
  };

  for (var _i2 = 0; _i2 < alltopics.length; _i2++) {
    _loop2(_i2);
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
    var replacement = result[checkbox_name];
    replacement[item_name] = value;
    if (checkbox_name === 'sources') //In ES5 and earlier, you cannot use a variable as a property name inside an object literal
      chrome.storage.local.set({
        'sources': replacement
      }); //So we cannot do ({checkbox_name: replacement});
    else //The more you know!
      chrome.storage.local.set({
        'topics': replacement
      });
  });
}
/**
 * Calls the relevant functions when the user clicks the play/pause button. Determines what to do by the current state of the program
 */


function playPauseToggle() {
  chrome.storage.local.get(['playing', 'paused'], function (result) {
    var currentlypaused, currentlyplaying;

    try {
      currentlyplaying = result['playing'];
      currentlypaused = result['paused'];
    } catch (TypeError) {
      play();
      return;
    }

    if (!currentlyplaying) //if nothing is playing, play the bulletin
      {
        play();
      } else if (currentlyplaying && !currentlypaused) //if something is playing and it isn't paused
      {
        pause();
      } else if (currentlyplaying && currentlypaused) //if a bulletin is paused
      {
        resume();
      }
  });
}
/**
 * Play a new bulletin of news
 */


function play() {
  getSources().then(function (sources) {
    //read the user's selection of sources
    getTopics().then(function (topics) {
      //read the user's selection of topics
      if (_bulletin.Bulletin.checkNewsAUUK(sources, topics)) //check if News.com.au and UK are the only boxes ticked. Can't get news if so
        {
          document.getElementById('headline').innerHTML = "News.com.au does not report UK news";
          return false;
        }

      var found = false;

      for (var i = 0; i < Object.keys(sources).length; i++) //verifies that at least one source is ticked
      {
        if (sources[Object.keys(sources)[i]]) {
          found = true;
          break;
        }
      }

      if (!found) //No sources ticked
        {
          document.getElementById('headline').innerHTML = "Select a source + topic";
          return false;
        }

      found = false;

      for (var _i3 = 0; _i3 < Object.keys(topics).length; _i3++) //Verifies that at least one topic is ticked
      {
        if (topics[Object.keys(topics)[_i3]]) {
          found = true;
          break;
        }
      }

      if (!found) //No topics ticked
        {
          document.getElementById('headline').innerHTML = "Select a source + topic";
          return false;
        } //Give visual output while bulletin is fetched


      document.getElementById('headline').innerHTML = "Fetching news...";
      document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
      chrome.storage.local.set({
        "playing": true
      });
      chrome.storage.local.set({
        "paused": false
      });
      chrome.runtime.sendMessage({
        greeting: "play"
      });
      return true;
    });
  });
}
/**
 * Changes pause button to play button and sends message to pause
 */


function pause() {
  document.getElementById('playPauseBtnIcon').className = "icon-play btn";
  chrome.storage.local.set({
    "playing": true
  });
  chrome.storage.local.set({
    "paused": true
  });
  chrome.runtime.sendMessage({
    greeting: "pause"
  });
}
/**
 * Changes play button to pause button and sends message to resume current bulletin
 */


function resume() {
  document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
  chrome.storage.local.set({
    "playing": true
  });
  chrome.storage.local.set({
    "paused": false
  });
  chrome.runtime.sendMessage({
    greeting: "resume"
  });
}
/**
 * Resets buttons and removes details of current article
 */


function stop() {
  document.getElementById('headline').innerHTML = "";
  document.getElementById('publisher').innerHTML = "";
  document.getElementById('topic').innerHTML = "";
  document.getElementById('playPauseBtnIcon').className = "icon-play btn";
  chrome.runtime.sendMessage({
    greeting: "stop"
  });
  chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
} //Thanks to user Steve Harrison on Stack Overflow
//Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

/**
 * Capitalises the first letter of an input string
 * @param string - the input string
 * @returns {string|*} - the returned string
 */


function capitalizeFirstLetter(string) {
  if (string === 'uk' || string === 'Uk') return 'UK';

  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (TypeError) {
    return string;
  }
}
/**
 * Reads the map of sources from storage and returns them
 * @returns {Promise<unknown>} - the stored sources
 */


function getSources() {
  return _getSources.apply(this, arguments);
}
/**
 * Reads the map of topics from storage and returns them
 * @returns {Promise<unknown>} - the stored topics
 */


function _getSources() {
  _getSources = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", new Promise(function (resolve, reject) {
              chrome.storage.local.get(['sources'], function (result) {
                var sources = result['sources'];
                resolve(sources);
              });
            }));

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getSources.apply(this, arguments);
}

function getTopics() {
  return _getTopics.apply(this, arguments);
}
/**
 * Message listener to receive messages from bulletin regarding current article or having no more articles to read
 */


function _getTopics() {
  _getTopics = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", new Promise(function (resolve, reject) {
              chrome.storage.local.get(['topics'], function (result) {
                var topics = result['topics'];
                resolve(topics);
              });
            }));

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _getTopics.apply(this, arguments);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if ((0, _typeof2["default"])(request.greeting) === 'object' && request.greeting !== null) {
    document.getElementById('headline').innerHTML = request.greeting.headline;
    document.getElementById('publisher').innerHTML = request.greeting.publisher;
    document.getElementById('topic').innerHTML = request.greeting.topic;
  } else if (request.greeting === "stop") {
    stop();
  }
});