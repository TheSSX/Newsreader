"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PageParser = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _article = require("./article.mjs");

var _articleextractor = require("./articleextractor.mjs");

var _translator = require("./translator.mjs");

var _preferences = require("./preferences.js");

var _language_config = require("./language_config.js");

var _speech = require("./speech.mjs");

var _summarise = require("./summarise.mjs");

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
          throw TypeError;
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
        var publisher, linkdata, linksarr, i, links, randomlink, data, headline, text, smmrydata, error, translations;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                if (topic === "uk") {
                  topic = "uk-news";
                }

                publisher = "The Guardian";
                _context.next = 4;
                return PageParser.extractPageData(topiclink);

              case 4:
                linkdata = _context.sent;
                linkdata = linkdata.split('<a href="' + _preferences.sources[publisher] + '' + topic + '/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  linksarr.push(linkdata[i].split('"')[0]);
                }

                links = Array.from(new Set(linksarr)); //array of URLs for articles

                do {
                  randomlink = _preferences.sources[publisher] + topic + '/' + links[Math.floor(Math.random() * links.length)]; //select a random article
                } while (randomlink.startsWith(_preferences.sources[publisher] + topic + '/video/')); //articles devoted to a video are no good

                /**
                 * Extracting article from article page
                 */


                _context.next = 12;
                return PageParser.extractPageData(randomlink);

              case 12:
                data = _context.sent;
                _context.next = 15;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 15:
                smmrydata = _context.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split('|')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractGuardianText(data);

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
                      headline = data.split('<title>')[1].split('|')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractGuardianText(data);

                      if (text !== undefined) {
                        if (text.split(' - ')[1]) {
                          text = text.split(' - ')[1];
                        }

                        text = "Not enough summary credits! " + text;
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context.next = 19;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 19:
                if (!(_preferences.language_choice !== "English")) {
                  _context.next = 24;
                  break;
                }

                _context.next = 22;
                return callTranslation(publisher, topic, headline, text);

              case 22:
                translations = _context.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 24:
                return _context.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 25:
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
        var publisher, linkdata, linksarr, i, currentlink, articlelinks, _i, current, links, randomlink, data, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "BBC";
                _context2.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                linkdata = _context2.sent;
                linkdata = linkdata.split('<div role="region"')[0]; //Removes articles that are "featured" or unrelated to subject

                linkdata = linkdata.split('href="/news/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i = 0; _i < linksarr.length; _i += 1) {
                  current = linksarr[_i];

                  if (!current.includes('/') && current.includes('-') && !isNaN(current[current.length - 1])) {
                    articlelinks.push(_preferences.sources[publisher] + 'news/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context2.next = 14;
                return PageParser.extractPageData(randomlink);

              case 14:
                data = _context2.sent;
                _context2.next = 17;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 17:
                smmrydata = _context2.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split('- BBC News')[0]; //get headline from article data

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
                      headline = data.split('<title>')[1].split('- BBC News')[0]; //get headline from article data

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
                  _context2.next = 21;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 21:
                if (!(_preferences.language_choice !== "English")) {
                  _context2.next = 26;
                  break;
                }

                _context2.next = 24;
                return callTranslation(publisher, topic, headline, text);

              case 24:
                translations = _context2.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 26:
                return _context2.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 27:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i2, _currentlink, articlelinks, _i3, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "Reuters";
                _context3.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context3.sent;
                linkdata = permadata.split('<a href="' + _preferences.sources[publisher] + 'article/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                }

                if (!linksarr.length) {
                  linkdata = permadata.split('<a href="/article/');

                  for (_i2 = 1; _i2 < linkdata.length; _i2 += 1) {
                    _currentlink = linkdata[_i2].split('"')[0];
                    linksarr.push(_currentlink);
                  }
                } //Parsing links we've found


                articlelinks = [];

                for (_i3 = 0; _i3 < linksarr.length; _i3 += 1) {
                  current = linksarr[_i3];

                  if (current.includes('/') && current.includes('-')) {
                    articlelinks.push('https://uk.reuters.com/article/' + current); //Removes the issue (seemingly) where some articles are geographically unavailable. Hard-code is annoying but works right now.

                    articlelinks.push('https://www.reuters.com/article/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context3.next = 14;
                return PageParser.extractPageData(randomlink);

              case 14:
                data = _context3.sent;
                //fetch data from article page
                timeout = 0;

              case 16:
                if (!(data === undefined && timeout < 3)) {
                  _context3.next = 26;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context3.next = 20;
                return PageParser.extractPageData(randomlink);

              case 20:
                data = _context3.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context3.next = 24;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 24:
                _context3.next = 16;
                break;

              case 26:
                _context3.next = 28;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 28:
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
                  _context3.next = 32;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 32:
                if (!(_preferences.language_choice !== "English")) {
                  _context3.next = 37;
                  break;
                }

                _context3.next = 35;
                return callTranslation(publisher, topic, headline, text);

              case 35:
                translations = _context3.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 37:
                return _context3.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 38:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i4, _currentlink2, articlelinks, _i5, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "Sky News";
                _context4.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
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

                  for (_i4 = 1; _i4 < linkdata.length; _i4 += 1) {
                    _currentlink2 = linkdata[_i4].split('"')[0];
                    linksarr.push(_currentlink2);
                  }
                } //Parsing links we've found


                articlelinks = [];

                for (_i5 = 0; _i5 < linksarr.length; _i5 += 1) {
                  current = linksarr[_i5];

                  if (current.includes('-')) {
                    if (topic === "sport") {
                      articlelinks.push('https://www.skysports.com/' + current);
                    } else {
                      articlelinks.push('https://news.sky.com/story/' + current);
                    }
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context4.next = 14;
                return PageParser.extractPageData(randomlink);

              case 14:
                data = _context4.sent;
                //fetch data from article page
                timeout = 0;

              case 16:
                if (!(data === undefined && timeout < 3)) {
                  _context4.next = 26;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context4.next = 20;
                return PageParser.extractPageData(randomlink);

              case 20:
                data = _context4.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context4.next = 24;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 24:
                _context4.next = 16;
                break;

              case 26:
                _context4.next = 28;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 28:
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
                  _context4.next = 32;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 32:
                if (!(headline.includes("LIVE") || headline.includes("Live"))) {
                  _context4.next = 34;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 34:
                if (!(_preferences.language_choice !== "English")) {
                  _context4.next = 39;
                  break;
                }

                _context4.next = 37;
                return callTranslation(publisher, topic, headline, text);

              case 37:
                translations = _context4.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 39:
                return _context4.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 40:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i6, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "Associated Press";
                _context5.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context5.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i6 = 0; _i6 < linksarr.length; _i6 += 1) {
                  current = linksarr[_i6]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (!current.includes('-') && !current.includes('/') && !current.includes('.') && current.length && current !== "termsofservice" && current !== "privacystatement") {
                    articlelinks.push('https://apnews.com/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context5.next = 13;
                return PageParser.extractPageData(randomlink);

              case 13:
                data = _context5.sent;
                //fetch data from article page
                timeout = 0;

              case 15:
                if (!(data === undefined && timeout < 3)) {
                  _context5.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context5.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context5.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context5.next = 23;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 23:
                _context5.next = 15;
                break;

              case 25:
                _context5.next = 27;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 27:
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
                    headline = _articleextractor.ArticleExtractor.extractAPHeadline(data); //SMMRY can't find the headline in AP articles. So we extract it ourselves

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
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
                  _context5.next = 31;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 31:
                if (!(_preferences.language_choice !== "English")) {
                  _context5.next = 36;
                  break;
                }

                _context5.next = 34;
                return callTranslation(publisher, topic, headline, text);

              case 34:
                translations = _context5.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 36:
                return _context5.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 37:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i7, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "Evening Standard";
                _context6.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context6.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i7 = 0; _i7 < linksarr.length; _i7 += 1) {
                  current = linksarr[_i7]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && (current.includes('news/') || current.includes('sport/') || current.includes('tech/')) && current.endsWith(".html")) {
                    articlelinks.push('https://www.standard.co.uk/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context6.next = 13;
                return PageParser.extractPageData(randomlink);

              case 13:
                data = _context6.sent;
                //fetch data from article page
                timeout = 0;

              case 15:
                if (!(data === undefined && timeout < 3)) {
                  _context6.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context6.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context6.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context6.next = 23;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 23:
                _context6.next = 15;
                break;

              case 25:
                _context6.next = 27;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 27:
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
                  _context6.next = 31;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 31:
                if (!(_preferences.language_choice !== "English")) {
                  _context6.next = 36;
                  break;
                }

                _context6.next = 34;
                return callTranslation(publisher, topic, headline, text);

              case 34:
                translations = _context6.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 36:
                return _context6.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 37:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i8, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "The Independent";
                _context7.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context7.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i8 = 0; _i8 < linksarr.length; _i8 += 1) {
                  current = linksarr[_i8]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.endsWith(".html") && !current.includes('service/') && !current.includes('independentpremium/') && !current.includes('long_reads/') && !current.includes('extras/') && !current.includes('food-and-drink/recipes/')) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context7.next = 13;
                return PageParser.extractPageData(randomlink);

              case 13:
                data = _context7.sent;
                //fetch data from article page
                timeout = 0;

              case 15:
                if (!(data === undefined && timeout < 3)) {
                  _context7.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context7.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context7.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context7.next = 23;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 23:
                _context7.next = 15;
                break;

              case 25:
                _context7.next = 27;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 27:
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
                  _context7.next = 31;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 31:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context7.next = 37;
                  break;
                }

                _context7.next = 35;
                return callTranslation(publisher, topic, headline, text);

              case 35:
                translations = _context7.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 37:
                return _context7.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 38:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i9, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "News.com.au";
                _context8.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context8.sent;
                linkdata = permadata.split('href="https://www.news.com.au/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i9 = 0; _i9 < linksarr.length; _i9 += 1) {
                  current = linksarr[_i9]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.includes("/news-story/") && !current.includes('/game-reviews/')) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context8.next = 13;
                return PageParser.extractPageData(randomlink);

              case 13:
                data = _context8.sent;
                //fetch data from article page
                timeout = 0;

              case 15:
                if (!(data === undefined && timeout < 3)) {
                  _context8.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context8.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context8.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context8.next = 23;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 23:
                _context8.next = 15;
                break;

              case 25:
                _context8.next = 27;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 27:
                smmrydata = _context8.sent;

                if (!(smmrydata === undefined)) {
                  _context8.next = 43;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context8.next = 38;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split('</title>')[0]) {
                  _context8.next = 35;
                  break;
                }

                headline = headline.split('</title>')[0]; //get headline from article data

                _context8.next = 36;
                break;

              case 35:
                return _context8.abrupt("return", undefined);

              case 36:
                _context8.next = 39;
                break;

              case 38:
                return _context8.abrupt("return", undefined);

              case 39:
                text = _articleextractor.ArticleExtractor.extractNewsAUText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

                _context8.next = 59;
                break;

              case 43:
                headline = smmrydata['sm_api_title']; //article headline returned

                text = smmrydata['sm_api_content']; //summarised article returned

                error = smmrydata['sm_api_error']; //detecting presence of error code

                if (!(error === 2)) {
                  _context8.next = 59;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context8.next = 56;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split('</title>')[0]) {
                  _context8.next = 53;
                  break;
                }

                headline = headline.split('</title>')[0]; //get headline from article data

                _context8.next = 54;
                break;

              case 53:
                return _context8.abrupt("return", undefined);

              case 54:
                _context8.next = 57;
                break;

              case 56:
                return _context8.abrupt("return", undefined);

              case 57:
                text = _articleextractor.ArticleExtractor.extractNewsAUText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

              case 59:
                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context8.next = 61;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 61:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context8.next = 67;
                  break;
                }

                _context8.next = 65;
                return callTranslation(publisher, topic, headline, text);

              case 65:
                translations = _context8.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 67:
                return _context8.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 68:
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
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i10, current, links, randomlink, data, timeout, headline, text, smmrydata, error, translations;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "ITV News";
                _context9.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context9.sent;
                linkdata = permadata.split('href="/');
                linksarr = [];

                for (i = 1; i < linkdata.length; i += 1) {
                  currentlink = linkdata[i].split('"')[0];
                  linksarr.push(currentlink);
                } //Parsing links we've found


                articlelinks = [];

                for (_i10 = 0; _i10 < linksarr.length; _i10 += 1) {
                  current = linksarr[_i10]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.includes("news/") && !current.includes("topic/") && !current.includes("meet-the-team/") && !current.includes("/uk-weather-forecast-") && !current.includes("/assets/") && /\d/.test(current)) {
                    articlelinks.push(_preferences.sources[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context9.next = 13;
                return PageParser.extractPageData(randomlink);

              case 13:
                data = _context9.sent;
                //fetch data from article page
                timeout = 0;

              case 15:
                if (!(data === undefined && timeout < 3)) {
                  _context9.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context9.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context9.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context9.next = 23;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 23:
                _context9.next = 15;
                break;

              case 25:
                _context9.next = 27;
                return _summarise.Summarise.summarise(randomlink, sentences);

              case 27:
                smmrydata = _context9.sent;

                if (!(smmrydata === undefined)) {
                  _context9.next = 52;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context9.next = 38;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split(' - ITV News')[0]) {
                  _context9.next = 35;
                  break;
                }

                headline = headline.split(' - ITV News')[0]; //get headline from article data

                _context9.next = 36;
                break;

              case 35:
                return _context9.abrupt("return", undefined);

              case 36:
                _context9.next = 48;
                break;

              case 38:
                if (!data.split('<h1 class="update__title update__title--large">')[1]) {
                  _context9.next = 47;
                  break;
                }

                headline = data.split('<h1 class="update__title update__title--large">')[1];

                if (!headline.split('</h1>')[0]) {
                  _context9.next = 44;
                  break;
                }

                headline = headline.split('</h1>')[0];
                _context9.next = 45;
                break;

              case 44:
                return _context9.abrupt("return", undefined);

              case 45:
                _context9.next = 48;
                break;

              case 47:
                return _context9.abrupt("return", undefined);

              case 48:
                text = _articleextractor.ArticleExtractor.extractITVText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

                _context9.next = 77;
                break;

              case 52:
                headline = smmrydata['sm_api_title']; //article headline returned

                text = smmrydata['sm_api_content']; //summarised article returned

                error = smmrydata['sm_api_error']; //detecting presence of error code

                if (!(error === 2)) {
                  _context9.next = 77;
                  break;
                }

                if (!data.split('<title>')[1]) {
                  _context9.next = 65;
                  break;
                }

                headline = data.split('<title>')[1];

                if (!headline.split(' - ITV News')[0]) {
                  _context9.next = 62;
                  break;
                }

                headline = headline.split(' - ITV News')[0]; //get headline from article data

                _context9.next = 63;
                break;

              case 62:
                return _context9.abrupt("return", undefined);

              case 63:
                _context9.next = 75;
                break;

              case 65:
                if (!data.split('<h1 class="update__title update__title--large">')[1]) {
                  _context9.next = 74;
                  break;
                }

                headline = data.split('<h1 class="update__title update__title--large">')[1];

                if (!headline.split('</h1>')[0]) {
                  _context9.next = 71;
                  break;
                }

                headline = headline.split('</h1>')[0];
                _context9.next = 72;
                break;

              case 71:
                return _context9.abrupt("return", undefined);

              case 72:
                _context9.next = 75;
                break;

              case 74:
                return _context9.abrupt("return", undefined);

              case 75:
                text = _articleextractor.ArticleExtractor.extractITVText(data);

                if (text !== undefined) {
                  text = "Not enough summary credits! " + text;
                }

              case 77:
                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context9.next = 79;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 79:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                /**
                 * TRANSLATING
                 */

                if (!(_preferences.language_choice !== "English")) {
                  _context9.next = 85;
                  break;
                }

                _context9.next = 83;
                return callTranslation(publisher, topic, headline, text);

              case 83:
                translations = _context9.sent;

                if (translations !== undefined) {
                  publisher = translations[0];
                  topic = translations[1];
                  headline = translations[2];
                  text = translations[3];
                } else {
                  new _speech.Speech(_language_config.translation_unavailable[_preferences.language_choice]).speak();
                }

              case 85:
                return _context9.abrupt("return", new _article.Article(publisher, topic, headline, randomlink, text));

              case 86:
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