"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _speech = require("../dist/speech.js");

var _article = require("../dist/article.js");

(0, _mocha.suite)('Article', function () {
  (0, _mocha.describe)('constructor', function () {
    (0, _mocha.it)('Should instantiate properly', function () {
      var article = new _article.Article("test", "test", "test", "test", "test");
      (0, _chai.expect)(article).to.not.be.equal(null);
    });
  }); //
  // it('Should read aloud its parameters', function () {
  //     new Article("test1", "test2", "test3", "test4", "test5").read();
  //     expect(Speech.speak.callCount).to.be.equal(4);
  //     expect(Speech.speak.getCall(0).calledWithExactly("test1")).to.be.equal(true);
  //     expect(Speech.speak.getCall(1).calledWithExactly("test2")).to.be.equal(true);
  //     expect(Speech.speak.getCall(2).calledWithExactly("test3")).to.be.equal(true);
  //     expect(Speech.speak.getCall(4).calledWithExactly("test5")).to.be.equal(true);
  // });
});