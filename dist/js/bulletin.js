"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bulletin = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _pageparser = require("../../dist/js/pageparser");

var _preferences = require("./preferences.js");

var _article = require("../../dist/js/article");

var _speech = require("../../dist/js/speech");

var _language_config = require("./language_config.js");

var _translator = require("../../dist/js/translator");

var articles = [];
var remaining = 0;
/**
 Class for constructing a bulletin of articles and reading them aloud
 Sends back messages for current article being read
 */

var Bulletin = /*#__PURE__*/function () {
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
     * 4) Call the read function, passing the array of articles
     *
     * @param sources - the map of sources. A source maps to true if it is selected by the user
     * @param topics - the map of topics. A topic maps to true if it is selected by the user
     */
    value: function fetchNews(sources, topics) {
      //News.com.au does not have UK news
      if (Bulletin.checkNewsAUUK(sources, topics)) return false;
      articles = []; //each fetched article is stored here

      remaining = Object.keys(topics).length; //loop until we have no more articles to fetch

      var _loop = function _loop(i) {
        var source = Object.keys(_preferences.sourcelinks)[Math.floor(Math.random() * Object.keys(_preferences.sourcelinks).length)]; // get random source to contact

        var topic = Object.keys(topics)[i]; // topics are read in a random order every time

        if (!topics[topic]) {
          //if the user has not ticked this topic, skip it
          remaining--;
          return "continue";
        }

        while (!sources[source]) //loop until we get a source the user selected. Will not loop forever as this has already been checked for
        {
          source = Object.keys(_preferences.sourcelinks)[Math.floor(Math.random() * Object.keys(_preferences.sourcelinks).length)];
        }

        var topiclink = _preferences.topiclinks[topic][source]; // for the selected source, get the URL to the selected topic page from preferences.js

        try {
          var data = _pageparser.PageParser.getArticle(source, topic, topiclink); // send source, topic and number of sentences to summarise down to


          data.then(function (article) // article returned in form of promise
          {
            articles.push(article);
            remaining--;

            if (remaining <= 0) //begin reading articles out
              {
                var nextArticle = articles.shift();

                if (nextArticle === undefined) //no articles to play
                  {
                    chrome.runtime.sendMessage({
                      greeting: "stop"
                    });
                    chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                    return false;
                  }

                Bulletin.checkSentences(nextArticle).then(function (newArticle) {
                  //change article length if necessary
                  Bulletin.checkTranslation(newArticle).then(function (result) {
                    //change article translation if necessary
                    nextArticle = result;
                    Bulletin.readArticles(nextArticle, articles);
                    return true;
                  });
                });
              }
          })["catch"](function () {
            //Error occurred with this source, try again
            Bulletin.retryTopic(topic, 2);
          });
        } catch (TypeError) {
          Bulletin.retryTopic(topic, 2); // retry fetching an article using recursion
        }
      };

      for (var i = 0; i < Object.keys(topics).length; i++) {
        var _ret = _loop(i);

        if (_ret === "continue") continue;
      }
    }
    /**
     * Retries getting an article with the given topic, up to a maximum of 10 tries before failing gracefully
     * @param topic - the topic to look for
     * @param attempt - keeps track of how many attempts we've had so far
     * @returns {boolean} - true/false if managed to get an article
     */

  }, {
    key: "retryTopic",
    value: function retryTopic(topic, attempt) {
      var source = Object.keys(_preferences.sourcelinks)[Math.floor(Math.random() * Object.keys(_preferences.sourcelinks).length)]; // get random source to contact

      var topiclink = _preferences.topiclinks[topic][source];

      try {
        var data = _pageparser.PageParser.getArticle(source, topic, topiclink); // send source, topic and number of sentences to summarise to


        data.then(function (article) // article returned in form of promise
        {
          articles.push(article);
          remaining--;

          if (remaining <= 0) {
            var nextArticle = articles.shift();

            if (nextArticle === undefined) {
              chrome.runtime.sendMessage({
                greeting: "stop"
              });
              chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
              return false;
            }

            Bulletin.checkSentences(nextArticle).then(function (newArticle) {
              Bulletin.checkTranslation(newArticle).then(function (result) {
                nextArticle = result;
                Bulletin.readArticles(nextArticle, articles);
                return true;
              });
            });
          }
        })["catch"](function () {
          Bulletin.retryTopic(topic, ++attempt);
        });
      } catch (TypeError) {
        if (attempt >= 10) // stop recursive loop, not managed to fetch an article for the topic
          {
            remaining--;

            if (remaining <= 0) {
              var nextArticle = articles.shift();

              if (nextArticle === undefined) {
                chrome.runtime.sendMessage({
                  greeting: "stop"
                });
                chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                return false;
              }

              Bulletin.checkSentences(nextArticle).then(function (newArticle) {
                Bulletin.checkTranslation(newArticle).then(function (result) {
                  nextArticle = result;
                  Bulletin.readArticles(nextArticle, articles);
                  return true;
                });
              });
            }
          } else {
          Bulletin.retryTopic(topic, ++attempt); // try again, increase number of attempts
        }
      }
    }
    /**
     * Reads aloud the articles and calls itself recursively
     * @param current - the current article to read aloud
     * @param articles - the list of remaining articles to read aloud
     * @returns {boolean} - true once finished
     */

  }, {
    key: "readArticles",
    value: function readArticles(current, articles) {
      if (current === undefined) //no more articles left to read
        {
          chrome.runtime.sendMessage({
            greeting: "stop"
          }); //send message to front end that articles have finished

          chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
          return true;
        }

      var message; //contains details of current article to display on front end

      if (current.language === 'English') {
        message = {
          "headline": '<a href="' + current.link + '" target="_blank">' + current.allheadline + '</a>',
          "publisher": current.publisher,
          "topic": Bulletin.capitalizeFirstLetter(current.topic)
        };
      } else {
        message = {
          "headline": '<a href="' + current.link + '" target="_blank">' + current.headline + '</a>',
          "publisher": current.publisher,
          "topic": Bulletin.capitalizeFirstLetter(current.topic)
        };
      } //Store details of current article in storage to allow for persistent popup


      chrome.storage.local.set({
        "headline": message.headline
      });
      chrome.storage.local.set({
        "publisher": message.publisher
      });
      chrome.storage.local.set({
        "topic": message.topic
      });
      chrome.runtime.sendMessage({
        greeting: message
      });
      current.read(); //read the article

      var utterance = new SpeechSynthesisUtterance("");
      utterance.onend = /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var nextArticle;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nextArticle = articles.shift();

                if (!(nextArticle === undefined)) {
                  _context.next = 5;
                  break;
                }

                chrome.runtime.sendMessage({
                  greeting: "stop"
                });
                chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                return _context.abrupt("return", true);

              case 5:
                Bulletin.checkSentences(nextArticle).then(function (newArticle) {
                  //amend the number of sentences in article if necessary
                  Bulletin.checkTranslation(newArticle).then(function (result) {
                    //amend the language of the article if necessary
                    nextArticle = result;
                    Bulletin.readArticles(nextArticle, articles);
                  });
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));
      window.speechSynthesis.speak(utterance);
    }
    /**
     * Reads the current value of sentences user wants from Chrome storage and changes the length of the given article to reflect this
     * @param article - the article in question
     * @returns {Promise<unknown>} - the new amended article
     */

  }, {
    key: "checkSentences",
    value: function () {
      var _checkSentences = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(article) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", new Promise(function (resolve) {
                  chrome.storage.local.get(['sentences'], function (result) {
                    //read sentences from storage
                    var sentences = result['sentences'];

                    if (sentences) {
                      article.amendLength(sentences);
                    }

                    resolve(article);
                  });
                }));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function checkSentences(_x) {
        return _checkSentences.apply(this, arguments);
      }

      return checkSentences;
    }()
    /**
     * Reads the current language the user wants from Chrome storage and translates the article if not English
     * @param article - the article in question
     * @returns {Promise<unknown>} - the translated article
     */

  }, {
    key: "checkTranslation",
    value: function () {
      var _checkTranslation = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(article) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                return _context4.abrupt("return", new Promise(function (resolve) {
                  chrome.storage.local.get(['language'], /*#__PURE__*/function () {
                    var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(result) {
                      var language_choice, translatedArticle;
                      return _regenerator["default"].wrap(function _callee3$(_context3) {
                        while (1) {
                          switch (_context3.prev = _context3.next) {
                            case 0:
                              //read language string
                              language_choice = result['language'];

                              if (!language_choice) {
                                _context3.next = 7;
                                break;
                              }

                              if (!(language_choice !== 'English')) {
                                _context3.next = 7;
                                break;
                              }

                              _context3.next = 5;
                              return Bulletin.getTranslatedArticle(article, language_choice);

                            case 5:
                              translatedArticle = _context3.sent;

                              //translate the article
                              if (translatedArticle !== undefined) {
                                article = translatedArticle;
                              } else {
                                new _speech.Speech(_language_config.translation_unavailable[language_choice], language_choice).speak(); //translation could not be performed, inform the user of this by speaking 'Translation unavailable' in their selected language
                              }

                            case 7:
                              resolve(article);

                            case 8:
                            case "end":
                              return _context3.stop();
                          }
                        }
                      }, _callee3);
                    }));

                    return function (_x3) {
                      return _ref2.apply(this, arguments);
                    };
                  }());
                }));

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function checkTranslation(_x2) {
        return _checkTranslation.apply(this, arguments);
      }

      return checkTranslation;
    }()
    /**
     * Calls the translation class to translate each element of the article
     * @param article - the article to translate
     * @param language_choice - the language to translate to
     * @returns {Promise<undefined|Article>} - the translated article
     */

  }, {
    key: "getTranslatedArticle",
    value: function () {
      var _getTranslatedArticle = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(article, language_choice) {
        var publishertranslatedata, topictranslatedata, headline, i, current, text, _i, _current, publisher, topic;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.next = 2;
                return _translator.Translator.translate(article.publisher, _language_config.languages[language_choice]);

              case 2:
                publishertranslatedata = _context5.sent;

                if (!(publishertranslatedata === undefined)) {
                  _context5.next = 5;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 5:
                _context5.next = 7;
                return _translator.Translator.translate(article.topic, _language_config.languages[language_choice]);

              case 7:
                topictranslatedata = _context5.sent;
                //translate topic
                headline = [];
                i = 0;

              case 10:
                if (!(i < article.headline.length)) {
                  _context5.next = 20;
                  break;
                }

                _context5.next = 13;
                return _translator.Translator.translate(article.headline[i], _language_config.languages[language_choice]);

              case 13:
                current = _context5.sent;

                if (!(current['code'] !== 200)) {
                  _context5.next = 16;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 16:
                headline.push(current['text']);

              case 17:
                i++;
                _context5.next = 10;
                break;

              case 20:
                text = [];
                _i = 0;

              case 22:
                if (!(_i < article.text.length)) {
                  _context5.next = 32;
                  break;
                }

                _context5.next = 25;
                return _translator.Translator.translate(article.text[_i], _language_config.languages[language_choice]);

              case 25:
                _current = _context5.sent;

                if (!(_current['code'] !== 200)) {
                  _context5.next = 28;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 28:
                text.push(_current['text']);

              case 29:
                _i++;
                _context5.next = 22;
                break;

              case 32:
                if (!(topictranslatedata === undefined || article.headline.length !== headline.length || article.text.length !== text.length)) {
                  _context5.next = 36;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 36:
                if (!(publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200)) {
                  _context5.next = 40;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 40:
                publisher = publishertranslatedata['text'];
                topic = topictranslatedata['text'];
                return _context5.abrupt("return", new _article.Article(publisher, topic, article.headline, headline, article.link, article.alltext, text, language_choice));

              case 43:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getTranslatedArticle(_x4, _x5) {
        return _getTranslatedArticle.apply(this, arguments);
      }

      return getTranslatedArticle;
    }()
    /**
     * Checks if News.com.au and UK are the only source and topic selected. Invalid if so, because News.com.au does not support UK news
     * @param sources - the map of sources. A source maps to true if the user has selected it
     * @param topics - the map of topics. A topic maps to true if the user has selected it
     * @returns {boolean} - true if only News.com.au and UK are selected, false otherwise
     */

  }, {
    key: "checkNewsAUUK",
    value: function checkNewsAUUK(sources, topics) {
      if (!sources['News.com.au'] || !topics['uk']) return false;

      for (var i = 0; i < Object.keys(sources).length; i++) {
        if (sources[Object.keys(sources)[i]] && Object.keys(sources)[i] !== 'News.com.au') return false;
      }

      for (var _i2 = 0; _i2 < Object.keys(topics).length; _i2++) {
        if (topics[Object.keys(topics)[_i2]] && Object.keys(topics)[_i2] !== 'uk') return false;
      }

      return true;
    } //Thanks to user Steve Harrison on Stack Overflow
    //Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript

    /**
     * Capitalises the first letter of a given string
     * @param string - the string in question
     * @returns {string|*} - the capitalised string or the original string if this failed
     */

  }, {
    key: "capitalizeFirstLetter",
    value: function capitalizeFirstLetter(string) {
      try {
        return string.charAt(0).toUpperCase() + string.slice(1);
      } catch (TypeError) {
        return string;
      }
    }
  }]);
  return Bulletin;
}();

exports.Bulletin = Bulletin;