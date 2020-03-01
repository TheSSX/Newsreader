"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callTranslation = callTranslation;
exports.PageParser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _article = require("../dist/article");

var _articleextractor = require("../dist/articleextractor");

var _translator = require("../dist/translator");

var _preferences = require("./preferences.js");

var _language_config = require("./language_config.js");

var _speech = require("../dist/speech");

var _summarise = require("../dist/summarise");

/**
 Class for object to parse source article pages
 */
var PageParser =
/*#__PURE__*/
function () {
  function PageParser() {
    (0, _classCallCheck2["default"])(this, PageParser);
  }

  (0, _createClass2["default"])(PageParser, null, [{
    key: "getArticle",

    /**
     * Calls the right function for selecting and parsing an article based on the news source
     * @param source - the news source
     * @param topic- the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<*|Article>} - the article is contained in the promise value
     */
    value: function getArticle(source, topic, topiclink, sentences) {
      switch (source) {
        case "The Guardian":
          return PageParser.extractGuardian(topic, topiclink, sentences);

        case "BBC":
          return PageParser.extractBBC(topic, topiclink, sentences);

        case "Reuters":
          return PageParser.extractReuters(topic, topiclink, sentences);

        case "Sky News":
          return PageParser.extractSky(topic, topiclink, sentences);

        case "Associated Press":
          return PageParser.extractAP(topic, topiclink, sentences);

        case "Evening Standard":
          return PageParser.extractEveningStandard(topic, topiclink, sentences);

        case "The Independent":
          return PageParser.extractIndependent(topic, topiclink, sentences);

        case "ITV News":
          return PageParser.extractITV(topic, topiclink, sentences);

        case "News.com.au":
          return PageParser.extractNewsAU(topic, topiclink, sentences);

        default:
          throw new TypeError('Invalid source');
      }
    }
    /**
     * Queries a topic page on the Guardian website and selects a random article from it
     * @param topic - the news topic
     * @param sentences - the number of sentences to summarise down to
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractGuardian",
    value: function () {
      var _extractGuardian = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(topic, topiclink, sentences) {
        var publisher, linkdata, linksarr, i, currentlink, articlelinks, _i, current, links, randomlink, counter, data, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 2:
                if (topic === "uk") {
                  topic = "uk-news";
                }

                publisher = "The Guardian";
                _context.next = 6;
                return PageParser.extractPageData(topiclink);

              case 6:
                linkdata = _context.sent;
                linkdata = linkdata.split('<a href="');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i = 0; _i < linksarr.length; _i += 1) {
                  current = linksarr[_i];

                  if (current.includes('-')) {
                    articlelinks.push(current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 15:
                counter = 0;

                do {
                  randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                  counter++;
                } while (randomlink.startsWith(_preferences.sources[publisher] + topic + '/video/') && counter < 3); //articles devoted to a video are no good


                if (!randomlink.startsWith(_preferences.sources[publisher] + topic + '/video/')) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 19:
                _context.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context.sent;
                _context.next = 24;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 24:
                smmrydata = _context.sent;

                if (!(smmrydata === undefined)) {
                  _context.next = 36;
                  break;
                }

                headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                text = _articleextractor.ArticleExtractor.extractGuardianText(data);

                if (!(text !== undefined)) {
                  _context.next = 33;
                  break;
                }

                if (text.split(' - ')[1]) {
                  text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
                _context.next = 34;
                break;

              case 33:
                return _context.abrupt("return", undefined);

              case 34:
                _context.next = 48;
                break;

              case 36:
                headline = smmrydata['sm_api_title']; //article headline returned

                text = smmrydata['sm_api_content']; //summarised article returned

                error = smmrydata['sm_api_error']; //detecting presence of error code

                if (!(error === 2)) {
                  _context.next = 48;
                  break;
                }

                headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                text = _articleextractor.ArticleExtractor.extractGuardianText(data);

                if (!(text !== undefined)) {
                  _context.next = 47;
                  break;
                }

                if (text.split(' - ')[1]) {
                  text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
                _context.next = 48;
                break;

              case 47:
                return _context.abrupt("return", undefined);

              case 48:
                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context.next = 50;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 50:
                if (!(_preferences.language_choice !== "English")) {
                  _context.next = 55;
                  break;
                }

                _context.next = 53;
                return callTranslation(publisher, topic, headline, text);

              case 53:
                translations = _context.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 55:
                return _context.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 56:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function extractGuardian(_x, _x2, _x3) {
        return _extractGuardian.apply(this, arguments);
      }

      return extractGuardian;
    }()
    /**
     * Queries a topic page on the BBC website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractBBC",
    value: function () {
      var _extractBBC = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(topic, topiclink, sentences) {
        var publisher, linkdata, linksarr, i, currentlink, articlelinks, _i2, current, links, randomlink, data, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 2:
                publisher = "BBC";
                _context2.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                linkdata = _context2.sent;
                linkdata = linkdata.split('<div role="region"')[0]; //Removes articles that are "featured" or unrelated to subject

                linkdata = linkdata.split('href="/news/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i2 = 0; _i2 < linksarr.length; _i2 += 1) {
                  current = linksarr[_i2];

                  if (!current.includes('/') && current.includes('-') && !isNaN(current[current.length - 1])) {
                    articlelinks.push(_preferences.sources[publisher] + 'news/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context2.next = 15;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 15:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context2.next = 18;
                return PageParser.extractPageData(randomlink);

              case 18:
                data = _context2.sent;
                _context2.next = 21;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 21:
                smmrydata = _context2.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' - BBC News')[0];
                    text = _articleextractor.ArticleExtractor.extractBBCText(data);

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }

                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' - BBC News')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractBBCText(data);

                      if (text !== undefined) {
                        if (text.split(' - ')[1]) {
                          text = text.split(' - ')[1];
                        }

                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context2.next = 25;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 25:
                if (!(_preferences.language_choice !== "English")) {
                  _context2.next = 30;
                  break;
                }

                _context2.next = 28;
                return callTranslation(publisher, topic, headline, text);

              case 28:
                translations = _context2.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 30:
                return _context2.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 31:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function extractBBC(_x4, _x5, _x6) {
        return _extractBBC.apply(this, arguments);
      }

      return extractBBC;
    }()
    /**
     * Queries a topic page on the Reuters website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractReuters",
    value: function () {
      var _extractReuters = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i3, _currentlink, articlelinks, _i4, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 2:
                publisher = "Reuters";
                _context3.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context3.sent;
                linkdata = permadata.split('<a href="' + _preferences.sources[publisher] + 'article/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                }

                if (!linksarr.length) {
                  linkdata = permadata.split('<a href="/article/');

                  for (_i3 = 1; _i3 < linkdata.length; _i3 += 1) {
                    _currentlink = linkdata[_i3].split('"')[0];
                    linksarr.push(_currentlink);
                  }
                } //Parsing links we've found


                articlelinks = [];

                for (_i4 = 0; _i4 < linksarr.length; _i4 += 1) {
                  current = linksarr[_i4];

                  if (current.includes('/') && current.includes('-')) {
                    articlelinks.push('https://uk.reuters.com/article/' + current); //Removes the issue (seemingly) where some articles are geographically unavailable. Hard-code is annoying but works right now.

                    articlelinks.push('https://www.reuters.com/article/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context3.next = 15;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 15:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context3.next = 18;
                return PageParser.extractPageData(randomlink);

              case 18:
                data = _context3.sent;
                //fetch data from article page
                timeout = 0;

              case 20:
                if (!(data === undefined && timeout < 3)) {
                  _context3.next = 30;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context3.next = 24;
                return PageParser.extractPageData(randomlink);

              case 24:
                data = _context3.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context3.next = 28;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 28:
                _context3.next = 20;
                break;

              case 30:
                _context3.next = 32;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 32:
                smmrydata = _context3.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' - Reuters')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractReutersText(data);

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }

                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' - Reuters')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractReutersText(data);

                      if (text !== undefined) {
                        if (text.split(' - ')[1]) {
                          text = text.split(' - ')[1];
                        }

                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context3.next = 36;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 36:
                if (!(_preferences.language_choice !== "English")) {
                  _context3.next = 41;
                  break;
                }

                _context3.next = 39;
                return callTranslation(publisher, topic, headline, text);

              case 39:
                translations = _context3.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 41:
                return _context3.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 42:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function extractReuters(_x7, _x8, _x9) {
        return _extractReuters.apply(this, arguments);
      }

      return extractReuters;
    }()
    /**
     * Queries a topic page on the Sky News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractSky",
    value: function () {
      var _extractSky = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i5, _currentlink2, articlelinks, _i6, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 2:
                publisher = "Sky News";
                _context4.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context4.sent;

                if (topic === "sport") {
                  linkdata = permadata.split('<a class="news-list__headline-link" href="https://www.skysports.com/');
                } else {
                  linkdata = permadata.split('<a href="' + _preferences.sources[publisher] + 'story/');
                }

                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                }

                if (!linksarr.length) {
                  if (topic === "sport") {
                    linkdata = permadata.split('<a class="news-list__headline-link" href="https://www.skysports.com/');
                  } else {
                    linkdata = permadata.split('<a href="/story/');
                  }

                  for (_i5 = 1; _i5 < linkdata.length; _i5 += 1) {
                    _currentlink2 = linkdata[_i5].split('"')[0];
                    linksarr.push(_currentlink2);
                  }
                } //Parsing links we've found


                articlelinks = [];

                for (_i6 = 0; _i6 < linksarr.length; _i6 += 1) {
                  current = linksarr[_i6];

                  if (current.includes('-')) {
                    if (topic === "sport") {
                      articlelinks.push('https://www.skysports.com/' + current);
                    } else {
                      articlelinks.push(_preferences.sources[publisher] + 'story/' + current);
                    }
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context4.next = 15;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 15:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context4.next = 18;
                return PageParser.extractPageData(randomlink);

              case 18:
                data = _context4.sent;
                //fetch data from article page
                timeout = 0;

              case 20:
                if (!(data === undefined && timeout < 3)) {
                  _context4.next = 30;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context4.next = 24;
                return PageParser.extractPageData(randomlink);

              case 24:
                data = _context4.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context4.next = 28;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 28:
                _context4.next = 20;
                break;

              case 30:
                _context4.next = 32;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 32:
                smmrydata = _context4.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractSkyText(data);

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }

                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractSkyText(data);

                      if (text !== undefined) {
                        if (text.split(' - ')[1]) {
                          text = text.split(' - ')[1];
                        }

                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context4.next = 36;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 36:
                if (!(headline.includes("LIVE") || headline.includes("Live"))) {
                  _context4.next = 38;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 38:
                if (!(_preferences.language_choice !== "English")) {
                  _context4.next = 43;
                  break;
                }

                _context4.next = 41;
                return callTranslation(publisher, topic, headline, text);

              case 41:
                translations = _context4.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 43:
                return _context4.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 44:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function extractSky(_x10, _x11, _x12) {
        return _extractSky.apply(this, arguments);
      }

      return extractSky;
    }()
    /**
     * Queries a topic page on the Associated Press website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractAP",
    value: function () {
      var _extractAP = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i7, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context5.next = 2;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 2:
                publisher = "Associated Press";
                _context5.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context5.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i7 = 0; _i7 < linksarr.length; _i7 += 1) {
                  current = linksarr[_i7]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (!current.includes('-') && !current.includes('/') && !current.includes('.') && current.length && current !== "termsofservice" && current !== "privacystatement") {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context5.next = 14;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 14:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context5.next = 17;
                return PageParser.extractPageData(randomlink);

              case 17:
                data = _context5.sent;
                //fetch data from article page
                timeout = 0;

              case 19:
                if (!(data === undefined && timeout < 3)) {
                  _context5.next = 29;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context5.next = 23;
                return PageParser.extractPageData(randomlink);

              case 23:
                data = _context5.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context5.next = 27;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 27:
                _context5.next = 19;
                break;

              case 29:
                _context5.next = 31;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 31:
                smmrydata = _context5.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = _articleextractor.ArticleExtractor.extractAPHeadline(data); //SMMRY can't find the headline in AP articles. So we extract it ourselves

                    text = _articleextractor.ArticleExtractor.extractAPText(data);

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }

                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = _articleextractor.ArticleExtractor.extractAPHeadline(data); //SMMRY can't find the headline in AP articles. So we extract it ourselves

                      text = _articleextractor.ArticleExtractor.extractAPText(data);

                      if (text !== undefined) {
                        if (text.split(' — ')[1]) {
                          text = text.split(' — ')[1];
                        }

                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context5.next = 35;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 35:
                if (!(_preferences.language_choice !== "English")) {
                  _context5.next = 40;
                  break;
                }

                _context5.next = 38;
                return callTranslation(publisher, topic, headline, text);

              case 38:
                translations = _context5.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 40:
                return _context5.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 41:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function extractAP(_x13, _x14, _x15) {
        return _extractAP.apply(this, arguments);
      }

      return extractAP;
    }()
    /**
     * Queries a topic page on the Evening Standard website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractEveningStandard",
    value: function () {
      var _extractEveningStandard = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i8, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context6.next = 2;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 2:
                publisher = "Evening Standard";
                _context6.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context6.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i8 = 0; _i8 < linksarr.length; _i8 += 1) {
                  current = linksarr[_i8]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && (current.includes('news/') || current.includes('sport/') || current.includes('tech/')) && current.endsWith(".html")) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context6.next = 14;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 14:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context6.next = 17;
                return PageParser.extractPageData(randomlink);

              case 17:
                data = _context6.sent;
                //fetch data from article page
                timeout = 0;

              case 19:
                if (!(data === undefined && timeout < 3)) {
                  _context6.next = 29;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context6.next = 23;
                return PageParser.extractPageData(randomlink);

              case 23:
                data = _context6.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context6.next = 27;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 27:
                _context6.next = 19;
                break;

              case 29:
                _context6.next = 31;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 31:
                smmrydata = _context6.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' | London Evening Standard')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractEveningStandardText(data);

                    if (text !== undefined) {
                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' | London Evening Standard')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractEveningStandardText(data);

                      if (text !== undefined) {
                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context6.next = 35;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 35:
                if (!(_preferences.language_choice !== "English")) {
                  _context6.next = 40;
                  break;
                }

                _context6.next = 38;
                return callTranslation(publisher, topic, headline, text);

              case 38:
                translations = _context6.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 40:
                return _context6.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 41:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function extractEveningStandard(_x16, _x17, _x18) {
        return _extractEveningStandard.apply(this, arguments);
      }

      return extractEveningStandard;
    }()
    /**
     * Queries a topic page on the Independent website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractIndependent",
    value: function () {
      var _extractIndependent = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee7(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i9, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context7.next = 2;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 2:
                publisher = "The Independent";
                _context7.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context7.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i9 = 0; _i9 < linksarr.length; _i9 += 1) {
                  current = linksarr[_i9]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.endsWith(".html") && !current.includes('service/') && !current.includes('independentpremium/') && !current.includes('long_reads/') && !current.includes('extras/') && !current.includes('food-and-drink/recipes/')) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context7.next = 14;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 14:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context7.next = 17;
                return PageParser.extractPageData(randomlink);

              case 17:
                data = _context7.sent;
                //fetch data from article page
                timeout = 0;

              case 19:
                if (!(data === undefined && timeout < 3)) {
                  _context7.next = 29;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context7.next = 23;
                return PageParser.extractPageData(randomlink);

              case 23:
                data = _context7.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context7.next = 27;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 27:
                _context7.next = 19;
                break;

              case 29:
                _context7.next = 31;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 31:
                smmrydata = _context7.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    if (data.split('<title>')[1].split(' | ')[0]) {
                      headline = data.split('<title>')[1].split(' | ')[0]; //get headline from article data
                    } else {
                      headline = data.split('<title>')[1].split('</title>')[0]; //got an article which had an inconsistent headline scheme once
                    }

                    text = _articleextractor.ArticleExtractor.extractIndependentText(data);

                    if (text !== undefined) {
                      text = "Not enough summary credits! " + text;
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' | ')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractIndependentText(data);

                      if (text !== undefined) {
                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context7.next = 35;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 35:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context7.next = 41;
                  break;
                }

                _context7.next = 39;
                return callTranslation(publisher, topic, headline, text);

              case 39:
                translations = _context7.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 41:
                return _context7.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 42:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function extractIndependent(_x19, _x20, _x21) {
        return _extractIndependent.apply(this, arguments);
      }

      return extractIndependent;
    }()
    /**
     * Queries a topic page on the News.com.au website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractNewsAU",
    value: function () {
      var _extractNewsAU = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee8(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i10, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context8.next = 2;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 2:
                publisher = "News.com.au";
                _context8.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context8.sent;
                linkdata = permadata.split('href="https://www.news.com.au/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i10 = 0; _i10 < linksarr.length; _i10 += 1) {
                  current = linksarr[_i10]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.includes("/news-story/") && !current.includes('/game-reviews/')) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context8.next = 14;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 14:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context8.next = 17;
                return PageParser.extractPageData(randomlink);

              case 17:
                data = _context8.sent;
                //fetch data from article page
                timeout = 0;

              case 19:
                if (!(data === undefined && timeout < 3)) {
                  _context8.next = 29;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context8.next = 23;
                return PageParser.extractPageData(randomlink);

              case 23:
                data = _context8.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context8.next = 27;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 27:
                _context8.next = 19;
                break;

              case 29:
                _context8.next = 31;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 31:
                smmrydata = _context8.sent;

                if (!(smmrydata === undefined)) {
                  _context8.next = 47;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context8.next = 42;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split('</title>')[0]) {
                  _context8.next = 39;
                  break;
                }

                headline = headline.split('</title>')[0]; //get headline from article data

                _context8.next = 40;
                break;

              case 39:
                return _context8.abrupt("return", undefined);

              case 40:
                _context8.next = 43;
                break;

              case 42:
                return _context8.abrupt("return", undefined);

              case 43:
                text = _articleextractor.ArticleExtractor.extractNewsAUText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

                _context8.next = 63;
                break;

              case 47:
                headline = smmrydata['sm_api_title']; //article headline returned

                text = smmrydata['sm_api_content']; //summarised article returned

                error = smmrydata['sm_api_error']; //detecting presence of error code

                if (!(error === 2)) {
                  _context8.next = 63;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context8.next = 60;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split('</title>')[0]) {
                  _context8.next = 57;
                  break;
                }

                headline = headline.split('</title>')[0]; //get headline from article data

                _context8.next = 58;
                break;

              case 57:
                return _context8.abrupt("return", undefined);

              case 58:
                _context8.next = 61;
                break;

              case 60:
                return _context8.abrupt("return", undefined);

              case 61:
                text = _articleextractor.ArticleExtractor.extractNewsAUText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

              case 63:
                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context8.next = 65;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 65:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context8.next = 71;
                  break;
                }

                _context8.next = 69;
                return callTranslation(publisher, topic, headline, text);

              case 69:
                translations = _context8.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 71:
                return _context8.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 72:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function extractNewsAU(_x22, _x23, _x24) {
        return _extractNewsAU.apply(this, arguments);
      }

      return extractNewsAU;
    }()
    /**
     * Queries a topic page on the ITV News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractITV",
    value: function () {
      var _extractITV = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee9(topic, topiclink, sentences) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i11, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                if (!(sentences <= 0)) {
                  _context9.next = 2;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 2:
                publisher = "ITV News";
                _context9.next = 5;
                return PageParser.extractPageData(topiclink);

              case 5:
                permadata = _context9.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i11 = 0; _i11 < linksarr.length; _i11 += 1) {
                  current = linksarr[_i11]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.includes("news/") && !current.includes("topic/") && !current.includes("meet-the-team/") && !current.includes("/uk-weather-forecast-") && !current.includes("/assets/") && /\d/.test(current)) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context9.next = 14;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 14:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context9.next = 17;
                return PageParser.extractPageData(randomlink);

              case 17:
                data = _context9.sent;
                //fetch data from article page
                timeout = 0;

              case 19:
                if (!(data === undefined && timeout < 3)) {
                  _context9.next = 29;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context9.next = 23;
                return PageParser.extractPageData(randomlink);

              case 23:
                data = _context9.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context9.next = 27;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 27:
                _context9.next = 19;
                break;

              case 29:
                _context9.next = 31;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 31:
                smmrydata = _context9.sent;

                if (!(smmrydata === undefined)) {
                  _context9.next = 56;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context9.next = 42;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split(' - ITV News')[0]) {
                  _context9.next = 39;
                  break;
                }

                headline = headline.split(' - ITV News')[0]; //get headline from article data

                _context9.next = 40;
                break;

              case 39:
                return _context9.abrupt("return", undefined);

              case 40:
                _context9.next = 52;
                break;

              case 42:
                if (!data.split('<h1 class="update__title update__title--large">')[1]) {
                  _context9.next = 51;
                  break;
                }

                headline = data.split('<h1 class="update__title update__title--large">')[1];

                if (!headline.split('</h1>')[0]) {
                  _context9.next = 48;
                  break;
                }

                headline = headline.split('</h1>')[0];
                _context9.next = 49;
                break;

              case 48:
                return _context9.abrupt("return", undefined);

              case 49:
                _context9.next = 52;
                break;

              case 51:
                return _context9.abrupt("return", undefined);

              case 52:
                text = _articleextractor.ArticleExtractor.extractITVText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

                _context9.next = 81;
                break;

              case 56:
                headline = smmrydata['sm_api_title']; //article headline returned

                text = smmrydata['sm_api_content']; //summarised article returned

                error = smmrydata['sm_api_error']; //detecting presence of error code

                if (!(error === 2)) {
                  _context9.next = 81;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context9.next = 69;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split(' - ITV News')[0]) {
                  _context9.next = 66;
                  break;
                }

                headline = headline.split(' - ITV News')[0]; //get headline from article data

                _context9.next = 67;
                break;

              case 66:
                return _context9.abrupt("return", undefined);

              case 67:
                _context9.next = 79;
                break;

              case 69:
                if (!data.split('<h1 class="update__title update__title--large">')[1]) {
                  _context9.next = 78;
                  break;
                }

                headline = data.split('<h1 class="update__title update__title--large">')[1];

                if (!headline.split('</h1>')[0]) {
                  _context9.next = 75;
                  break;
                }

                headline = headline.split('</h1>')[0];
                _context9.next = 76;
                break;

              case 75:
                return _context9.abrupt("return", undefined);

              case 76:
                _context9.next = 79;
                break;

              case 78:
                return _context9.abrupt("return", undefined);

              case 79:
                text = _articleextractor.ArticleExtractor.extractITVText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

              case 81:
                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context9.next = 83;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 83:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context9.next = 89;
                  break;
                }

                _context9.next = 87;
                return callTranslation(publisher, topic, headline, text);

              case 87:
                translations = _context9.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 89:
                return _context9.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 90:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function extractITV(_x25, _x26, _x27) {
        return _extractITV.apply(this, arguments);
      }

      return extractITV;
    }()
    /**
     * Extracts data from article page
     * @param theurl - the URL of the web article to access
     * @returns {*} - actually returns the page data
     */

  }, {
    key: "extractPageData",
    value: function extractPageData(theurl) {
      return $.ajax({
        url: theurl
      }).done(function (data) {}).fail(function (ajaxError) {}); //not convinced this actually returns or throws an error
    }
  }]);
  return PageParser;
}();

exports.PageParser = PageParser;

function callTranslation(_x28, _x29, _x30, _x31) {
  return _callTranslation.apply(this, arguments);
}

function _callTranslation() {
  _callTranslation = (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee10(publisher, topic, headline, text) {
    var publishertranslatedata, topictranslatedata, headlinetranslatedata, texttranslatedata;
    return _regenerator["default"].wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return _translator.Translator.translate(publisher, _language_config.languages[_preferences.language_choice]);

          case 2:
            publishertranslatedata = _context10.sent;
            _context10.next = 5;
            return _translator.Translator.translate(topic, _language_config.languages[_preferences.language_choice]);

          case 5:
            topictranslatedata = _context10.sent;
            _context10.next = 8;
            return _translator.Translator.translate(headline, _language_config.languages[_preferences.language_choice]);

          case 8:
            headlinetranslatedata = _context10.sent;
            _context10.next = 11;
            return _translator.Translator.translate(text, _language_config.languages[_preferences.language_choice]);

          case 11:
            texttranslatedata = _context10.sent;

            if (!(publishertranslatedata === undefined || topictranslatedata === undefined || headlinetranslatedata === undefined || texttranslatedata === undefined)) {
              _context10.next = 16;
              break;
            }

            return _context10.abrupt("return", undefined);

          case 16:
            if (!(publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200 || headlinetranslatedata['code'] !== 200 || texttranslatedata['code'] !== 200)) {
              _context10.next = 20;
              break;
            }

            return _context10.abrupt("return", undefined);

          case 20:
            publisher = publishertranslatedata['text'];
            topic = topictranslatedata['text'];
            headline = headlinetranslatedata['text'];
            text = texttranslatedata['text'];
            return _context10.abrupt("return", [publisher, topic, headline, text]);

          case 25:
          case "end":
            return _context10.stop();
        }
      }
    }, _callee10);
  }));
  return _callTranslation.apply(this, arguments);
}