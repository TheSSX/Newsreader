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

var _bulletin = require("../dist/bulletin.js");

var _articleextractor = require("../dist/articleextractor.js");

var _translator = require("../dist/translator.js");

var _preferences = require("../dist/preferences.js");

var _language_config = require("../dist/language_config.js");

var _speech = require("../dist/speech.js");

var _summarise = require("../dist/summarise.js");

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
      var topic, test_link, stub_extractPageData, stub_summarise, stub_extractGuardianText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              topic = Object.keys(_preferences.topics)[0]; //random topic

              test_link = _preferences.sources["The Guardian"] + topic + '/test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<p>Test</p><a href="' + test_link + '"</a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context.next = 8;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 8:
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
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns("Test article");
              _context.next = 29;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 29:
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

            case 44:
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
      var topic, test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractGuardianText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              topic = Object.keys(_preferences.topics)[0]; //random topic

              test_link = _preferences.sources["The Guardian"] + topic + '/test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context2.next = 5;
              return _pageparser.PageParser.extractGuardian(topic, test_link, 3);

            case 5:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.called).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context2.next = 12;
              return _pageparser.PageParser.extractGuardian(topic, test_link, 0);

            case 12:
              result = _context2.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 21;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 21:
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

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 42;
              return _pageparser.PageParser.extractGuardian(topic, "test", sentences);

            case 42:
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

            case 55:
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
      var topic, test_link, stub_extractPageData, stub_summarise, stub_extractBBCText, sentences, result, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              topic = Object.keys(_preferences.topics)[0]; //random topic

              test_link = 'test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              sentences = 4; //Can't figure this out at all
              //TypeError: (0 , _sinon.stub)(...).resolves is not a function
              //const stub_callTranslation = stub(callTranslation).resolves(undefined);

              _context3.next = 8;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 8:
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
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns("Test article");
              _context3.next = 29;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 29:
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

            case 44:
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
      var topic, test_link, stub_extractPageData, result, argument, sentences, stub_summarise, stub_extractBBCText, argument1, argument2, summarise_arg1, summarise_arg2;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              topic = Object.keys(_preferences.topics)[0]; //random topic

              test_link = 'test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context4.next = 5;
              return _pageparser.PageParser.extractBBC(topic, test_link, 3);

            case 5:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.called).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Zero or fewer sentences requested in article

              _context4.next = 12;
              return _pageparser.PageParser.extractBBC(topic, "test", 0);

            case 12:
              result = _context4.sent;
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              sentences = 3;
              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 21;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 21:
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

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 42;
              return _pageparser.PageParser.extractBBC(topic, "test", sentences);

            case 42:
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

            case 55:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
});