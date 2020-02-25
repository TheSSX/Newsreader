"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/pageparser.js");

var _article = require("../dist/article.js");

var _preferences = require("../dist/preferences.js");

var _bulletin = require("../dist/bulletin.js");

var fake_PageParser, fake_Article;
(0, _mocha.suite)('Bulletin', function () {
  (0, _mocha.beforeEach)(function () {
    // fake_Article = stub(new Article("test", "test", "test", "test", "test"), "read").callsFake(function () {
    //    return true;
    // });
    fake_Article = new _article.Article("test", "test", "test", "test", "test");
    fake_Article.read = (0, _sinon.stub)(_article.Article, "read").callsFake(function () {
      return true;
    });
    fake_PageParser = (0, _sinon.stub)(_pageparser.PageParser, "getArticle").resolves(fake_Article);
  });
  (0, _mocha.afterEach)(function () {
    fake_Article.restore();
    fake_PageParser.restore();
  });
  (0, _mocha.describe)('fetchNews', function () {
    (0, _mocha.it)('Should select an article from each topic and read it aloud', function () {
      _bulletin.Bulletin.retryTopic = (0, _sinon.stub)().returns(true);

      _bulletin.Bulletin.fetchNews();

      (0, _chai.expect)(fake_Article.read).calledOnce();
    });
  });
});