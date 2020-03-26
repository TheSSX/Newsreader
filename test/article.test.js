"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _speech = require("../dist/js/speech.js");

var _article = require("../dist/js/article.js");

var _preferences = require("../dist/js/preferences.js");

var _jsdom = require("jsdom");

var jsdom = require('jsdom-global')(); //require('mocha-jsdom')({skipWindowCheck: true, url: "http://localhost"});


(0, _mocha.suite)('Article', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
    jsdom();
  });
  (0, _mocha.describe)('constructor', function () {
    (0, _mocha.it)('Should instantiate properly', function () {
      var article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["test"], "French", 3);
      (0, _chai.expect)(article).to.not.be.equal(null);
      article = new _article.Article("test", "test", "test", ["test"], "test", "test", ["test"]);
      (0, _chai.expect)(article).to.not.be.equal(null);
    });
  });
  (0, _mocha.describe)('read', function () {
    (0, _mocha.xit)('Should read aloud its parameters', function () {
      var dom = new _jsdom.JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
      var oldwindow = global.window;
      global.window = dom.window;
      (0, _sinon.stub)(global.window, 'SpeechSynthesisUtterance');
      (0, _sinon.stub)(_speech.Speech.prototype, 'speak').returns(true);
      new _article.Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", ["array-text"]).read();
      (0, _chai.expect)(_speech.Speech.prototype.speak.callCount).to.be.equal(4);
      (0, _chai.expect)(_speech.Speech.prototype.speak.getCall(0).calledWithExactly("publisher")).to.be.equal(true);
      (0, _chai.expect)(_speech.Speech.prototype.speak.getCall(1).calledWithExactly("topic")).to.be.equal(true);
      (0, _chai.expect)(_speech.Speech.prototype.speak.getCall(2).calledWithExactly("string-headline")).to.be.equal(true);
      (0, _chai.expect)(_speech.Speech.prototype.speak.getCall(4).calledWithExactly("string-text")).to.be.equal(true);
      global.window = oldwindow;
    });
  });
  (0, _mocha.describe)('amendLength', function () {
    var short_article = ['This article has 6 sentences.', 'Here is a sentence.', 'Here is another.', 'This should work fine.', 'In this case, all fields end in a period.', 'So the basic functionality will work.'];
    var long_article = ['This article also has 6 sentences but they are', ' broken up for testing purposes and', ' to see the effect.', 'It also makes use of ', 'various other punctuation!', 'Here is a regular sentence.', 'Hello?', 'Can you still ', 'hear me?', 'Okay good, I was just', ' checking.'];
    (0, _mocha.it)('Should change the number of sentences in the text field', function () {
      var article = new _article.Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", short_article);
      (0, _chai.expect)(article.originalText).to.be.deep.equal(short_article);
      (0, _chai.expect)(article.text.length).to.be.equal(short_article.length);
      var newLength = 4;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text.length).to.be.equal(newLength);
      (0, _chai.expect)(article.originalText.length).to.be.equal(short_article.length);
      newLength = 5;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text.length).to.be.equal(newLength);
      (0, _chai.expect)(article.originalText.length).to.be.equal(short_article.length);
      article = new _article.Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", long_article);
      (0, _chai.expect)(article.originalText).to.be.deep.equal(long_article);
      (0, _chai.expect)(article.text.length).to.be.equal(long_article.length);
      newLength = 2;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text.length).to.be.equal(5);
      (0, _chai.expect)(article.originalText.length).to.be.equal(long_article.length);
      newLength = 6;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text.length).to.be.equal(long_article.length);
      (0, _chai.expect)(article.originalText.length).to.be.equal(long_article.length);
    });
    (0, _mocha.it)('Should do nothing with a length outside the global range', function () {
      var article = new _article.Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", short_article);
      var newLength = _preferences.min_sentences - 1;
      var oldtext = article.text;
      var oldoriginaltext = article.originalText;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text).to.be.deep.equal(oldtext);
      (0, _chai.expect)(article.originalText).to.be.deep.equal(oldoriginaltext);
      newLength = _preferences.max_sentences + 1;
      oldtext = article.text;
      oldoriginaltext = article.originalText;
      article.amendLength(newLength);
      (0, _chai.expect)(article.text).to.be.deep.equal(oldtext);
      (0, _chai.expect)(article.originalText).to.be.deep.equal(oldoriginaltext);
    });
  });
});