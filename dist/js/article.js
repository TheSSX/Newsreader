"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Article = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _speech = require("../../dist/js/speech");

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
  }
  /**
   * Read each field of the article, excluding the link
   */


  (0, _createClass2["default"])(Article, [{
    key: "read",
    value: function read() {
      new _speech.Speech(this.publisher, this.language).speak();
      new _speech.Speech(this.topic, this.language).speak(); //TODO find some way to get this working
      //If SMMRY isn't available, this reads out the entirety of the article because that's what is stored in alltext
      //If SMMRY is available, that's fine because alltext contains max_sentences worth of the article.
      //As a result, it can sound very clunky and it will be more noticeable as most evaluators will speak English
      //The for loop is necessary for non-English articles. Can't get around it
      //Possibilites: amend textSplitter to return an array of a requested size
      //Also amend amendLength to take an input array
      // if (this.language === "English")
      // {
      //     new Speech(this.allheadline, this.language).speak();
      //     new Speech(this.alltext, this.language).speak();
      // }
      // else
      // {

      for (var i = 0; i < this.headline.length; i++) {
        new _speech.Speech(this.headline[i], this.language).speak();
      }

      for (var _i = 0; _i < this.text.length; _i++) {
        new _speech.Speech(this.text[_i], this.language).speak();
      } //}

    }
  }, {
    key: "amendLength",
    value: function amendLength(sentences) {
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