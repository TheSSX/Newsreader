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

(0, _mocha.suite)('Bulletin', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('fetchNews', function () {
    //ReferenceError: SpeechSynthesisUtterance is not defined
    (0, _mocha.xit)('Should select an article from each topic and read it aloud', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var article, stub_getArticle, stub_retryTopic, stub_checkSentences, stub_checkTranslation, stub_readArticles, test_sources, i, key, test_topics, counter, _i, _key, val;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              article = new _article.Article("test", "test", ["test"], "test", "test", ["text"], "test");
              stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle").resolves(article);
              stub_retryTopic = (0, _sinon.stub)(_bulletin.Bulletin, "retryTopic").returns(true);
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, "checkSentences").resolves(article);
              stub_checkTranslation = (0, _sinon.stub)(_bulletin.Bulletin, "checkTranslation").resolves(article);
              stub_readArticles = (0, _sinon.stub)(_bulletin.Bulletin, "readArticles").returns(true);
              test_sources = {};

              for (i = 0; i < Object.keys(_preferences.sourcelinks).length; i++) {
                key = Object.keys(_preferences.sourcelinks)[i];
                test_sources[key] = Math.random() >= 0.5;
              }

              test_topics = {};
              counter = 0;

              for (_i = 0; _i < Object.keys(_preferences.topiclinks).length; _i++) {
                _key = Object.keys(_preferences.topiclinks)[_i];
                val = Math.random() >= 0.5;
                test_topics[_key] = val;
                if (val) counter++;
              }

              _context.next = 13;
              return _bulletin.Bulletin.fetchNews(test_sources, test_topics);

            case 13:
              (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(counter);
              (0, _chai.expect)(stub_retryTopic.called).to.be.equal(false);
              (0, _chai.expect)(stub_checkSentences.called).to.be.equal(true);
              (0, _chai.expect)(stub_checkTranslation.called).to.be.equal(true);
              (0, _chai.expect)(stub_readArticles.called).to.be.equal(true);
              (0, _sinon.restore)();
              stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle")["throws"](new TypeError());
              stub_retryTopic = (0, _sinon.stub)(_bulletin.Bulletin, "retryTopic").returns(true);
              stub_checkSentences = (0, _sinon.stub)(_bulletin.Bulletin, "checkSentences").resolves(article);
              stub_checkTranslation = (0, _sinon.stub)(_bulletin.Bulletin, "checkTranslation").resolves(article);
              stub_readArticles = (0, _sinon.stub)(_bulletin.Bulletin, "readArticles").returns(true);
              _context.next = 26;
              return _bulletin.Bulletin.fetchNews(test_sources, test_topics);

            case 26:
              (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(counter);
              (0, _chai.expect)(stub_retryTopic.callCount).to.be.equal(counter);
              (0, _chai.expect)(stub_checkSentences.called).to.be.equal(true);
              (0, _chai.expect)(stub_checkTranslation.called).to.be.equal(true);
              (0, _chai.expect)(stub_readArticles.called).to.be.equal(true);

            case 31:
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
});