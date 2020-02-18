"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _articleextractor = require("../dist/articleextractor.js");

(0, _mocha.describe)('ArticleExtractor', function () {
  (0, _mocha.it)('Should return undefined on bad headlines', function () {
    var text = '<p><strong>Test</strong></p>';
    var text1 = '<h2>Test</h2>';
    var testarray = [text, text1];

    for (var i = 0; i < testarray.length; i += 1) {
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(testarray[i])).to.be.equal(undefined);
    }
  });
  (0, _mocha.it)('Should remove unnecessary content on the page', function () {
    var data = "test";
    (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(data)).to.be.equal(undefined);
    data = '<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body"><p>Test</p>';
    (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(data)).to.not.contain('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body">');
  });
});