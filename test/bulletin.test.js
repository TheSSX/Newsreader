"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/pageparser.js");

var _article = require("../dist/article.js");

var _preferences = require("../dist/preferences.js");

var _bulletin = require("../dist/bulletin.js");

var fake_getArticle, fake_Article, fake_read;
(0, _mocha.suite)('Bulletin', function () {
  // beforeEach(function () {
  //     // fake_Article = stub(new Article("test", "test", "test", "test", "test"), "read").callsFake(function () {
  //     //    return true;
  //     // });
  //     fake_Article = new Article("test", "test", "test", "test", "test");
  //     fake_read = stub(fake_Article, "read").callsFake(function () {
  //        return true;
  //     });
  //
  //     fake_getArticle = stub(PageParser, "getArticle").resolves(fake_Article);
  // });
  //
  // afterEach(function () {
  //     fake_read.restore();
  //     fake_getArticle.restore();
  //     fake_Article = undefined;
  // });
  (0, _mocha.describe)('fetchNews', function () {
    (0, _mocha.it)('Should select an article from each topic and read it aloud', function () {
      _bulletin.Bulletin.retryTopic = (0, _sinon.stub)().returns(true);
      _pageparser.PageParser.getArticle = (0, _sinon.stub)().resolves(new _article.Article("test", "test", "test", "test", "test"));

      _bulletin.Bulletin.fetchNews();

      (0, _chai.expect)(_pageparser.PageParser.getArticle.callCount).to.be.equal(9); // 9 topics

      (0, _chai.expect)(_bulletin.Bulletin.retryTopic.called).to.be.equal(false);
    });
  });
});