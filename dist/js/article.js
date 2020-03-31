"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Article = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _speech = require("../../dist/js/speech");

var _preferences = require("./preferences.js");

var _pageparser = require("../../dist/js/pageparser");

/**
 Class for an article object
 */
var Article = /*#__PURE__*/function () {
  /**
   * Create an article
   * @param publisher - the news source
   * @param topic - the news topic
   * @param title - the title of the article
   * @param link - the link to the article
   * @param text - the summarised article text
   */
  function Article(publisher, topic, allheadline, headline, link, alltext, text) {
    var language = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "English";
    var sentences = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : _preferences.max_sentences;
    (0, _classCallCheck2["default"])(this, Article);
    this.publisher = publisher;
    this.topic = topic;
    this.allheadline = allheadline;
    this.headline = headline;
    this.link = link;
    this.alltext = alltext;
    this.text = text;
    this.language = language;
    this.originalText = text;
    this.sentences = sentences;
  }
  /**
   * Read each field of the article, excluding the link
   */


  (0, _createClass2["default"])(Article, [{
    key: "read",
    value: function read() {
      new _speech.Speech(this.publisher, this.language).speak();
      new _speech.Speech(this.topic, this.language).speak();

      if (this.language === "English") {
        var headline = _pageparser.DataParser.abbreviationConcatenation(this.allheadline);

        headline = this.allheadline.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
        if (headline) for (var i = 0; i < headline.length; i++) {
          new _speech.Speech(headline[i], this.language).speak();
        } else new _speech.Speech(this.allheadline, this.language).speak();

        var text = _pageparser.DataParser.abbreviationConcatenation(this.alltext);

        text = this.alltext.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
        if (text) for (var _i = 0; _i < this.sentences; _i++) {
          new _speech.Speech(text[_i], this.language).speak();
        } else new _speech.Speech(this.alltext, this.language).speak();
      } else {
        for (var _i2 = 0; _i2 < this.headline.length; _i2++) {
          new _speech.Speech(this.headline[_i2], this.language).speak();
        }

        for (var _i3 = 0; _i3 < this.text.length; _i3++) {
          new _speech.Speech(this.text[_i3], this.language).speak();
        }
      }
    }
  }, {
    key: "amendLength",
    value: function amendLength(sentences) {
      if (sentences < _preferences.min_sentences || sentences > _preferences.max_sentences) return;
      this.sentences = sentences;
      var newText = [];
      var temp = [];

      for (var i = 0; i < this.originalText.length; i++) {
        if (['.', '?', '!'].includes(this.originalText[i].charAt(this.originalText[i].length - 1))) {
          for (var j = 0; j < temp.length; j++) {
            newText.push(temp[j]);
          }

          newText.push(this.originalText[i]);
          temp = [];
          sentences--;

          if (sentences <= 0) {
            this.text = newText;
            return;
          }
        } else {
          temp.push(this.originalText[i]);
        }
      }
    }
  }]);
  return Article;
}();

exports.Article = Article;