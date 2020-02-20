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

var itv = require('../test_articles/itv.js');

var newscomau = require('../test_articles/newscomau.js');

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
  (0, _mocha.describe)('extractITVText', function () {
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = '<article class="update"><p>Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractITVText(data)).to.not.be.equal(undefined);
      data = '<article class="update"><p>Test</p><div className="update__share">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractITVText(data)).to.not.be.equal(undefined);
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractITVText(itv);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanHTML.calledOnce);
      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument1 = _articleextractor.DataCleaner.cleanHTML.getCall(-1).args[0];

      var argument2 = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument1).to.not.be.equal(undefined);
      (0, _chai.expect)(argument2).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractAUStart', function () {
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = '<p class="description">Test</p>';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractAUStart(data)).to.be.equal("Test");
      data = 'Test';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractAUStart(data)).to.be.equal("");
    });
  });
  (0, _mocha.describe)('extractAUEnd', function () {
    (0, _mocha.it)('Should remove unnecessary content on the page', function () {
      var data = 'Test';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractAUEnd(data)).to.be.equal(""); //data = '<div class="story-content"><p>Test</p>';
      //expect(ArticleExtractor.extractAUEnd(data)).to.be.equal("");

      data = '<div class="story-content"><p>Test</p><div id="share-and-comment">';
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractAUEnd(data)).to.not.be.equal("");
    });
    (0, _mocha.it)('Should return text between <p> tags', function () {
      var returned = _articleextractor.ArticleExtractor.extractAUEnd(newscomau);

      (0, _chai.expect)(_articleextractor.DataCleaner.cleanHTML.calledOnce);
      (0, _chai.expect)(_articleextractor.DataCleaner.cleanText.calledOnce);

      var argument1 = _articleextractor.DataCleaner.cleanHTML.getCall(-1).args[0];

      var argument2 = _articleextractor.DataCleaner.cleanText.getCall(-1).args[0];

      (0, _chai.expect)(argument1).to.not.be.equal('');
      (0, _chai.expect)(argument2).to.not.be.equal("");
      (0, _chai.expect)(returned).to.equal("This works");
    });
  });
  (0, _mocha.describe)('extractNewsAUText', function () {
    (0, _mocha.it)('Should return undefined with no data', function () {
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractNewsAUText(undefined)).to.be.equal(undefined);
    });
    (0, _mocha.it)('Should return the concatenation of the start and end of article', function () {
      _articleextractor.ArticleExtractor.extractAUStart = (0, _sinon.stub)().returns("This");
      _articleextractor.ArticleExtractor.extractAUEnd = (0, _sinon.stub)().returns("works");
      (0, _chai.expect)(_articleextractor.ArticleExtractor.extractNewsAUText("Test")).to.be.equal("This works");
    });
  });
});