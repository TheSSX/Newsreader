"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/js/pageparser.js");

var _article = require("../dist/js/article.js");

var _preferences = require("../dist/js/preferences.js");

var _bulletin = require("../dist/js/bulletin.js");

var _articleextractor = require("../dist/js/articleextractor.js");

(0, _mocha.suite)('Bulletin', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('fetchNews', function () {
    // TODO finish this off by trying to stub read of Article
    // Currently getting error TypeError: Cannot stub non-existent own property read
    // Articles online indicating a module called proxyquire might be needed
    (0, _mocha.it)('Should select an article from each topic and read it aloud', function () {
      var stub_retryTopic = (0, _sinon.stub)(_bulletin.Bulletin, "retryTopic").callsFake(function () {
        return true;
      });
      var stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle").resolves(new _article.Article("test", "test", "test", "test", "test"));

      _bulletin.Bulletin.fetchNews();

      (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(Object.keys(_preferences.topics).length);
      (0, _chai.expect)(stub_retryTopic.called).to.be.equal(false);
      stub_getArticle.restore();
      stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle")["throws"](new TypeError());

      _bulletin.Bulletin.fetchNews();

      (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(Object.keys(_preferences.topics).length);
      (0, _chai.expect)(stub_retryTopic.called).to.be.equal(true);
      var argument = stub_retryTopic.getCall(-1).args[1];
      (0, _chai.expect)(argument).to.be.equal(2);
    });
    (0, _mocha.it)('Should retry fetching an article for a topic if initial attempt did not succeed', function () {
      var stub_getArticle = (0, _sinon.stub)(_pageparser.PageParser, "getArticle")["throws"](new TypeError());
      var spy_retryTopic = (0, _sinon.spy)(_bulletin.Bulletin, "retryTopic");
      var spy_log = (0, _sinon.spy)(console, "log");

      _bulletin.Bulletin.retryTopic(Object.keys(_preferences.topics)[0], 2);

      (0, _chai.expect)(stub_getArticle.callCount).to.be.equal(9);
      (0, _chai.expect)(spy_retryTopic.callCount).to.be.equal(9);
      (0, _chai.expect)(spy_log.called).to.be.equal(true);
    });
  });
});