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
 * The starting script which triggers when the user clicks the extension icon
 */
var allsources = Object.keys(_preferences.sourcelinks);
var alltopics = Object.keys(_preferences.topiclinks); //document.addEventListener("DOMContentLoaded", setUp);

document.addEventListener('readystatechange', function () {
  if (document.readyState === "complete") setUp();
});

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
    var topics = result['topics'];

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
  } else {
    return false;
  }
}

function setLanguages(language) {
  var languages_dropdown = document.getElementById('languages');

  for (var i = 0; i < Object.keys(_language_config.languages).length; i++) {
    var option = Object.keys(_language_config.languages)[i];
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;
    languages_dropdown.appendChild(element);
  }

  if (language) {
    languages_dropdown.value = language;
  } else {
    chrome.storage.local.set({
      'language': Object.keys(_language_config.languages)[0]
    });
  }

  languages_dropdown.onchange = function () {
    var newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
    chrome.storage.local.set({
      'language': newSelection
    });
  };
}

function setSentences(sentences) {
  var sentences_dropdown = document.getElementById('sentences');

  for (var i = _preferences.min_sentences; i <= _preferences.max_sentences; i++) {
    var option = i.toString();
    var element = document.createElement("option");
    element.textContent = option;
    element.value = option;
    sentences_dropdown.appendChild(element);
  }

  if (sentences) {
    sentences_dropdown.value = sentences.toString();
  } else {
    chrome.storage.local.set({
      'sentences': 3
    });
  }

  sentences_dropdown.onchange = function () {
    var newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
    chrome.storage.local.set({
      'sentences': parseInt(newSelection)
    });
  };
}

function setSources(sources) {
  if (!sources) {
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
    }

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

function setTopics(topics) {
  if (!topics) {
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
    }

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

    if (!currentlyplaying) {
      play();
    } else if (currentlyplaying && !currentlypaused) {
      pause();
    } else if (currentlyplaying && currentlypaused) {
      resume();
    }
  });
}

function play() {
  getSources().then(function (sources) {
    getTopics().then(function (topics) {
      if (_bulletin.Bulletin.checkNewsAUUK(sources, topics)) {
        document.getElementById('headline').innerHTML = "News.com.au does not report UK news";
        return false;
      }

      var found = false;

      for (var i = 0; i < Object.keys(sources).length; i++) {
        if (sources[Object.keys(sources)[i]]) {
          found = true;
          break;
        }
      }

      if (!found) {
        document.getElementById('headline').innerHTML = "Select a source + topic";
        return false;
      }

      found = false;

      for (var _i3 = 0; _i3 < Object.keys(topics).length; _i3++) {
        if (topics[Object.keys(topics)[_i3]]) {
          found = true;
          break;
        }
      }

      if (!found) {
        document.getElementById('headline').innerHTML = "Select a source + topic";
        return false;
      }

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


function capitalizeFirstLetter(string) {
  if (string === 'uk' || string === 'Uk') return 'UK';

  try {
    return string.charAt(0).toUpperCase() + string.slice(1);
  } catch (TypeError) {
    return string;
  }
}

function getSources() {
  return _getSources.apply(this, arguments);
}

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
} //HTML stuff


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