"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stop = stop;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bulletin = require("../../dist/js/bulletin");

/**
 * The starting script which triggers when the user clicks the extension icon
 */
window.onload = function () {
  var playPauseButton = document.getElementById('playPauseBtn');
  var stopButton = document.getElementById('stopBtn');

  if (playPauseButton && stopButton) {
    playPauseButton.addEventListener('click', playPauseToggle);
    stopButton.addEventListener('click', stop);
  } else {//TODO something broke, what do we do, add something later
  }

  try {
    var currentlypaused = chrome.storage.local.get(['paused']);

    if (!currentlypaused) {
      document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
    }
  } catch (TypeError) {
    //stop();
    chrome.storage.local.set({
      "playing": false
    });
    chrome.storage.local.set({
      "paused": false
    });
  }
};

function playPauseToggle() {
  return _playPauseToggle.apply(this, arguments);
}

function _playPauseToggle() {
  _playPauseToggle = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            chrome.storage.local.get(['playing', 'paused'], function (result) {
              var currentlyplaying = result['playing'];
              var currentlypaused = result['paused'];

              if (!currentlyplaying) {
                play();
              } else if (currentlyplaying && currentlypaused) {
                pause();
              } else if (currentlyplaying && !currentlypaused) {
                resume();
              }
            });

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _playPauseToggle.apply(this, arguments);
}

function play() {
  return _play.apply(this, arguments);
}

function _play() {
  _play = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            //Bulletin.fetchNews();
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

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _play.apply(this, arguments);
}

function pause() {
  return _pause.apply(this, arguments);
}

function _pause() {
  _pause = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee3() {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            document.getElementById('playPauseBtnIcon').className = "icon-play btn";
            chrome.storage.local.set({
              "playing": true
            });
            chrome.storage.local.set({
              "paused": false
            });
            chrome.runtime.sendMessage({
              greeting: "pause"
            });

          case 4:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _pause.apply(this, arguments);
}

function resume() {
  return _resume.apply(this, arguments);
}

function _resume() {
  _resume = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee4() {
    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            document.getElementById('playPauseBtnIcon').className = "icon-pause btn";
            chrome.storage.local.set({
              "playing": true
            });
            chrome.storage.local.set({
              "paused": true
            });
            chrome.runtime.sendMessage({
              greeting: "resume"
            });

          case 4:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _resume.apply(this, arguments);
}

function stop() {
  return _stop.apply(this, arguments);
}

function _stop() {
  _stop = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee5() {
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            document.getElementById('playPauseBtnIcon').className = "icon-play btn";
            chrome.storage.local.set({
              "playing": false
            });
            chrome.storage.local.set({
              "paused": false
            });
            chrome.runtime.sendMessage({
              greeting: "stop"
            });

          case 4:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _stop.apply(this, arguments);
}