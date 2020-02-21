"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Article = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _speech = require("../dist/speech");

/**
 Class for an article object
 */
var Article =
/*#__PURE__*/
function () {
  /**
   * Create an article
   * @param publisher - the news source
   * @param topic - the news topic
   * @param title - the title of the article
   * @param link - the link to the article
   * @param text - the summarised article text
   */
  function Article(publisher, topic, title, link, text) {
    (0, _classCallCheck2["default"])(this, Article);
    this.publisher = publisher;
    this.topic = topic;
    this.title = title;
    this.link = link;
    this.text = text;
  }
  /**
   * Read each field of the article, excluding the link
   */


  (0, _createClass2["default"])(Article, [{
    key: "read",
    value: function read() {
      new _speech.Speech(this.publisher).speak();
      new _speech.Speech(this.topic).speak();
      new _speech.Speech(this.title).speak();
      new _speech.Speech(this.text).speak();
    }
  }]);
  return Article;
}();

exports.Article = Article;