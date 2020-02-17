"use strict";

var _article = require("../dist/article.js");

var _mocha = require("mocha");

var _chai = require("chai");

(0, _mocha.describe)('Article', function () {
  (0, _mocha.it)('should be good', function () {
    var article = new _article.Article("test", "test", "test", "test", "test");
    (0, _chai.expect)(article).to.be(null);
  });
});