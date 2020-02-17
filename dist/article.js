"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Article = void 0;

var _speech = require("../dist/speech.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    _classCallCheck(this, Article);

    this.publisher = publisher;
    this.topic = topic;
    this.title = title;
    this.link = link;
    this.text = text;
  }
  /**
   * Read each field of the article, excluding the link
   */


  _createClass(Article, [{
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