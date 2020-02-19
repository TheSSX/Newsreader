"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _articleextractor = require("../dist/articleextractor.js");

var guardian = require('../test_articles/guardian.js');

var bbc = require('../test_articles/BBC.js');

var independent = require('../test_articles/independent.js');

var ap = require('../test_articles/AP.js');

var sky = require('../test_articles/sky.js');

var reuters = require('../test_articles/reuters.js');

var eveningstandard = require('../test_articles/eveningstandard.js');

(0, _mocha.suite)('ArticleExtractor', function () {
  /**
   * Stubbing DataCleaner before each test
   */
  (0, _mocha.beforeEach)(function () {
    _articleextractor.DataCleaner.cleanHTML = (0, _sinon.stub)().returns("<p>Test</p>");
    _articleextractor.DataCleaner.cleanText = (0, _sinon.stub)().returns("This works");
  });
  /**
   * Removing stubs after each test
   */

  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
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
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractGuardianText(data)).to.not.be.equal(undefined);
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractGuardianText(guardian);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractBBCText', function () {
    (0, _mocha.it)("Should recognise pages that aren't articles", function () {
      var text = 'Test';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractBBCText(text)).to.be.equal(undefined);
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractBBCText(bbc);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractIndependentText', function () {
    (0, _mocha.it)('Should return undefined on bad headlines', function () {
      var text = '<p><strong>Test</strong></p>';
      var text1 = '<h2><span class="title">Test</span></h2>';
      var testarray = [text, text1];

      for (var i = 0; i < testarray.length; i += 1) {
        (0, _chai.expect)(_articleextractor.ArticleExtractor.extractIndependentText(testarray[i])).to.be.equal(undefined);
      }
    });
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = '<div class="body-content"><p>Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
      data = '<div class="body-content"><p>Test</p><div class="article-bottom">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
      data = '<div class="body-content"><p>Test</p><div class="partners" id="partners">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractIndependentText(independent);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanHTML.calledOnce);
      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument1 = _articleextractor.DataCleaner.cleanHTML.getCall(-1).args[0];

      var argument2 = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument1).to.not.be.equal(undefined);
      (0, _chai.expect)(argument2).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractReutersText', function () {
    (0, _mocha.it)('Should return text between <p> tags', function () {
      _articleextractor.DataCleaner.cleanText = (0, _sinon.stub)().returns("Reuters - This worksAll quotes delayed a minimum of 15 minutes");

      var returned = _articleextractor.ArticleExtractor.extractReutersText(reuters);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.be.equal("This works");
    });
  });
  (0, _mocha.describe)('extractAPText', function () {
    (0, _mocha.it)('Should return text between <p> tags', function () {
      _articleextractor.DataCleaner.cleanText = (0, _sinon.stub)().returns("(AP) — This works");

      var returned = _articleextractor.ArticleExtractor.extractAPText(ap);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.be.equal("This works");
    });
  });
  (0, _mocha.describe)('extractSkyText', function () {
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractSkyText(sky);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractEveningStandardText', function () {
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = '<p>Update newsletter preferences</p><p>Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
      data = '<div class="body-content"><p>Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
      data = '<div class="body-content"><p>Test</p><aside class="tags">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
      data = '<div class="body-content"><p>Test</p><div class="share-bar-syndication">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractEveningStandardText(eveningstandard);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanHTML.calledOnce);
      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument1 = _articleextractor.DataCleaner.cleanHTML.getCall(-1).args[0];

      var argument2 = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument1).to.not.be.equal(undefined);
      (0, _chai.expect)(argument2).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
});