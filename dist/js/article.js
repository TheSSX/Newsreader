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
 Class for a news article object
 */
var Article = /*#__PURE__*/function () {
  /**
   * Returns an article
   * @param publisher - the article publisher, e.g. BBC
   * @param topic - the article topic, e.g. sport
   * @param allheadline - the headline as a single string
   * @param headline - the headline as an array of strings, each ~150 chars long
   * @param link - the article hyperlink
   * @param alltext - the text of the article as a single string
   * @param text - the text of the article as an array of strings, each ~150 chars long
   * @param language - the language of the article
   * @param sentences - the number of sentences in this article
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
      //Read the publisher and topic
      new _speech.Speech(this.publisher, this.language).speak();
      new _speech.Speech(this.topic, this.language).speak();
      /*
      If the article language is English, we read the allheadline and alltext variables
      This is because the SpeechSynthesis module can read this out in one go
      If the article language is not English, we read the headline and text variables
      This is because the SpeechSynthesis module can only read a maximum of ~200 chars of non-English
      text before cutting out abruptly
       */

      if (this.language === "English") {
        var headline = _pageparser.DataParser.abbreviationConcatenation(this.allheadline); //replace concatenations in the text with words easier to parse, e.g. Dr. becomes Doctor


        headline = headline.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|"); //split the text into array of sentences

        if (headline) for (var i = 0; i < headline.length; i++) {
          new _speech.Speech(headline[i], this.language).speak();
        } else //sentence splitting failed, just read the array instead
          new _speech.Speech(this.allheadline, this.language).speak();

        var text = _pageparser.DataParser.abbreviationConcatenation(this.alltext);

        text = text.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
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
    /**
     * Change the number of sentences in the article
     * Article text is replaced with array of sentences so we can easily read out the correct amount
     * @param sentences - the number of sentences to read out
     */

  }, {
    key: "amendLength",
    value: function amendLength(sentences) {
      if (sentences < _preferences.min_sentences || sentences > _preferences.max_sentences) return;
      this.sentences = sentences;
      var newText = []; //contains the text of the correct number of sentences

      var temp = [];

      for (var i = 0; i < this.originalText.length; i++) {
        if (['.', '?', '!'].includes(this.originalText[i].charAt(this.originalText[i].length - 1))) //we have the end of a sentence
          {
            for (var j = 0; j < temp.length; j++) {
              newText.push(temp[j]); //push the whole of the sentence onto the array
            }

            newText.push(this.originalText[i]);
            temp = [];
            sentences--;

            if (sentences <= 0) {
              this.text = newText;
              return;
            }
          } else //temp contains current sentence
          {
            temp.push(this.originalText[i]);
          }
      }
    }
  }]);
  return Article;
}();

exports.Article = Article;