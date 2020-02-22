"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _article = require("../dist/article.js");

(0, _mocha.describe)('Article', function () {
  (0, _mocha.it)('Should instantiate properly', function () {
    var article = new _article.Article("test", "test", "test", "test", "test");
    (0, _chai.expect)(article).to.not.be.equal(null);
  });
});