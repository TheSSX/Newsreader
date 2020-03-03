"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/pageparser.js");

var _article = require("../dist/article.js");

var _articleextractor = require("../dist/articleextractor.js");

var _preferences = require("../dist/preferences.js");

var _summarise = require("../dist/summarise.js");

var _translator = require("../dist/translator.js");

//import {$} from "../dist/jquery.js";
var valid_test_smmry_json = {
  'sm_api_title': 'test-headline',
  'sm_api_content': 'test-content',
  'sm_api_error': 0
};
var invalid_test_smmry_json = {
  'sm_api_title': 'test-headline',
  'sm_api_content': 'test-content',
  'sm_api_error': 2
};
var topic = Object.keys(_preferences.topics)[Math.floor(Math.random() * Object.keys(_preferences.topics).length)]; //random topic

(0, _mocha.suite)('PageParser', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
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
  (0, _mocha.describe)('extractGuardian', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractGuardianText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              test_link = _preferences.sources["The Guardian"] + topic + '/test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context.next = 7;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 7:
              result = _context.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractGuardianText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns("Test article");
              _context.next = 28;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 28:
              result = _context.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee2() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractGuardianText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              test_link = _preferences.sources["The Guardian"] + topic + '/test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context2.next = 4;
              return _pageparser.PageParser.extractGuardian(topic, test_link, 3);

            case 4:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context2.next = 11;
              return _pageparser.PageParser.extractGuardian(topic, "test", 0);

            case 11:
              result = _context2.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 20;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 20:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractGuardianText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 41;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 41:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  (0, _mocha.describe)('extractBBC', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee3() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractBBCText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context3.next = 7;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 7:
              result = _context3.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractBBCText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns("Test article");
              _context3.next = 28;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 28:
              result = _context3.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee4() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractBBCText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context4.next = 4;
              return _pageparser.PageParser.extractBBC(topic, test_link, 3);

            case 4:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context4.next = 11;
              return _pageparser.PageParser.extractBBC(topic, "test", 0);

            case 11:
              result = _context4.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 20;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 20:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractBBCText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 41;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 41:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  (0, _mocha.describe)('extractReuters', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee5() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractReutersText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              test_link = 'article/test-link1/test'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sources["Reuters"] + test_link + '"</a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context5.next = 7;
              return _pageparser.PageParser.extractReuters(topic, "test", sentences);

            case 7:
              result = _context5.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractReutersText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sources["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns("Test article");
              _context5.next = 28;
              return _pageparser.PageParser.extractReuters(topic, "test", sentences);

            case 28:
              result = _context5.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee6() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractReutersText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              test_link = 'article/test-link1/test'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context6.next = 4;
              return _pageparser.PageParser.extractReuters(topic, test_link, 3);

            case 4:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context6.next = 11;
              return _pageparser.PageParser.extractReuters(topic, "test", 0);

            case 11:
              result = _context6.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sources["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              _context6.next = 20;
              return _pageparser.PageParser.extractReuters(topic, "test", sentences);

            case 20:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractReutersText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sources["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              _context6.next = 41;
              return _pageparser.PageParser.extractReuters(topic, "test", sentences);

            case 41:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
  (0, _mocha.describe)('extractSky', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee7() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractSkyText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context7.next = 7;
              return _pageparser.PageParser.extractSky(topic, "test", sentences);

            case 7:
              result = _context7.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1]; //expect(summarise_arg1).to.be.equal(sources["Sky News"] + 'story/' +  test_link);

              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractSkyText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns("Test article");
              _context7.next = 28;
              return _pageparser.PageParser.extractSky(topic, "test", sentences);

            case 28:
              result = _context7.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee8() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractSkyText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              test_link = 'story/test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context8.next = 4;
              return _pageparser.PageParser.extractSky(topic, test_link, 3);

            case 4:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context8.next = 11;
              return _pageparser.PageParser.extractSky(topic, "test", 0);

            case 11:
              result = _context8.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              _context8.next = 20;
              return _pageparser.PageParser.extractSky(topic, "test", sentences);

            case 20:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractSkyText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              _context8.next = 41;
              return _pageparser.PageParser.extractSky(topic, "test", sentences);

            case 41:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.oneOf([_preferences.sources["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
  });
  (0, _mocha.describe)('extractAP', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee9() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractAPHeadline, stub_extractAPText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              test_link = '501c4j'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns(undefined);
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context9.next = 8;
              return _pageparser.PageParser.extractAP(topic, "test", sentences);

            case 8:
              result = _context9.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Associated Press"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(false);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractAPHeadline.restore();
              stub_extractAPText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns("Test headline");
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns("Test article");
              _context9.next = 32;
              return _pageparser.PageParser.extractAP(topic, "test", sentences);

            case 32:
              result = _context9.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Associated Press"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(true);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 48:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee10() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractAPHeadline, stub_extractAPText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              test_link = '501c4j'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context10.next = 4;
              return _pageparser.PageParser.extractAP(topic, test_link, 3);

            case 4:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context10.next = 11;
              return _pageparser.PageParser.extractAP(topic, "test", 0);

            case 11:
              result = _context10.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns(undefined);
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns(undefined);
              _context10.next = 21;
              return _pageparser.PageParser.extractAP(topic, "test", sentences);

            case 21:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Associated Press"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(true);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractAPHeadline.restore();
              stub_extractAPText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns(undefined);
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns(undefined);
              _context10.next = 45;
              return _pageparser.PageParser.extractAP(topic, "test", sentences);

            case 45:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Associated Press"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(true);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 59:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  (0, _mocha.describe)('extractEveningStandard', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee11() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractEveningStandardText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              test_link = 'news/test-link1.html'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context11.next = 7;
              return _pageparser.PageParser.extractEveningStandard(topic, "test", sentences);

            case 7:
              result = _context11.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Evening Standard"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractEveningStandardText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns("Test article");
              _context11.next = 28;
              return _pageparser.PageParser.extractEveningStandard(topic, "test", sentences);

            case 28:
              result = _context11.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Evening Standard"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee12() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractEveningStandardText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              test_link = 'news/test-link1.html'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context12.next = 4;
              return _pageparser.PageParser.extractEveningStandard(topic, test_link, 3);

            case 4:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.called).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context12.next = 11;
              return _pageparser.PageParser.extractEveningStandard(topic, test_link, 0);

            case 11:
              result = _context12.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              _context12.next = 20;
              return _pageparser.PageParser.extractEveningStandard(topic, "test", sentences);

            case 20:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Evening Standard"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractEveningStandardText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              _context12.next = 41;
              return _pageparser.PageParser.extractEveningStandard(topic, "test", sentences);

            case 41:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["Evening Standard"] + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  (0, _mocha.describe)('extractIndependent', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee13() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractIndependentText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              test_link = 'test-link1.html'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context13.next = 7;
              return _pageparser.PageParser.extractIndependent(topic, "test", sentences);

            case 7:
              result = _context13.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractIndependentText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns("Test article");
              _context13.next = 28;
              return _pageparser.PageParser.extractIndependent(topic, "test", sentences);

            case 28:
              result = _context13.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee14() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractIndependentText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              test_link = 'test-link1.html'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context14.next = 4;
              return _pageparser.PageParser.extractIndependent(topic, test_link, 3);

            case 4:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context14.next = 11;
              return _pageparser.PageParser.extractIndependent(topic, "test", 0);

            case 11:
              result = _context14.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              _context14.next = 20;
              return _pageparser.PageParser.extractIndependent(topic, "test", sentences);

            case 20:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractIndependentText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              _context14.next = 41;
              return _pageparser.PageParser.extractIndependent(topic, "test", sentences);

            case 41:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
  (0, _mocha.describe)('extractITV', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee15() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractITVText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              test_link = '2020-03-03/test-link'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context15.next = 7;
              return _pageparser.PageParser.extractITV(topic, "test", sentences);

            case 7:
              result = _context15.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractITVText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns("Test article");
              _context15.next = 28;
              return _pageparser.PageParser.extractITV(topic, "test", sentences);

            case 28:
              result = _context15.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee16() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractITVText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              test_link = '2020-03-03/test-link'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context16.next = 4;
              return _pageparser.PageParser.extractITV(topic, test_link, 3);

            case 4:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context16.next = 11;
              return _pageparser.PageParser.extractITV(topic, "test", 0);

            case 11:
              result = _context16.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              _context16.next = 20;
              return _pageparser.PageParser.extractITV(topic, "test", sentences);

            case 20:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractITVText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              _context16.next = 41;
              return _pageparser.PageParser.extractITV(topic, "test", sentences);

            case 41:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(_preferences.sources["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  });
  (0, _mocha.describe)('extractNewsAU', function () {
    (0, _mocha.it)('Should return a valid article',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee17() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractNewsAUText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              test_link = _preferences.sources["News.com.au"] + topic + '/test-link1/news-story/a4vjn6'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context17.next = 7;
              return _pageparser.PageParser.extractNewsAU(topic, "test", sentences);

            case 7:
              result = _context17.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(false); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractNewsAUText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns("Test article");
              _context17.next = 28;
              return _pageparser.PageParser.extractNewsAU(topic, "test", sentences);

            case 28:
              result = _context17.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true); //expect(stub_callTranslation.called).to.be.equal(false);
              //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.title).to.be.equal('Test headline');
              (0, _chai.expect)(result.text).to.be.equal('Not enough summary credits! Test article');

            case 43:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs',
    /*#__PURE__*/
    (0, _asyncToGenerator2["default"])(
    /*#__PURE__*/
    _regenerator["default"].mark(function _callee18() {
      var test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractNewsAUText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              test_link = _preferences.sources["News.com.au"] + topic + '/test-link1/news-story/a4vjn6'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context18.next = 4;
              return _pageparser.PageParser.extractNewsAU(topic, test_link, 3);

            case 4:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context18.next = 11;
              return _pageparser.PageParser.extractNewsAU(topic, "test", 0);

            case 11:
              result = _context18.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              _context18.next = 20;
              return _pageparser.PageParser.extractNewsAU(topic, "test", sentences);

            case 20:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractNewsAUText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              _context18.next = 41;
              return _pageparser.PageParser.extractNewsAU(topic, "test", sentences);

            case 41:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg1 = stub_summarise.getCall(-1).args[0];
              summarise_arg2 = stub_summarise.getCall(-1).args[1];
              (0, _chai.expect)(summarise_arg1).to.be.equal(test_link);
              (0, _chai.expect)(summarise_arg2).to.be.equal(sentences);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 54:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
  }); // describe('extractPageData', function () {
  //
  //     it('Should return results from the web server', function () {
  //
  //         const server = createFakeServer();
  //         server.respondWith("GET", "*",
  //             [200, { "Content-Type": "application/json" },
  //                 '[{ "id": 12, "comment": "Hey there" }]']);
  //         const stub_ajax = stub($, 'ajax').resolves({ data: 'test data' });
  //
  //         PageParser.extractPageData("test").then((data) => {
  //             server.respond();
  //             console.log("Data is " + data);
  //             expect(stub_ajax.called).to.be.equal(true);
  //         });
  //     });
  // });
});
(0, _mocha.describe)('callTranslation', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.it)('Should return translated data',
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee19() {
    var stub_translate, result;
    return _regenerator["default"].wrap(function _callee19$(_context19) {
      while (1) {
        switch (_context19.prev = _context19.next) {
          case 0:
            stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').resolves({
              'code': 200,
              'text': 'translation'
            });
            _context19.next = 3;
            return (0, _pageparser.callTranslation)("test", "test", "test", "test");

          case 3:
            result = _context19.sent;
            (0, _chai.expect)(stub_translate.callCount).to.be.equal(4);
            (0, _chai.expect)(result).to.be.deep.equal(['translation', 'translation', 'translation', 'translation']);

          case 6:
          case "end":
            return _context19.stop();
        }
      }
    }, _callee19);
  })));
  (0, _mocha.it)('Should return nothing if an error occurred',
  /*#__PURE__*/
  (0, _asyncToGenerator2["default"])(
  /*#__PURE__*/
  _regenerator["default"].mark(function _callee20() {
    var stub_translate, result;
    return _regenerator["default"].wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').resolves({
              'code': 500
            });
            _context20.next = 3;
            return (0, _pageparser.callTranslation)("test", "test", "test", "test");

          case 3:
            result = _context20.sent;
            (0, _chai.expect)(stub_translate.callCount).to.be.equal(4);
            (0, _chai.expect)(result).to.be.equal(undefined);
            (0, _sinon.restore)();
            stub_translate = (0, _sinon.stub)(_translator.Translator, 'translate').resolves(undefined);
            _context20.next = 10;
            return (0, _pageparser.callTranslation)("test", "test", "test", "test");

          case 10:
            result = _context20.sent;
            (0, _chai.expect)(stub_translate.callCount).to.be.equal(4);
            (0, _chai.expect)(result).to.be.equal(undefined);

          case 13:
          case "end":
            return _context20.stop();
        }
      }
    }, _callee20);
  })));
});