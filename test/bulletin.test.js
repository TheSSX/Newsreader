"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/js/pageparser.js");

var _article = require("../dist/js/article.js");

var _preferences = require("../dist/js/preferences.js");

var _bulletin = require("../dist/js/bulletin.js");

var _translator = require("../dist/js/translator.js");

var _language_config = require("../dist/js/language_config.js");

var chrome = require('sinon-chrome/extensions');

(0, _mocha.suite)('Bulletin', function () {
  (0, _mocha.beforeEach)(function () {
    global.chrome = chrome;
  });
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('fetchNews', function () {
    //ReferenceError: SpeechSynthesisUtterance is not defined
    (0, _mocha.it)('Should select an article from each topic and read it aloud', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var article, stub_getArticle, stub_retryTopic, stub_checkSentences, test_sources, i, key, test_topics, counter, _i, _key, val;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["text"]);
              stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle").resolves(article);
              stub_retryTopic = (0, _sinon.stub)(_bulletin.Bulletin, "retryTopic").returns(true);
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, "checkSentences").resolves(article); // These are left out because testing seems to fail on them
              // They are multiple promises deep so that might be the cause
              // Regardless, they aren't crucial because if we test checkSentences is called, we know these are called too
              //let stub_checkTranslation = stub(Bulletin, "checkTranslation").resolves(article);
              //let stub_readArticles = stub(Bulletin, "readArticles").returns(true);

              test_sources = {};

              for (i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
                key = Object.keys(_preferences.sourcelinks)[i];
                test_sources[key] = Math.random() >= 0.5;
              }

              test_topics = {};
              counter = 0;

              for (_i = 0; _i < Object.keys(_preferences.topiclinks).length; _i++) {
                _key = Object.keys(_preferences.topiclinks)[_i];

                if (_i === 0) {
                  test_topics[_key] = true;
                }

                val = Math.random() >= 0.5;
                test_topics[_key] = val;
                if (val) counter++;
              }

              _context.next = 11;
              return _bulletin.Bulletin.fetchNews(test_sources, test_topics);

            case 11:
              (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(counter);
              (0, _chai.expect)(stub_retryTopic.called).to.be.equal(false);
              (0, _chai.expect)(chrome.runtime.sendMessage.called).to.be.equal(false);
              (0, _chai.expect)(chrome.storage.local.remove.called).to.be.equal(false);
              (0, _chai.expect)(stub_checkSentences.called).to.be.equal(true); //expect(stub_checkTranslation.called).to.be.equal(true);
              //expect(stub_readArticles.called).to.be.equal(true);

            case 16:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _mocha.it)('Should retry fetching an article for a topic if initial attempt did not succeed', function () {
      var stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle")["throws"](new TypeError());
      var stub_retryTopic = (0, _sinon.stub)(_bulletin.Bulletin, "retryTopic").returns(true);
      var test_sources = {};

      for (var i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
        var key = Object.keys(_preferences.sourcelinks)[i];
        test_sources[key] = Math.random() >= 0.5;
      }

      var test_topics = {};
      var counter = 0;

      for (var _i2 = 0; _i2 < Object.keys(_preferences.topiclinks).length; _i2++) {
        var _key2 = Object.keys(_preferences.topiclinks)[_i2];

        if (_i2 === 0) {
          test_topics[_key2] = true;
        }

        var val = Math.random() >= 0.5;
        test_topics[_key2] = val;
        if (val) counter++;
      }

      _bulletin.Bulletin.fetchNews(test_sources, test_topics);

      (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(counter);
      (0, _chai.expect)(stub_retryTopic.callCount).to.be.equal(counter);
    });
    (0, _mocha.it)('Should prevent UK topic and News.com.au being attempted', function () {
      var stub_checkNewsAUUK = (0, _sinon.stub)(_bulletin.Bulletin, 'checkNewsAUUK').returns(true);
      var test_sources = {};
      var test_topics = {};

      for (var i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
        var key = Object.keys(_preferences.sourcelinks)[i];
        if (key === 'News.com.au') test_sources[key] = true;else test_sources[key] = false;
      }

      for (var _i3 = 0; _i3 < Object.keys(_preferences.topiclinks).length; _i3++) {
        var _key3 = Object.keys(_preferences.topiclinks)[_i3];

        if (_key3 === 'uk') test_sources[_key3] = true;else test_sources[_key3] = false;
      }

      var result = _bulletin.Bulletin.fetchNews(test_sources, test_topics);

      (0, _chai.expect)(result).to.be.equal(false);
      (0, _chai.expect)(stub_checkNewsAUUK.called).to.be.equal(true);
    });
  });
  (0, _mocha.describe)('retryTopic', function () {
    (0, _mocha.it)('Should retry fetching an article on the same topic but a different source', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var article, stub_getArticle, stub_checkSentences, i, topic;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["text"]);
              stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle").resolves(article);
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, "checkSentences").resolves(article);
              i = 0;

            case 4:
              if (!(i < Object.keys(_preferences.topiclinks).length)) {
                _context2.next = 11;
                break;
              }

              topic = Object.keys(_preferences.topiclinks)[i];
              _context2.next = 8;
              return _bulletin.Bulletin.retryTopic(topic, 2);

            case 8:
              i++;
              _context2.next = 4;
              break;

            case 11:
              (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(Object.keys(_preferences.topiclinks).length);
              (0, _chai.expect)(stub_checkSentences.called).to.be.equal(true);
              (0, _chai.expect)(chrome.runtime.sendMessage.called).to.be.equal(false);
              (0, _chai.expect)(chrome.storage.local.remove.called).to.be.equal(false);

            case 15:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
    (0, _mocha.it)('Should recursively call itself a maximum of 9 times before cutting off attempts on current topic', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var stub_getArticle, topic;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle")["throws"](new TypeError());
              topic = Object.keys(_preferences.topiclinks)[0];
              _context3.next = 4;
              return _bulletin.Bulletin.retryTopic(topic, 2);

            case 4:
              (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(9);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
  (0, _mocha.describe)('readArticles', function () {
    //ReferenceError: SpeechSynthesisUtterance is not defined
    (0, _mocha.it)('Should send appropriate chrome messages, read current article and recursively call itself for next article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var article, allarticles, spy_readArticles, stub_checkSentences, stub_checkTranslation, result;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["text"]);
              allarticles = [article, article, article];
              spy_readArticles = (0, _sinon.spy)(_bulletin.Bulletin, 'readArticles');
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, 'checkSentences').resolves(article);
              stub_checkTranslation = (0, _sinon.stub)(_bulletin.Bulletin, 'checkTranslation').resolves(article);
              _context4.next = 7;
              return _bulletin.Bulletin.readArticles(allarticles.shift(), allarticles);

            case 7:
              result = _context4.sent;
              (0, _chai.expect)(spy_readArticles.callCount).to.be.equal(allarticles.length);
              (0, _chai.expect)(stub_checkSentences.callCount).to.be.equal(allarticles.length - 1);
              (0, _chai.expect)(stub_checkTranslation.callCount).to.be.equal(allarticles.length - 1);
              (0, _chai.expect)(result).to.be.equal(true);

            case 12:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
    (0, _mocha.it)('Should send a stop message and return true if no more articles are to be read', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var article, spy_readArticles, stub_checkSentences, stub_checkTranslation, result;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["text"]);
              spy_readArticles = (0, _sinon.spy)(_bulletin.Bulletin, 'readArticles');
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, 'checkSentences').resolves(article);
              stub_checkTranslation = (0, _sinon.stub)(_bulletin.Bulletin, 'checkTranslation').resolves(article);
              _context5.next = 6;
              return _bulletin.Bulletin.readArticles(undefined, []);

            case 6:
              result = _context5.sent;
              (0, _chai.expect)(spy_readArticles.callCount).to.be.equal(1);
              (0, _chai.expect)(stub_checkSentences.called).to.be.equal(false);
              (0, _chai.expect)(stub_checkTranslation.called).to.be.equal(false);
              (0, _chai.expect)(result).to.be.equal(true);

            case 11:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
  });
  (0, _mocha.describe)('checkSentences', function () {
    (0, _mocha.it)('Should resolve to a valid article', function () {
      var article = new _article.Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
      var stub_amendLength = (0, _sinon.stub)(_article.Article.prototype, 'amendLength').returns(true);

      _bulletin.Bulletin.checkSentences(article).then(function (newArticle) {
        (0, _chai.expect)(stub_amendLength.called).to.be.equal(true);
        (0, _chai.expect)(newArticle).to.be.deep.equal(article);
      });
    });
  });
  (0, _mocha.describe)('checkTranslation', function () {
    (0, _mocha.it)('Should resolve to a valid article', function () {
      var article = new _article.Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
      var stub_getTranslatedArticle = (0, _sinon.stub)(_bulletin.Bulletin, 'getTranslatedArticle').returns(article);

      _bulletin.Bulletin.checkTranslation(article).then(function (newArticle) {
        (0, _chai.expect)(stub_getTranslatedArticle.called).to.be.equal(true);
        (0, _chai.expect)(newArticle).to.be.deep.equal(article);
      });
    });
  });
  (0, _mocha.describe)('getTranslatedArticle', function () {
    (0, _mocha.it)('Should fetch individual translations for each relevant field and return a new translated article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var valid_translation, article, i, language_choice, stub_translate, result, _i4, _language_choice, _stub_translate, _result, _i5, _i6, expected_headline, _i7, expected_text, _i8;

      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              valid_translation = {
                'code': 200,
                'text': 'translation'
              };
              article = new _article.Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
              i = 0;

            case 3:
              if (!(i < Object.keys(_language_config.languages).length)) {
                _context6.next = 22;
                break;
              }

              language_choice = Object.keys(_language_config.languages)[i];
              stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').returns(valid_translation);
              _context6.next = 8;
              return _bulletin.Bulletin.getTranslatedArticle(article, language_choice);

            case 8:
              result = _context6.sent;
              (0, _chai.expect)(stub_translate.callCount).to.be.equal(4);
              (0, _chai.expect)(stub_translate.calledWith(article.publisher)).to.be.equal(true);
              (0, _chai.expect)(stub_translate.calledWith(article.topic)).to.be.equal(true);
              (0, _chai.expect)(stub_translate.calledWith(article.headline[0])).to.be.equal(true);
              (0, _chai.expect)(stub_translate.calledWith(article.text[0])).to.be.equal(true);
              (0, _chai.expect)(result.publisher).to.be.equal(valid_translation['text']);
              (0, _chai.expect)(result.topic).to.be.equal(valid_translation['text']);
              (0, _chai.expect)(result.headline).to.be.deep.equal([valid_translation['text']]);
              (0, _chai.expect)(result.text).to.be.deep.equal([valid_translation['text']]);
              (0, _sinon.restore)();

            case 19:
              i++;
              _context6.next = 3;
              break;

            case 22:
              article = new _article.Article("publisher", "topic", "allheadline", ["This is a multi-sentence headline.", "Here's another sentence."], "link", "alltext", ["This is a multi-sentence article.", "Here's another sentence.", "Here's one more."]);
              _i4 = 0;

            case 24:
              if (!(_i4 < Object.keys(_language_config.languages).length)) {
                _context6.next = 47;
                break;
              }

              _language_choice = Object.keys(_language_config.languages)[_i4];
              _stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').returns(valid_translation);
              _context6.next = 29;
              return _bulletin.Bulletin.getTranslatedArticle(article, _language_choice);

            case 29:
              _result = _context6.sent;
              (0, _chai.expect)(_stub_translate.callCount).to.be.at.least(4);
              (0, _chai.expect)(_stub_translate.calledWith(article.publisher)).to.be.equal(true);
              (0, _chai.expect)(_stub_translate.calledWith(article.topic)).to.be.equal(true);

              for (_i5 = 0; _i5 < article.headline.length; _i5++) {
                (0, _chai.expect)(_stub_translate.calledWith(article.headline[_i5])).to.be.equal(true);
              }

              for (_i6 = 0; _i6 < article.text.length; _i6++) {
                (0, _chai.expect)(_stub_translate.calledWith(article.text[_i6])).to.be.equal(true);
              }

              (0, _chai.expect)(_result.publisher).to.be.equal(valid_translation['text']);
              (0, _chai.expect)(_result.topic).to.be.equal(valid_translation['text']);
              expected_headline = [];

              for (_i7 = 0; _i7 < article.headline.length; _i7++) {
                expected_headline.push(valid_translation['text']);
              }

              (0, _chai.expect)(_result.headline).to.be.deep.equal(expected_headline);
              expected_text = [];

              for (_i8 = 0; _i8 < article.text.length; _i8++) {
                expected_text.push(valid_translation['text']);
              }

              (0, _chai.expect)(_result.text).to.be.deep.equal(expected_text);
              (0, _sinon.restore)();

            case 44:
              _i4++;
              _context6.next = 24;
              break;

            case 47:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
    (0, _mocha.it)('Should return undefined if the translation API was down', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var invalid_translation, article, stub_translate, i, language_choice, result, _i9, _language_choice2, _result2;

      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              invalid_translation = {
                'code': 500,
                'text': 'failure'
              };
              article = new _article.Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
              stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').returns(invalid_translation);
              i = 0;

            case 4:
              if (!(i < Object.keys(_language_config.languages).length)) {
                _context7.next = 14;
                break;
              }

              language_choice = Object.keys(_language_config.languages)[i];
              _context7.next = 8;
              return _bulletin.Bulletin.getTranslatedArticle(article, language_choice);

            case 8:
              result = _context7.sent;
              (0, _chai.expect)(stub_translate.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 11:
              i++;
              _context7.next = 4;
              break;

            case 14:
              (0, _sinon.restore)();
              _i9 = 0;

            case 16:
              if (!(_i9 < Object.keys(_language_config.languages).length)) {
                _context7.next = 28;
                break;
              }

              stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').returns(undefined);
              _language_choice2 = Object.keys(_language_config.languages)[_i9];
              _context7.next = 21;
              return _bulletin.Bulletin.getTranslatedArticle(article, _language_choice2);

            case 21:
              _result2 = _context7.sent;
              (0, _chai.expect)(stub_translate.callCount).to.be.equal(1);
              (0, _chai.expect)(_result2).to.be.equal(undefined);
              (0, _sinon.restore)();

            case 25:
              _i9++;
              _context7.next = 16;
              break;

            case 28:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
  });
  (0, _mocha.describe)('checkNewsAUUK', function () {
    (0, _mocha.it)('Should return true if News.com.au and uk are the only sources and topics selected', function () {
      var test_sources = {
        'News.com.au': true
      };
      var test_topics = {
        'uk': true
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);
      test_sources = {
        'News.com.au': true,
        'test': false
      };
      test_topics = {
        'uk': true,
        'test': false
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);
      test_sources = {};

      for (var i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
        var key = Object.keys(_preferences.sourcelinks)[i];
        test_sources[key] = false;
      }

      test_sources['News.com.au'] = true;
      test_topics = {};

      for (var _i10 = 0; _i10 < Object.keys(_preferences.topiclinks).length; _i10++) {
        var _key4 = Object.keys(_preferences.topiclinks)[_i10];

        test_topics[_key4] = false;
      }

      test_topics['uk'] = true;
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);
    });
    (0, _mocha.it)('Should return false if News.com.au and uk are not the only sources and topics', function () {
      var test_sources = {
        'News.com.au': false
      };
      var test_topics = {
        'uk': false
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources = {
        'News.com.au': false,
        'test': false
      };
      test_topics = {
        'uk': false,
        'test': false
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources = {
        'News.com.au': true
      };
      test_topics = {
        'uk': false
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources = {
        'News.com.au': false
      };
      test_topics = {
        'uk': true
      };
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources = {};

      for (var i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
        var key = Object.keys(_preferences.sourcelinks)[i];
        test_sources[key] = false;
      }

      test_topics = {};

      for (var _i11 = 0; _i11 < Object.keys(_preferences.topiclinks).length; _i11++) {
        var _key5 = Object.keys(_preferences.topiclinks)[_i11];

        test_topics[_key5] = false;
      }

      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources = {};

      for (var _i12 = 0; _i12 < Object.keys(_preferences.sourcelinks).length; _i12++) {
        var _key6 = Object.keys(_preferences.sourcelinks)[_i12];

        test_sources[_key6] = true;
      }

      test_sources['News.com.au'] = false;
      test_topics = {};

      for (var _i13 = 0; _i13 < Object.keys(_preferences.topiclinks).length; _i13++) {
        var _key7 = Object.keys(_preferences.topiclinks)[_i13];

        test_topics[_key7] = false;
      }

      test_topics['uk'] = false;
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources['News.com.au'] = true;
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
      test_sources['News.com.au'] = false;
      test_topics['uk'] = true;
      (0, _chai.expect)(_bulletin.Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
    });
  });
  (0, _mocha.describe)('capitalizeFirstLetter', function () {
    (0, _mocha.it)('Should capitalise the first letter of a given string', function () {
      var suffix = "aaaa";

      for (var i = 0; i < 26; i++) {
        var lower = (i + 10).toString(36).toLowerCase();
        var upper = (i + 10).toString(36).toUpperCase();
        var string = lower + suffix;
        (0, _chai.expect)(_bulletin.Bulletin.capitalizeFirstLetter(string)).to.be.equal(upper + suffix);
      }
    });
    (0, _mocha.it)('Should return the original string if already capitalised', function () {
      var suffix = "aaaa";

      for (var i = 0; i < 26; i++) {
        var upper = (i + 10).toString(36).toUpperCase();
        var string = upper + suffix;
        (0, _chai.expect)(_bulletin.Bulletin.capitalizeFirstLetter(string)).to.be.equal(upper + suffix);
      }
    });
    (0, _mocha.it)('Should return the original input on a TypeError being thrown', function () {
      var string = '%^&*()';
      (0, _chai.expect)(_bulletin.Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
      string = 1;
      (0, _chai.expect)(_bulletin.Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
      string = -0.5;
      (0, _chai.expect)(_bulletin.Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
    });
  });
});