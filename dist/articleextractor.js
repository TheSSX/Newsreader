"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ArticleExtractor = exports.DataCleaner = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * Class to clean unwanted data from HTML received from Ajax
 */
var DataCleaner =
/*#__PURE__*/
function () {
  function DataCleaner() {
    (0, _classCallCheck2["default"])(this, DataCleaner);
  }

  (0, _createClass2["default"])(DataCleaner, null, [{
    key: "cleanHTML",

    /**
     * Removes unwanted HTML tags, excludes <div>
     * @param articletext - the HTML to clean
     * @returns {string} - the clean HTML
     */
    value: function cleanHTML(articletext) {
      articletext = articletext.replace(/<figure .+>/g, '');
      articletext = articletext.replace(/<\/figure>/g, '');
      articletext = articletext.replace(/<figure[^.+]*>/g, "");
      articletext = articletext.replace(/<\/figure>/g, "");
      articletext = articletext.replace(/<footer .+\/footer>/g, '');
      articletext = articletext.replace(/<span .+>.+<\/span>/ig, '');
      articletext = articletext.replace(/<figure .+>.+<\/figure>/ig, '');
      articletext = articletext.replace(/<figure .+>.+<\/figure>/ig, '');
      articletext = articletext.split(/<figure .+>.+<\/figure>/g).join('');
      articletext = articletext.split(/<span .+>.+<\/span>/g).join('');
      articletext = articletext.split(/<p><em>.+<\/em><\/p>/g).join('');
      articletext = articletext.split(/<figure[^.+]*>/g).join('');
      articletext = articletext.split(/<\/figure>/g).join('');
      return articletext;
    }
    /**
     * Removes or replaces awkward or unrecognised characters parsed from articles' HTML
     * @param articletext - the text to clean
     * @returns {string} - the clean text
     */

  }, {
    key: "cleanText",
    value: function cleanText(articletext) {
      articletext = articletext.replace(/(<([^>]+)>)/ig, "");
      articletext = articletext.replace(/(<([^>]+)>)/ig, "");
      articletext = articletext.split(/<p><em>.+<\/em><\/p>/g).join('');
      articletext = articletext.split(/<p><strong>.+<\/strong><\/p>/g).join('');
      articletext = articletext.split(/<p><i>.+<\/i><\/p>/g).join('');
      articletext = articletext.split(/<p><b>.+<\/b><\/p>/g).join('');
      articletext = articletext.split(/<p><u>.+<\/u><\/p>/g).join('');
      articletext = articletext.split('&#x2013;').join("-");
      articletext = articletext.split('&#x201D;').join('"');
      articletext = articletext.split('&#x2018;').join('"');
      articletext = articletext.split('&#x2019;').join("'");
      articletext = articletext.split('&#x201C;').join('"');
      articletext = articletext.split('&amp;').join('&');
      articletext = articletext.split('&#x2026;').join('...');
      articletext = articletext.split('&#x2022;').join('•');
      articletext = articletext.split('&#x200B;').join('');
      articletext = articletext.split('&#x2014;').join('-');
      articletext = articletext.split('&#xF3;').join('ó');
      articletext = articletext.split('&#39;').join("'");
      articletext = articletext.split('&quot;').join('"');
      articletext = articletext.split('&nbsp;').join(" ");
      articletext = articletext.split(' span>').join("");
      articletext = articletext.split('&amp;').join('&');
      articletext = articletext.split('&#163;').join('£');
      articletext = articletext.split('&#8364;').join('€');
      articletext = articletext.split(/\&rsquo\;/g).join("'");
      articletext = articletext.split(/\&lsquo\;/g).join("'");
      articletext = articletext.split(/\&ldquo\;/g).join('"');
      articletext = articletext.split(/\&rdquo\;/g).join('"');
      articletext = articletext.split('Sharing the full story, not just the headlines').join(' ');
      articletext = articletext.trim();
      articletext = articletext.replace(/\s+/g, ' ');
      return articletext;
    }
  }]);
  return DataCleaner;
}();
/**
 * Class to manually extract text from retrieved articles
 */


exports.DataCleaner = DataCleaner;

var ArticleExtractor =
/*#__PURE__*/
function () {
  function ArticleExtractor() {
    (0, _classCallCheck2["default"])(this, ArticleExtractor);
  }

  (0, _createClass2["default"])(ArticleExtractor, null, [{
    key: "extractGuardianText",

    /**
     * Backup function to extract Guardian article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    value: function extractGuardianText(data) {
      if (data.includes('<p><strong>') || data.includes('<h2>')) {
        return undefined;
      }

      data = data.split('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body">')[1];

      if (data === undefined) {
        return undefined;
      }

      var copy = false;
      var articletext = "";
      var counter = 2;

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
    /**
     * Backup function to extract BBC article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractBBCText",
    value: function extractBBCText(data) {
      data = data.split('<p class="story-body__introduction">')[1];

      if (data === undefined) {
        return undefined;
      }

      var copy = true;
      var articletext = "";
      var counter = 0;

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
    /**
     * Backup function to extract Reuters article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractReutersText",
    value: function extractReutersText(data) {
      var copy = false;
      var articletext = "";
      var counter = 2;

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          // counter += 1;
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      articletext = DataCleaner.cleanText(articletext); //TODO maybe not the best idea. Could be hyphen in the text somewhere

      if (articletext.split(' - ')[1]) {
        articletext = articletext.split(' - ')[1];
      }

      if (articletext.split('All quotes delayed a minimum of ')[0]) {
        articletext = articletext.split('All quotes delayed a minimum of ')[0];
      }

      return articletext;
    }
    /**
     * Backup function to extract Sky News article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractSkyText",
    value: function extractSkyText(data) {
      var copy = false;
      var articletext = "";
      var counter = 3;

      while (counter < data.length - 1) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          // counter += 1;
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    } //TODO the second line returned an error at one point
    //Uncaught (in promise) TypeError: Cannot read property 'split' of undefined
    //     at Function.extractAPHeadline (articleextractor.mjs:306)
    //     at Function.extractAP (pageparser.mjs:733)

  }, {
    key: "extractAPHeadline",
    value: function extractAPHeadline(data) {
      if (data.split('<div class="CardHeadline">')[1]) {
        data = data.split('<div class="CardHeadline">')[1];

        if (data.split('<div class="Component-signature-')[0]) {
          data = data.split('<div class="Component-signature-')[0];
        }
      }

      return DataCleaner.cleanText(data);
    }
    /**
     * Backup function to extract Associated Press article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractAPText",
    value: function extractAPText(data) {
      var copy = false;
      var articletext = "";
      var counter = 0; //TODO add in the various return undefined's here

      data = data.split('<div class="Article" data-key="article">')[1];
      data = data.split('<div class="bellow-article">')[0];

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter, counter + 2) === '<p';
        var endoftext = data.substring(counter, counter + 4) === '</p>';

        if (startoftext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      articletext = DataCleaner.cleanText(articletext);

      if (articletext.split('(AP) — ')[1]) {
        articletext = articletext.split('(AP) — ')[1];
      }

      return articletext;
    }
    /**
     * Backup function to extract Evening Standard article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractEveningStandardText",
    value: function extractEveningStandardText(data) {
      var copy = false;
      var articletext = "";
      var counter = 0;

      if (data.split('Update newsletter preferences')[1]) {
        data = data.split('Update newsletter preferences')[1];
      } else if (data.split('<div class="body-content">')[1]) {
        data = data.split('<div class="body-content">')[1];
      } else {
        return undefined;
      }

      if (data === undefined) {
        return undefined;
      }

      if (data.split('<aside class="tags">')[0]) {
        data = data.split('<aside class="tags">')[0];
      } else if (data.split('<div class="share-bar-syndication">')[0]) {
        data = data.split('<div class="share-bar-syndication">')[0];
      } else {
        return undefined;
      }

      data = DataCleaner.cleanHTML(data); // This needs to be here so that identifying elements of where to split aren't removed beforehand

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
    /**
     * Backup function to extract Independent article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractIndependentText",
    value: function extractIndependentText(data) {
      if (data.includes('<p><strong>') || data.includes('<h2><span class="title">')) {
        return undefined;
      }

      if (data.split('<div class="body-content">')[1]) {
        data = data.split('<div class="body-content">')[1];
      } else {
        return undefined;
      }

      if (data === undefined) {
        return undefined;
      }

      if (data.split('<div class="article-bottom">')[0]) {
        data = data.split('<div class="article-bottom">')[0];
      } else if (data.split('<div class="partners" id="partners">')[0]) {
        data = data.split('<div class="partners" id="partners">')[0];
      } else {
        return undefined;
      }

      data = DataCleaner.cleanHTML(data);
      var copy = false;
      var articletext = "";
      var counter = 0;

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';
        var startofspecialtext = false;

        if (counter >= 12) {
          startofspecialtext = data.substring(counter - 13, counter) === '<p dir="ltr">';
        }

        if (startoftext || startofspecialtext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
    /**
     * Backup function to extract ITV News article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractITVText",
    value: function extractITVText(data) {
      var copy = false;
      var articletext = "";
      var counter = 0;

      if (data.split('<article class="update">')[1]) {
        data = data.split('<article class="update">')[1];
      } else {
        return undefined;
      }

      if (data === undefined) {
        return undefined;
      }

      if (data.split('<div className="update__share">')[0]) {
        data = data.split('<div className="update__share">')[0];
      } else {
        return undefined;
      }

      data = DataCleaner.cleanHTML(data);

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>';
        var endoftext = data.substring(counter - 4, counter) === '</p>';

        if (startoftext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
    /**
     * Backup function to extract News.com.au article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */

  }, {
    key: "extractNewsAUText",
    value: function extractNewsAUText(data) {
      if (data === undefined) {
        return undefined;
      }

      return this.extractAUStart(data) + " " + this.extractAUEnd(data);
    }
    /**
     * Extracting the start of a News.au.com article (inside the <p class="description"> part)
     * @param data - the data from the article page
     * @returns {string} - the start of the article
     */

  }, {
    key: "extractAUStart",
    value: function extractAUStart(data) {
      if (data.split('<p class="description">')[1].split('</p>')[0]) {
        return data.split('<p class="description">')[1].split('</p>')[0];
      }

      return "";
    }
    /**
     * Extracting the rest of a News.com.au article (inside the <div class="story-content"> part)
     * @param data - the data from the article page
     * @returns {string} - the rest of the article
     */

  }, {
    key: "extractAUEnd",
    value: function extractAUEnd(data) {
      if (data.split('<div class="story-content">')[1]) {
        data = data.split('<div class="story-content">')[1];
      } else {
        return "";
      }

      if (data.split('<div id="share-and-comment">')[0]) {
        data = data.split('<div id="share-and-comment">')[0];
      } else {
        return "";
      }

      data = data.split(/<div[^.+]*>/g).join('');
      data = DataCleaner.cleanHTML(data);
      var counter = 0;
      var copy = false;
      var articletext = "";

      while (counter < data.length - 3) {
        var startoftext = data.substring(counter - 3, counter) === '<p>' && data[counter] !== '<';
        var endoftext = data.substring(counter - 4, counter) === '</p>';
        var startofspecialtext = false;

        if (counter >= 30) {
          startofspecialtext = data.substring(counter - 30, counter) === '<p class="standfirst-content">';
        }

        if (startoftext || startofspecialtext) {
          copy = true;
        } else if (endoftext) {
          articletext += " ";
          copy = false;
        }

        if (copy) {
          articletext += data[counter];
        }

        counter += 1;
      }

      return DataCleaner.cleanText(articletext);
    }
  }]);
  return ArticleExtractor;
}();

exports.ArticleExtractor = ArticleExtractor;