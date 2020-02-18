"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _articleextractor = require("../dist/articleextractor.js");

var article = require('../test_articles/guardian.js');

(0, _mocha.suite)('ArticleExtractor', function () {
  (0, _mocha.describe)('extractGuardianText', function () {
    (0, _mocha.it)('Should return undefined on bad headlines', function () {
      var text = '<p><strong>Test</strong></p>';
      var text1 = '<h2>Test</h2>';
      var testarray = [text, text1];

      for (var i = 0; i < testarray.length; i += 1) {
        (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(testarray[i])).to.be.equal(undefined);
      }
    });
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = '<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body"><p>Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(data)).to.not.contain('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body">');
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      _articleextractor.DataCleaner.cleanText = (0, _sinon.stub)().returns("This works");

      var returned = _articleextractor.ArticleExtractor.extractGuardianText(article);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(0).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
});