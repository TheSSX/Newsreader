"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _speech = require("../dist/js/speech.js");

var _language_config = require("../dist/js/language_config.js");

(0, _mocha.suite)('Speech', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('constructor', function () {
    (0, _mocha.xit)('Should instantiate properly', function () {
      var text = "test";
      var language = Object.keys(_language_config.languages)[Math.floor(Math.random() * Object.keys(_language_config.languages).length)];
      var speech = new _speech.Speech(text, language);
      (0, _chai.expect)(speech).to.not.be.equal(null);
    });
  });
  (0, _mocha.describe)('speak', function () {
    (0, _mocha.xit)('Should read aloud its utterance', function () {
      var text = "test";
      var language = Object.keys(_language_config.languages)[Math.floor(Math.random() * Object.keys(_language_config.languages).length)];
      var stub_speak = (0, _sinon.stub)(window.speechSynthesis, 'speak').returns(true);
      var speech = new _speech.Speech(text, language);
      speech.speak();
      (0, _chai.expect)(stub_speak.getCall(0).calledWithExactly(speech.speech)).to.be.equal(true);
    });
  });
});