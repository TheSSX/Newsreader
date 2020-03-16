"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _language_config = require("./language_config.js");

var _preferences = require("./preferences.js");

/**
 * The starting script which triggers when the user clicks the extension icon
 */
document.addEventListener("DOMContentLoaded", setUp);

function setUp() {
  return _setUp.apply(this, arguments);
}

function _setUp() {
  _setUp = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var languages_dropdown, sentences_dropdown, playPauseButton, stopButton;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            //Setting play/pause button state
            chrome.storage.local.get(['playing', 'paused', 'headline', 'publisher', 'topic', 'language', 'sentences'], function (result) {
              var currentlyplaying = result['playing'];
              var currentlypaused = result['paused'];
              var headline = result['headline'];
              var publisher = result['publisher'];
              var topic = result['topic'];
              var language = result['language'];
              var sentences = result['sentences'];

              if (currentlyplaying && !currentlypaused) {
                document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
              }

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

              var sentences_dropdown = document.getElementById('sentences');

              for (var _i = _preferences.min_sentences; _i <= _preferences.max_sentences; _i++) {
                var _option = _i.toString();

                var _element = document.createElement("option");

                _element.textContent = _option;
                _element.value = _option;
                sentences_dropdown.appendChild(_element);
              }

              if (sentences) {
                sentences_dropdown.value = sentences.toString();
              } else {
                chrome.storage.local.set({
                  'sentences': 3
                });
              }

              document.getElementById('headline').innerHTML = headline || "";
              document.getElementById('publisher').innerHTML = publisher || "";
              document.getElementById('topic').innerHTML = topic || "";
            });
            languages_dropdown = document.getElementById('languages');

            languages_dropdown.onchange = function () {
              var newSelection = languages_dropdown[languages_dropdown.selectedIndex].text;
              chrome.storage.local.set({
                'language': newSelection
              });
            };

            sentences_dropdown = document.getElementById('sentences');

            sentences_dropdown.onchange = function () {
              var newSelection = sentences_dropdown[sentences_dropdown.selectedIndex].text;
              chrome.storage.local.set({
                'sentences': parseInt(newSelection)
              });
            }; //Add event listeners for when buttons are clicked


            playPauseButton = document.getElementById('playPauseBtn');
            stopButton = document.getElementById('stopBtn');

            if (playPauseButton && stopButton) {
              playPauseButton.addEventListener('click', playPauseToggle);
              stopButton.addEventListener('click', stop);
            } else {//TODO something broke, what do we do, add something later
            }

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _setUp.apply(this, arguments);
}

function playPauseToggle() {
  return _playPauseToggle.apply(this, arguments);
}

function _playPauseToggle() {
  _playPauseToggle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
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

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _playPauseToggle.apply(this, arguments);
}

function play() {
  return _play.apply(this, arguments);
}

function _play() {
  _play = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
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

          case 5:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _play.apply(this, arguments);
}

function pause() {
  return _pause.apply(this, arguments);
}

function _pause() {
  _pause = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
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

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _pause.apply(this, arguments);
}

function resume() {
  return _resume.apply(this, arguments);
}

function _resume() {
  _resume = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
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

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _resume.apply(this, arguments);
}

function stop() {
  return _stop.apply(this, arguments);
} //HTML stuff


function _stop() {
  _stop = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            document.getElementById('headline').innerHTML = "";
            document.getElementById('publisher').innerHTML = "";
            document.getElementById('topic').innerHTML = "";
            document.getElementById('playPauseBtnIcon').className = "icon-play btn";
            chrome.runtime.sendMessage({
              greeting: "stop"
            });
            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);

          case 6:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6);
  }));
  return _stop.apply(this, arguments);
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