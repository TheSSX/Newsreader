"use strict";

var _bulletin = require("../../dist/js/bulletin");

var _popup = require("../../dist/js/popup");

/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "play") {
    (0, _popup.getSources)().then(function (sources) {
      (0, _popup.getTopics)().then(function (topics) {
        _bulletin.Bulletin.fetchNews(sources, topics);
      });
    });
  } else if (request.greeting === "pause") window.speechSynthesis.pause();else if (request.greeting === "resume") window.speechSynthesis.resume();else if (request.greeting === "stop") window.speechSynthesis.cancel();
});