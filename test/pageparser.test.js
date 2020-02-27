"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/pageparser.js");

var _article = require("../dist/article.js");

var _bulletin = require("../dist/bulletin.js");

var _articleextractor = require("../dist/articleextractor.js");

var _translator = require("../dist/translator.js");

var _preferences = require("../dist/preferences.js");

var _language_config = require("../dist/language_config.js");

var _speech = require("../dist/speech.js");

var _summarise = require("../dist/summarise.js");

(0, _mocha.suite)('PageParser', function () {
  (0, _mocha.describe)('getArticle', function () {
    (0, _mocha.it)('Should call the right function depending on the news source', function () {
      var guardianreturn = "Guardian works";
      var bbcreturn = "BBC works";
      var reutersreturn = "Reuters works";
      var skyreturn = "Sky works";
      var apreturn = "AP works";
      var eveningstandardreturn = "Evening Standard works";
      var independentreturn = "Independent works";
      var itvreturn = "ITV works";
      var newsaureturn = "News AU works";
      var stub_extractGuardian = (0, _sinon.stub)(_pageparser.PageParser, 'extractGuardian').returns(guardianreturn);
      var stub_extractBBC = (0, _sinon.stub)(_pageparser.PageParser, 'extractBBC').returns(bbcreturn);
      var stub_extractReuters = (0, _sinon.stub)(_pageparser.PageParser, 'extractReuters').returns(reutersreturn);
      var stub_extractSky = (0, _sinon.stub)(_pageparser.PageParser, 'extractSky').returns(skyreturn);
      var stub_extractAP = (0, _sinon.stub)(_pageparser.PageParser, 'extractAP').returns(apreturn);
      var stub_extractEveningStandard = (0, _sinon.stub)(_pageparser.PageParser, 'extractEveningStandard').returns(eveningstandardreturn);
      var stub_extractIndependent = (0, _sinon.stub)(_pageparser.PageParser, 'extractIndependent').returns(independentreturn);
      var stub_extractITV = (0, _sinon.stub)(_pageparser.PageParser, 'extractITV').returns(itvreturn);
      var stub_extractNewsAU = (0, _sinon.stub)(_pageparser.PageParser, 'extractNewsAU').returns(newsaureturn);
      var argument;
      argument = _pageparser.PageParser.getArticle("The Guardian", "test", "test", "test");
      (0, _chai.expect)(stub_extractGuardian.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(guardianreturn);
      argument = _pageparser.PageParser.getArticle("BBC", "test", "test", "test");
      (0, _chai.expect)(stub_extractBBC.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(bbcreturn);
      argument = _pageparser.PageParser.getArticle("Reuters", "test", "test", "test");
      (0, _chai.expect)(stub_extractReuters.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(reutersreturn);
      argument = _pageparser.PageParser.getArticle("Sky News", "test", "test", "test");
      (0, _chai.expect)(stub_extractSky.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(skyreturn);
      argument = _pageparser.PageParser.getArticle("Associated Press", "test", "test", "test");
      (0, _chai.expect)(stub_extractAP.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(apreturn);
      argument = _pageparser.PageParser.getArticle("Evening Standard", "test", "test", "test");
      (0, _chai.expect)(stub_extractEveningStandard.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(eveningstandardreturn);
      argument = _pageparser.PageParser.getArticle("The Independent", "test", "test", "test");
      (0, _chai.expect)(stub_extractIndependent.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(independentreturn);
      argument = _pageparser.PageParser.getArticle("ITV News", "test", "test", "test");
      (0, _chai.expect)(stub_extractITV.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(itvreturn);
      argument = _pageparser.PageParser.getArticle("News.com.au", "test", "test", "test");
      (0, _chai.expect)(stub_extractNewsAU.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(newsaureturn);
      (0, _chai.expect)(function () {
        _pageparser.PageParser.getArticle("test", "test", "test", "test");
      }).to["throw"](TypeError);
    });
  });
});