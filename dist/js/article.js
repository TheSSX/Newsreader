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
  function Article(publisher, topic, title, link, text) {
    var language = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : "English";
    (0, _classCallCheck2["default"])(this, Article);
    this.publisher = publisher;
    this.topic = topic;
    this.title = title;
    this.link = link;
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
      new _speech.Speech(this.topic, this.language).speak();
      new _speech.Speech(this.title, this.language).speak();
      new _speech.Speech(this.text, this.language).speak();
    }
  }, {
    key: "amendLength",
    value: function amendLength(sentences) {
      var arrText = this.originalText.match(/[^\.!\?]+[\.!\?]+/g);
      var newText = "";

      try {
        for (var i = 0; i < sentences; i++) {
          newText += arrText[i] + " ";
        }

        this.text = newText;
      } catch (TypeError) {}
    }
  }]);
  return Article;
}();

exports.Article = Article;