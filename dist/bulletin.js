"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bulletin = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _pageparser = require("./pageparser.mjs");

var _preferences = require("./preferences.js");

/**
 Class for object to query random sources for each topic
 */
var Bulletin =
/*#__PURE__*/
function () {
  function Bulletin() {
    (0, _classCallCheck2["default"])(this, Bulletin);
  }

  (0, _createClass2["default"])(Bulletin, null, [{
    key: "fetchNews",

    /**
     * For each topic specified in the list the user wants to hear from:
     * 1) Pick a random news source to fetch this topc from
     * 2) Attempt to pick a random article on that subject
     * 3) Send that article to the SMMRY API, inputting the number of sentences to summarise down to
     * 4) For each article, read the publication, topic, title and summarised article
     */
    value: function fetchNews() {
      var _loop = function _loop(i) {
        var source = Object.keys(_preferences.sources)[Math.floor(Math.random() * Object.keys(_preferences.sources).length)]; // get random source to contact

        var topic = Object.keys(_preferences.topics)[i]; // topics are read in a random order every time
        //News.com.au does not have UK news. Need a different source

        while (topic === "uk" && source === "News.com.au") {
          source = Object.keys(_preferences.sources)[Math.floor(Math.random() * Object.keys(_preferences.sources).length)];
        }

        var topiclink = _preferences.topics[topic][source]; // for the selected source, get the URL to the selected topic page

        var data = _pageparser.PageParser.getArticle(source, topic, topiclink, _preferences.sentences); // send source, topic and number of sentences to summarise down to


        data.then(function (article) // returned in form of promise with value of article
        {
          try {
            article.read();
          } catch (TypeError) {
            Bulletin.retryTopic(topic, 2); // retry fetching an article using recursion
          }
        });
      };

      for (var i = 0; i < Object.keys(_preferences.topics).length; i++) // change i< to prevent unnecessary credits being used up
      {
        _loop(i);
      }
    }
  }, {
    key: "retryTopic",
    value: function retryTopic(topic, attempt) {
      var source = Object.keys(_preferences.sources)[Math.floor(Math.random() * Object.keys(_preferences.sources).length)]; // get random source to contact

      var topiclink = _preferences.topics[topic][source];

      var data = _pageparser.PageParser.getArticle(source, topic, topiclink, _preferences.sentences); // send source, topic and number of sentences to summarise to


      data.then(function (article) // returned in form of promise with value of article
      {
        try {
          article.read();
        } catch (TypeError) {
          if (attempt === 10) // stop recursive loop, not managed to fetch an article for the topic
            {
              console.log("Failed on topic " + topic);
            } else {
            Bulletin.retryTopic(topic, ++attempt); // try again, increase number of attempts
          }
        }
      });
    }
  }]);
  return Bulletin;
}();
/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */


exports.Bulletin = Bulletin;
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting === "play") Bulletin.fetchNews();else if (request.greeting === "pause") window.speechSynthesis.pause();else if (request.greeting === "resume") window.speechSynthesis.resume();else if (request.greeting === "stop") window.speechSynthesis.cancel();
});