"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataParser = exports.valid_chars = exports.PageParser = exports.abbreviations = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _article = require("../../dist/js/article");

var _articleextractor = require("../../dist/js/articleextractor");

var _preferences = require("./preferences.js");

var _summarise = require("../../dist/js/summarise");

//Used by abbreviationConcatenation to replace awkward abbreviations with their full words. Helps with sentence splitting and TTS
var abbreviations = {
  'Gov.': 'Governor',
  'Mr.': 'Mister',
  'Mrs.': 'Mrs',
  'Ms.': 'Miss',
  'Snr.': 'Senior',
  'Jr.': 'Junior',
  'Dr.': 'Doctor',
  'approx.': 'approximately',
  'no.': 'number',
  'vs.': 'versus',
  'Rd.': 'Road',
  'St.': 'Saint',
  'VP.': 'Vice-President',
  'Co.': 'Company',
  'Ltd.': 'Limited',
  'Inc.': 'Incorporated',
  'Rep.': 'Republican',
  'Dem.': 'Democrat'
};
/**
 Class to fetch articles from different news sources
 */

exports.abbreviations = abbreviations;

var PageParser = /*#__PURE__*/function () {
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
     * @returns {Promise<*|Article>} - the article is contained in the promise value
     */
    value: function getArticle(source, topic, topiclink) {
      switch (source) {
        case "The Guardian":
          return PageParser.extractGuardian(topic, topiclink);

        case "BBC":
          return PageParser.extractBBC(topic, topiclink);

        case "Reuters":
          return PageParser.extractReuters(topic, topiclink);

        case "Sky News":
          return PageParser.extractSky(topic, topiclink);

        case "Associated Press":
          return PageParser.extractAP(topic, topiclink);

        case "Evening Standard":
          return PageParser.extractEveningStandard(topic, topiclink);

        case "The Independent":
          return PageParser.extractIndependent(topic, topiclink);

        case "ITV News":
          return PageParser.extractITV(topic, topiclink);

        case "News.com.au":
          return PageParser.extractNewsAU(topic, topiclink);

        default:
          throw new TypeError('Invalid source');
      }
    }
    /**
     * Queries a topic page on the Guardian website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractGuardian",
    value: function () {
      var _extractGuardian = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(topic, topiclink) {
        var publisher, linkdata, linksarr, i, currentlink, articlelinks, _i, current, links, randomlink, counter, data, headline, text, smmrydata, error;

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
                  _context.next = 13;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 13:
                counter = 0;

                do {
                  randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                  counter++;
                } while (randomlink.startsWith(_preferences.sourcelinks[publisher] + topic + '/video/') && counter < 3); //articles devoted to a video are no good


                if (!randomlink.startsWith(_preferences.sourcelinks[publisher] + topic + '/video/')) {
                  _context.next = 17;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 17:
                _context.next = 19;
                return PageParser.extractPageData(randomlink);

              case 19:
                data = _context.sent;
                _context.next = 22;
                return _summarise.Summarise.summarise(randomlink);

              case 22:
                smmrydata = _context.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractGuardianText(data);

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' |')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractGuardianText(data);

                      if (text !== undefined) {
                        if (text.split(' - ')[1]) {
                          text = text.split(' - ')[1];
                        }
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context.next = 26;
                  break;
                }

                return _context.abrupt("return", undefined);

              case 26:
                return _context.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 27:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function extractGuardian(_x, _x2) {
        return _extractGuardian.apply(this, arguments);
      }

      return extractGuardian;
    }()
    /**
     * Queries a topic page on the BBC website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractBBC",
    value: function () {
      var _extractBBC = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(topic, topiclink) {
        var publisher, linkdata, linksarr, i, currentlink, articlelinks, _i2, current, links, randomlink, data, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i2 = 0; _i2 < linksarr.length; _i2 += 1) {
                  current = linksarr[_i2];

                  if (!current.includes('/') && current.includes('-') && !isNaN(current[current.length - 1])) {
                    articlelinks.push(_preferences.sourcelinks[publisher] + 'news/' + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 13:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context2.next = 16;
                return PageParser.extractPageData(randomlink);

              case 16:
                data = _context2.sent;
                _context2.next = 19;
                return _summarise.Summarise.summarise(randomlink);

              case 19:
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
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context2.next = 23;
                  break;
                }

                return _context2.abrupt("return", undefined);

              case 23:
                return _context2.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function extractBBC(_x3, _x4) {
        return _extractBBC.apply(this, arguments);
      }

      return extractBBC;
    }()
    /**
     * Queries a topic page on the Reuters website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractReuters",
    value: function () {
      var _extractReuters = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i3, _currentlink, articlelinks, _i4, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

                /**
                 * GETTING RANDOM LINK FOR TOPIC
                 */
                publisher = "Reuters";
                _context3.next = 3;
                return PageParser.extractPageData(topiclink);

              case 3:
                permadata = _context3.sent;
                linkdata = permadata.split('<a href="' + _preferences.sourcelinks[publisher] + 'article/');
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
                  _context3.next = 13;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 13:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context3.next = 16;
                return PageParser.extractPageData(randomlink);

              case 16:
                data = _context3.sent;
                //fetch data from article page
                timeout = 0;

              case 18:
                if (!(data === undefined && timeout < 3)) {
                  _context3.next = 28;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context3.next = 22;
                return PageParser.extractPageData(randomlink);

              case 22:
                data = _context3.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context3.next = 26;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 26:
                _context3.next = 18;
                break;

              case 28:
                _context3.next = 30;
                return _summarise.Summarise.summarise(randomlink);

              case 30:
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
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' - Reuters')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractReutersText(data);
                    }

                    if (text !== undefined) {
                      if (text.split(' - ')[1]) {
                        text = text.split(' - ')[1];
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context3.next = 34;
                  break;
                }

                return _context3.abrupt("return", undefined);

              case 34:
                return _context3.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 35:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function extractReuters(_x5, _x6) {
        return _extractReuters.apply(this, arguments);
      }

      return extractReuters;
    }()
    /**
     * Queries a topic page on the Sky News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractSky",
    value: function () {
      var _extractSky = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, _i5, _currentlink2, articlelinks, _i6, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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
                  linkdata = permadata.split('<a href="' + _preferences.sourcelinks[publisher] + 'story/');
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
                      articlelinks.push(_preferences.sourcelinks[publisher] + 'story/' + current);
                    }
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context4.next = 13;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 13:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context4.next = 16;
                return PageParser.extractPageData(randomlink);

              case 16:
                data = _context4.sent;
                //fetch data from article page
                timeout = 0;

              case 18:
                if (!(data === undefined && timeout < 3)) {
                  _context4.next = 28;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context4.next = 22;
                return PageParser.extractPageData(randomlink);

              case 22:
                data = _context4.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context4.next = 26;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 26:
                _context4.next = 18;
                break;

              case 28:
                _context4.next = 30;
                return _summarise.Summarise.summarise(randomlink);

              case 30:
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
                      }
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?') || headline.includes("LIVE") || headline.includes("Live"))) {
                  _context4.next = 34;
                  break;
                }

                return _context4.abrupt("return", undefined);

              case 34:
                return _context4.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 35:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function extractSky(_x7, _x8) {
        return _extractSky.apply(this, arguments);
      }

      return extractSky;
    }()
    /**
     * Queries a topic page on the Associated Press website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractAP",
    value: function () {
      var _extractAP = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i7, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i7 = 0; _i7 < linksarr.length; _i7 += 1) {
                  current = linksarr[_i7]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (!current.includes('-') && !current.includes('/') && !current.includes('.') && current.length && current !== "termsofservice" && current !== "privacystatement") {
                    articlelinks.push(_preferences.sourcelinks[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context5.next = 12;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 12:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context5.next = 15;
                return PageParser.extractPageData(randomlink);

              case 15:
                data = _context5.sent;
                //fetch data from article page
                timeout = 0;

              case 17:
                if (!(data === undefined && timeout < 3)) {
                  _context5.next = 27;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context5.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context5.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3)) {
                  _context5.next = 25;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 25:
                _context5.next = 17;
                break;

              case 27:
                _context5.next = 29;
                return _summarise.Summarise.summarise(randomlink);

              case 29:
                smmrydata = _context5.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = _articleextractor.ArticleExtractor.extractAPHeadline(data); //SMMRY can't find the headline in AP articles. So we extract it ourselves

                    text = _articleextractor.ArticleExtractor.extractAPText(data);

                    if (text !== undefined) {
                      if (text.split(' — ')[1]) {
                        text = text.split(' — ')[1];
                      }
                    }
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = _articleextractor.ArticleExtractor.extractAPHeadline(data); //SMMRY can't find the headline in AP articles. So we extract it ourselves

                      text = _articleextractor.ArticleExtractor.extractAPText(data);
                    }

                    if (text !== undefined) {
                      if (text.split(' — ')[1]) {
                        text = text.split(' — ')[1];
                      }
                    }

                    if (!headline) {
                      headline = _articleextractor.ArticleExtractor.extractAPHeadline(data);
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context5.next = 33;
                  break;
                }

                return _context5.abrupt("return", undefined);

              case 33:
                return _context5.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 34:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function extractAP(_x9, _x10) {
        return _extractAP.apply(this, arguments);
      }

      return extractAP;
    }()
    /**
     * Queries a topic page on the Evening Standard website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractEveningStandard",
    value: function () {
      var _extractEveningStandard = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i8, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i8 = 0; _i8 < linksarr.length; _i8 += 1) {
                  current = linksarr[_i8]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && (current.includes('news/') || current.includes('sport/') || current.includes('tech/')) && current.endsWith(".html")) {
                    articlelinks.push(_preferences.sourcelinks[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context6.next = 12;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 12:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context6.next = 15;
                return PageParser.extractPageData(randomlink);

              case 15:
                data = _context6.sent;
                //fetch data from article page
                timeout = 0;

              case 17:
                if (!(data === undefined && timeout < 3)) {
                  _context6.next = 27;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context6.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context6.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context6.next = 25;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 25:
                _context6.next = 17;
                break;

              case 27:
                _context6.next = 29;
                return _summarise.Summarise.summarise(randomlink);

              case 29:
                smmrydata = _context6.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    headline = data.split('<title>')[1].split(' | London Evening Standard')[0]; //get headline from article data

                    text = _articleextractor.ArticleExtractor.extractEveningStandardText(data);
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' | London Evening Standard')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractEveningStandardText(data);
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context6.next = 33;
                  break;
                }

                return _context6.abrupt("return", undefined);

              case 33:
                return _context6.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 34:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function extractEveningStandard(_x11, _x12) {
        return _extractEveningStandard.apply(this, arguments);
      }

      return extractEveningStandard;
    }()
    /**
     * Queries a topic page on the Independent website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractIndependent",
    value: function () {
      var _extractIndependent = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i9, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i9 = 0; _i9 < linksarr.length; _i9 += 1) {
                  current = linksarr[_i9]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.endsWith(".html") && !current.includes('service/') && !current.includes('independentpremium/') && !current.includes('long_reads/') && !current.includes('extras/') && !current.includes('food-and-drink/recipes/')) {
                    articlelinks.push(_preferences.sourcelinks[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context7.next = 12;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 12:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context7.next = 15;
                return PageParser.extractPageData(randomlink);

              case 15:
                data = _context7.sent;
                //fetch data from article page
                timeout = 0;

              case 17:
                if (!(data === undefined && timeout < 3)) {
                  _context7.next = 27;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context7.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context7.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context7.next = 25;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 25:
                _context7.next = 17;
                break;

              case 27:
                _context7.next = 29;
                return _summarise.Summarise.summarise(randomlink);

              case 29:
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
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      headline = data.split('<title>')[1].split(' | ')[0]; //get headline from article data

                      text = _articleextractor.ArticleExtractor.extractIndependentText(data);
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context7.next = 33;
                  break;
                }

                return _context7.abrupt("return", undefined);

              case 33:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                return _context7.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 35:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7);
      }));

      function extractIndependent(_x13, _x14) {
        return _extractIndependent.apply(this, arguments);
      }

      return extractIndependent;
    }()
    /**
     * Queries a topic page on the News.com.au website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractNewsAU",
    value: function () {
      var _extractNewsAU = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i10, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i10 = 0; _i10 < linksarr.length; _i10 += 1) {
                  current = linksarr[_i10]; //if (current.matches("/^[a-z0-9]+$/"))

                  if (current.includes('-') && current.includes("/news-story/") && !current.includes('/game-reviews/')) {
                    articlelinks.push(_preferences.sourcelinks[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context8.next = 12;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 12:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context8.next = 15;
                return PageParser.extractPageData(randomlink);

              case 15:
                data = _context8.sent;
                //fetch data from article page
                timeout = 0;

              case 17:
                if (!(data === undefined && timeout < 3)) {
                  _context8.next = 27;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context8.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context8.sent;
                //fetch data from article page
                timeout += 1;

                if (!(data === undefined && timeout === 3 || randomlink === undefined && timeout === 3)) {
                  _context8.next = 25;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 25:
                _context8.next = 17;
                break;

              case 27:
                _context8.next = 29;
                return _summarise.Summarise.summarise(randomlink);

              case 29:
                smmrydata = _context8.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    if (data.split('<title>')[1]) {
                      headline = data.split('<title>')[1];

                      if (headline.split('</title>')[0]) {
                        headline = headline.split('</title>')[0]; //get headline from article data
                      }
                    }

                    text = _articleextractor.ArticleExtractor.extractNewsAUText(data);
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      if (data.split('<title>')[1]) {
                        headline = data.split('<title>')[1];

                        if (headline.split('</title>')[0]) {
                          headline = headline.split('</title>')[0]; //get headline from article data
                        }
                      }

                      text = _articleextractor.ArticleExtractor.extractNewsAUText(data);
                    }
                  }

                if (!(headline === undefined || text === undefined || ['?'].includes(headline))) {
                  _context8.next = 33;
                  break;
                }

                return _context8.abrupt("return", undefined);

              case 33:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                return _context8.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 35:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8);
      }));

      function extractNewsAU(_x15, _x16) {
        return _extractNewsAU.apply(this, arguments);
      }

      return extractNewsAU;
    }()
    /**
     * Queries a topic page on the ITV News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */

  }, {
    key: "extractITV",
    value: function () {
      var _extractITV = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(topic, topiclink) {
        var publisher, permadata, linkdata, linksarr, i, currentlink, articlelinks, _i11, current, links, randomlink, data, timeout, headline, text, smmrydata, error;

        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                //return new Article("works", topic, "hey", "link", "text", DataParser.textSplitter("text"));

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

                for (_i11 = 0; _i11 < linksarr.length; _i11 += 1) {
                  current = linksarr[_i11];

                  if (current.includes('-') && current.includes("news/") && !current.includes("topic/") && !current.includes("meet-the-team/") && !current.includes("/uk-weather-forecast-") && !current.includes("/assets/") && /\d/.test(current)) {
                    articlelinks.push(_preferences.sourcelinks[publisher] + current);
                  }
                }

                links = Array.from(new Set(articlelinks)); //array of URLs for articles

                if (!(links === undefined || links.length === 0)) {
                  _context9.next = 12;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 12:
                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                /**
                 * Extracting article from article page
                 */

                _context9.next = 15;
                return PageParser.extractPageData(randomlink);

              case 15:
                data = _context9.sent;
                //fetch data from article page
                timeout = 0;

              case 17:
                if (!(!data && timeout < 3)) {
                  _context9.next = 25;
                  break;
                }

                randomlink = links[Math.floor(Math.random() * links.length)]; //select a random article

                _context9.next = 21;
                return PageParser.extractPageData(randomlink);

              case 21:
                data = _context9.sent;
                //fetch data from article page
                timeout += 1;
                _context9.next = 17;
                break;

              case 25:
                if (!(!data && timeout === 3 || !randomlink && timeout === 3)) {
                  _context9.next = 27;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 27:
                _context9.next = 29;
                return _summarise.Summarise.summarise(randomlink);

              case 29:
                smmrydata = _context9.sent;

                //send article to SMMRY
                if (smmrydata === undefined) //SMMRY API unavailable
                  {
                    if (data.split('<title>')[1]) {
                      headline = data.split('<title>')[1];

                      if (headline.split(' - ITV News')[0]) {
                        headline = headline.split(' - ITV News')[0]; //get headline from article data
                      }
                    } else if (data.split('<h1 class="update__title update__title--large">')[1]) {
                      headline = data.split('<h1 class="update__title update__title--large">')[1];

                      if (headline.split('</h1>')[0]) {
                        headline = headline.split('</h1>')[0];
                      }
                    }

                    text = _articleextractor.ArticleExtractor.extractITVText(data);
                  } else //SMMRY API working fine
                  {
                    headline = smmrydata['sm_api_title']; //article headline returned

                    text = smmrydata['sm_api_content']; //summarised article returned

                    error = smmrydata['sm_api_error']; //detecting presence of error code

                    if (error === 2) {
                      if (data.split('<title>')[1]) {
                        headline = data.split('<title>')[1];

                        if (headline.split(' - ITV News')[0]) {
                          headline = headline.split(' - ITV News')[0]; //get headline from article data
                        }
                      } else if (data.split('<h1 class="update__title update__title--large">')[1]) {
                        headline = data.split('<h1 class="update__title update__title--large">')[1];

                        if (headline.split('</h1>')[0]) {
                          headline = headline.split('</h1>')[0];
                        }
                      }

                      text = _articleextractor.ArticleExtractor.extractITVText(data);
                    }
                  }

                if (!(headline === undefined || text === undefined || headline.includes('?'))) {
                  _context9.next = 33;
                  break;
                }

                return _context9.abrupt("return", undefined);

              case 33:
                headline = _articleextractor.DataCleaner.cleanText(headline);
                return _context9.abrupt("return", new _article.Article(publisher, topic, headline, DataParser.textSplitter(headline), randomlink, text, DataParser.textSplitter(text)));

              case 35:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function extractITV(_x17, _x18) {
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
      });
    }
  }]);
  return PageParser;
}(); //Used by isCharacter to determine if an input character is valid


exports.PageParser = PageParser;
var valid_chars = [',', '.', '!', '?', '£', '$', '€', '"', "'", '%', '&', '(', ')', '#', '~', '/', '<', '>', '-', '_', '+', '='];
/**
 * Class for parsing data we receive via AJAX
 */

exports.valid_chars = valid_chars;

var DataParser = /*#__PURE__*/function () {
  function DataParser() {
    (0, _classCallCheck2["default"])(this, DataParser);
  }

  (0, _createClass2["default"])(DataParser, null, [{
    key: "textSplitter",

    /**
     * Designed to split a paragraph of text into sentences.
     * However, sentences longer than 150 characters are split into segments of ~150 characters and pushed
     * one after the other to an array. Once all sentences are split and pushed on, the array is returned
     *
     * PURPOSE
     * The reason for splitting sentences > 150 characters is to prevent the SpeechSynthesis module from
     * randomly cutting out. This only happens when being spoken in a non-English language/dialect and only
     * with utterances of 200-300 words. 150 characters is seen as a safety net for preventing this.
     *
     * EXAMPLE
     * text - "sentence. sentence >150 chars. sentence."
     * return - ['sentence.' 'partial sentence' 'partial sentence.' 'sentence.']
     *
     * @param text - the input paragraph
     * @returns {[]} - the array of sentences
     */
    value: function textSplitter(text) {
      if (!text) return undefined;
      var arr = [];
      text = DataParser.abbreviationConcatenation(text);
      text = text.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");

      if (!text) {
        var current = text;
        var segment = current;

        if (current.length > 150) //we experience difficulties at sentences of length >200. 150 is a safe number
          {
            while (current.length > 150) {
              segment = current.substr(0, 150);
              current = current.substr(150);

              while (DataParser.isCharacter(current.charAt(0)) || [',', '.'].includes(current.charAt(0)) && DataParser.isCharacter(current.charAt(1))) {
                segment += current.charAt(0);
                current = current.substr(1);
              }

              arr.push(segment);
            }

            arr.push(current);
          } else {
          arr.push(segment);
        }
      } else {
        for (var i = 0; i < text.length; i++) {
          var _current = text[i];
          var _segment = _current;

          if (_current.length > 150) {
            while (_current.length > 150) {
              _segment = _current.substr(0, 150);
              _current = _current.substr(150);

              while (DataParser.isCharacter(_current.charAt(0)) || [',', '.'].includes(_current.charAt(0)) && DataParser.isCharacter(_current.charAt(1))) {
                _segment += _current.charAt(0);
                _current = _current.substr(1);
              }

              arr.push(_segment);
            }

            arr.push(_current);
          } else {
            arr.push(_segment);
          }
        }
      }

      return arr;
    }
    /**
     * Checks if an input character is valid
     * @param str - the input character
     * @param caseChoice - optional, checks if an input character matches a particular case, i.e. lowercase or uppercase
     * @returns {boolean|boolean} - true if valid, false otherwise
     */

  }, {
    key: "isCharacter",
    value: function isCharacter(str) {
      var caseChoice = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'any';
      if (!str) return false;
      if (str.length !== 1 || !['any', 'lowercase', 'uppercase'].includes(caseChoice)) return false;
      if (str === ' ') return false;
      if (valid_chars.includes(str)) return true;

      try {
        var num = parseInt(str);
        if (!isNaN(num) && caseChoice === 'any') return true;
      } catch (TypeError) {}

      if (caseChoice === 'uppercase') return str >= 'A' && str <= 'Z';else if (caseChoice === 'lowercase') return str >= 'a' && str <= 'z';else return str >= 'A' && str <= 'Z' || str >= 'a' && str <= 'z';
    }
    /**
     * Used to remove the periods in abbreviations. This helps in preventing the sentence splitting from getting confused and also helps with TTS reading abbreviations out
     * @param str - the input text that may contain abbreviations
     * @returns {string} - text with formatted abbreviations
     */

  }, {
    key: "abbreviationConcatenation",
    value: function abbreviationConcatenation(str) {
      var newText = "";

      for (var i = 0; i < str.length - 1; i++) {
        var current = str.charAt(i);

        if (i >= 1) {
          var previous = str.charAt(i - 1);
          var next = str.charAt(i + 1);
          if (DataParser.isCharacter(previous, 'uppercase') && current === '.' && DataParser.isCharacter(next, 'uppercase')) i++;else if (i >= 3) {
            var previousprevious = str.charAt(i - 2);
            if (previousprevious === '.' && DataParser.isCharacter(previous, 'uppercase') && current === '.' && !DataParser.isCharacter(next)) i++;
          }
        }

        newText += str.charAt(i);
      }

      newText += str.charAt(str.length - 1);

      for (var _i12 = 0; _i12 < Object.keys(abbreviations).length; _i12++) {
        var abbr = Object.keys(abbreviations)[_i12];

        var replacement = abbreviations[abbr];
        newText = newText.replace(abbr, replacement);
      }

      return newText;
    }
  }]);
  return DataParser;
}();

exports.DataParser = DataParser;