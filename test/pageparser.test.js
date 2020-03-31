"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _pageparser = require("../dist/js/pageparser.js");

var _article = require("../dist/js/article.js");

var _articleextractor = require("../dist/js/articleextractor.js");

var _preferences = require("../dist/js/preferences.js");

var _summarise = require("../dist/js/summarise.js");

var jsdom = require('jsdom-global');

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
var topic = Object.keys(_preferences.topiclinks)[Math.floor(Math.random() * Object.keys(_preferences.topiclinks).length)]; //random topic

(0, _mocha.suite)('PageParser', function () {
  (0, _mocha.before)(function () {
    jsdom();
    global.$ = global.jQuery = require('jquery');
  });
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
      argument = _pageparser.PageParser.getArticle("The Guardian", "test", "test");
      (0, _chai.expect)(stub_extractGuardian.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(guardianreturn);
      argument = _pageparser.PageParser.getArticle("BBC", "test", "test");
      (0, _chai.expect)(stub_extractBBC.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(bbcreturn);
      argument = _pageparser.PageParser.getArticle("Reuters", "test", "test");
      (0, _chai.expect)(stub_extractReuters.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(reutersreturn);
      argument = _pageparser.PageParser.getArticle("Sky News", "test", "test");
      (0, _chai.expect)(stub_extractSky.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(skyreturn);
      argument = _pageparser.PageParser.getArticle("Associated Press", "test", "test");
      (0, _chai.expect)(stub_extractAP.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(apreturn);
      argument = _pageparser.PageParser.getArticle("Evening Standard", "test", "test");
      (0, _chai.expect)(stub_extractEveningStandard.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(eveningstandardreturn);
      argument = _pageparser.PageParser.getArticle("The Independent", "test", "test");
      (0, _chai.expect)(stub_extractIndependent.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(independentreturn);
      argument = _pageparser.PageParser.getArticle("ITV News", "test", "test");
      (0, _chai.expect)(stub_extractITV.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(itvreturn);
      argument = _pageparser.PageParser.getArticle("News.com.au", "test", "test");
      (0, _chai.expect)(stub_extractNewsAU.called).to.be.equal(true);
      (0, _chai.expect)(argument).to.be.equal(newsaureturn);
      (0, _chai.expect)(function () {
        _pageparser.PageParser.getArticle("test", "test", "test");
      }).to["throw"](TypeError);
    });
  });
  (0, _mocha.describe)('extractGuardian', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractGuardianText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              test_link = _preferences.sourcelinks["The Guardian"] + topic + '/test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context.next = 6;
              return _pageparser.PageParser.extractGuardian(topic, "test");

            case 6:
              result = _context.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", _pageparser.DataParser.textSplitter("test"), "test", "test", _pageparser.DataParser.textSplitter("test"), "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractGuardianText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns("Test article");
              _context.next = 25;
              return _pageparser.PageParser.extractGuardian(topic, "test");

            case 25:
              result = _context.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractGuardianText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              test_link = _preferences.sourcelinks["The Guardian"] + topic + '/test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context2.next = 4;
              return _pageparser.PageParser.extractGuardian(topic, test_link);

            case 4:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 15;
              return _pageparser.PageParser.extractGuardian(topic, "test");

            case 15:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractGuardianText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractGuardianText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractGuardianText').returns(undefined);
              _context2.next = 34;
              return _pageparser.PageParser.extractGuardian(topic, "test");

            case 34:
              result = _context2.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractGuardianText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  (0, _mocha.describe)('extractBBC', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractBBCText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context3.next = 6;
              return _pageparser.PageParser.extractBBC(topic, "test");

            case 6:
              result = _context3.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractBBCText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns("Test article");
              _context3.next = 25;
              return _pageparser.PageParser.extractBBC(topic, "test");

            case 25:
              result = _context3.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractBBCText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context4.next = 4;
              return _pageparser.PageParser.extractBBC(topic, test_link);

            case 4:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 15;
              return _pageparser.PageParser.extractBBC(topic, "test");

            case 15:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractBBCText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractBBCText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractBBCText').returns(undefined);
              _context4.next = 34;
              return _pageparser.PageParser.extractBBC(topic, "test");

            case 34:
              result = _context4.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["BBC"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractBBCText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4);
    })));
  });
  (0, _mocha.describe)('extractReuters', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractReutersText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              test_link = 'article/test-link1/test'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sourcelinks["Reuters"] + test_link + '"</a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              _context5.next = 6;
              return _pageparser.PageParser.extractReuters(topic, "test");

            case 6:
              result = _context5.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractReutersText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns("Test article");
              _context5.next = 25;
              return _pageparser.PageParser.extractReuters(topic, "test");

            case 25:
              result = _context5.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context5.stop();
          }
        }
      }, _callee5);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractReutersText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              test_link = 'article/test-link1/test'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context6.next = 4;
              return _pageparser.PageParser.extractReuters(topic, test_link);

            case 4:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              _context6.next = 15;
              return _pageparser.PageParser.extractReuters(topic, "test");

            case 15:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractReutersText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + _preferences.sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractReutersText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractReutersText').returns(undefined);
              _context6.next = 34;
              return _pageparser.PageParser.extractReuters(topic, "test");

            case 34:
              result = _context6.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
              (0, _chai.expect)(stub_extractReutersText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context6.stop();
          }
        }
      }, _callee6);
    })));
  });
  (0, _mocha.describe)('extractSky', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractSkyText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              test_link = 'test-link1'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              _context7.next = 6;
              return _pageparser.PageParser.extractSky(topic, "test");

            case 6:
              result = _context7.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractSkyText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns("Test article");
              _context7.next = 25;
              return _pageparser.PageParser.extractSky(topic, "test");

            case 25:
              result = _context7.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context7.stop();
          }
        }
      }, _callee7);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractSkyText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              test_link = 'story/test-link1'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context8.next = 4;
              return _pageparser.PageParser.extractSky(topic, test_link);

            case 4:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              _context8.next = 15;
              return _pageparser.PageParser.extractSky(topic, "test");

            case 15:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractSkyText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + _preferences.sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractSkyText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractSkyText').returns(undefined);
              _context8.next = 34;
              return _pageparser.PageParser.extractSky(topic, "test");

            case 34:
              result = _context8.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.oneOf([_preferences.sourcelinks["Sky News"] + 'story/' + test_link, 'https://www.skysports.com/' + test_link]);
              (0, _chai.expect)(stub_extractSkyText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context8.stop();
          }
        }
      }, _callee8);
    })));
  });
  (0, _mocha.describe)('extractAP', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractAPHeadline, stub_extractAPText, result, argument1, argument2, summarise_arg;
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
              _context9.next = 7;
              return _pageparser.PageParser.extractAP(topic, "test");

            case 7:
              result = _context9.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(false);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractAPHeadline.restore();
              stub_extractAPText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns("Test headline");
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns("Test article");
              _context9.next = 29;
              return _pageparser.PageParser.extractAP(topic, "test");

            case 29:
              result = _context9.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link);
              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(true);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 45:
            case "end":
              return _context9.stop();
          }
        }
      }, _callee9);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractAPHeadline, stub_extractAPText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee10$(_context10) {
        while (1) {
          switch (_context10.prev = _context10.next) {
            case 0:
              test_link = '501c4j'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context10.next = 4;
              return _pageparser.PageParser.extractAP(topic, test_link);

            case 4:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractAPHeadline = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPHeadline').returns(undefined);
              stub_extractAPText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractAPText').returns(undefined);
              _context10.next = 16;
              return _pageparser.PageParser.extractAP(topic, "test");

            case 16:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link);
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
              _context10.next = 38;
              return _pageparser.PageParser.extractAP(topic, "test");

            case 38:
              result = _context10.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Associated Press"] + test_link);
              (0, _chai.expect)(stub_extractAPHeadline.called).to.be.equal(true);
              (0, _chai.expect)(stub_extractAPText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 50:
            case "end":
              return _context10.stop();
          }
        }
      }, _callee10);
    })));
  });
  (0, _mocha.describe)('extractEveningStandard', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractEveningStandardText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee11$(_context11) {
        while (1) {
          switch (_context11.prev = _context11.next) {
            case 0:
              test_link = 'news/test-link1.html'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              _context11.next = 6;
              return _pageparser.PageParser.extractEveningStandard(topic, "test");

            case 6:
              result = _context11.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractEveningStandardText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns("Test article");
              _context11.next = 25;
              return _pageparser.PageParser.extractEveningStandard(topic, "test");

            case 25:
              result = _context11.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context11.stop();
          }
        }
      }, _callee11);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractEveningStandardText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee12$(_context12) {
        while (1) {
          switch (_context12.prev = _context12.next) {
            case 0:
              test_link = 'news/test-link1.html'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context12.next = 4;
              return _pageparser.PageParser.extractEveningStandard(topic, test_link);

            case 4:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.called).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              _context12.next = 15;
              return _pageparser.PageParser.extractEveningStandard(topic, "test");

            case 15:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractEveningStandardText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractEveningStandardText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractEveningStandardText').returns(undefined);
              _context12.next = 34;
              return _pageparser.PageParser.extractEveningStandard(topic, "test");

            case 34:
              result = _context12.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["Evening Standard"] + test_link);
              (0, _chai.expect)(stub_extractEveningStandardText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context12.stop();
          }
        }
      }, _callee12);
    })));
  });
  (0, _mocha.describe)('extractIndependent', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractIndependentText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee13$(_context13) {
        while (1) {
          switch (_context13.prev = _context13.next) {
            case 0:
              test_link = 'test-link1.html'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              _context13.next = 6;
              return _pageparser.PageParser.extractIndependent(topic, "test");

            case 6:
              result = _context13.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractIndependentText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns("Test article");
              _context13.next = 25;
              return _pageparser.PageParser.extractIndependent(topic, "test");

            case 25:
              result = _context13.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context13.stop();
          }
        }
      }, _callee13);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractIndependentText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee14$(_context14) {
        while (1) {
          switch (_context14.prev = _context14.next) {
            case 0:
              test_link = 'test-link1.html'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context14.next = 4;
              return _pageparser.PageParser.extractIndependent(topic, test_link);

            case 4:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              _context14.next = 15;
              return _pageparser.PageParser.extractIndependent(topic, "test");

            case 15:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractIndependentText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractIndependentText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractIndependentText').returns(undefined);
              _context14.next = 34;
              return _pageparser.PageParser.extractIndependent(topic, "test");

            case 34:
              result = _context14.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["The Independent"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractIndependentText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context14.stop();
          }
        }
      }, _callee14);
    })));
  });
  (0, _mocha.describe)('extractITV', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractITVText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee15$(_context15) {
        while (1) {
          switch (_context15.prev = _context15.next) {
            case 0:
              test_link = '2020-03-03/test-link'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              _context15.next = 6;
              return _pageparser.PageParser.extractITV(topic, "test");

            case 6:
              result = _context15.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractITVText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<h1 class="update__title update__title--large">Test headline</h1><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns("Test article");
              _context15.next = 25;
              return _pageparser.PageParser.extractITV(topic, "test");

            case 25:
              result = _context15.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context15.stop();
          }
        }
      }, _callee15);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractITVText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee16$(_context16) {
        while (1) {
          switch (_context16.prev = _context16.next) {
            case 0:
              test_link = '2020-03-03/test-link'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context16.next = 4;
              return _pageparser.PageParser.extractITV(topic, test_link);

            case 4:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              _context16.next = 15;
              return _pageparser.PageParser.extractITV(topic, "test");

            case 15:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractITVText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractITVText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractITVText').returns(undefined);
              _context16.next = 34;
              return _pageparser.PageParser.extractITV(topic, "test");

            case 34:
              result = _context16.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(_preferences.sourcelinks["ITV News"] + 'news/' + test_link);
              (0, _chai.expect)(stub_extractITVText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context16.stop();
          }
        }
      }, _callee16);
    })));
  });
  (0, _mocha.describe)('extractNewsAU', function () {
    (0, _mocha.it)('Should return a valid article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17() {
      var test_link, stub_extractPageData, stub_summarise, stub_extractNewsAUText, result, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee17$(_context17) {
        while (1) {
          switch (_context17.prev = _context17.next) {
            case 0:
              test_link = _preferences.sourcelinks["News.com.au"] + topic + '/test-link1/news-story/a4vjn6'; //test link
              //Mocking a topic page with article links

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>'); //Mocking a summarised article

              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(valid_test_smmry_json); //Shouldn't call this function but stubbing to reduce execution time and to test zero calls

              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              _context17.next = 6;
              return _pageparser.PageParser.extractNewsAU(topic, "test");

            case 6:
              result = _context17.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link); //Manual article extraction shouldn't have been called

              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(false); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractNewsAUText.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns("Test article");
              _context17.next = 25;
              return _pageparser.PageParser.extractNewsAU(topic, "test");

            case 25:
              result = _context17.sent;
              //First for getting links on topic page, second for getting article page
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true); //My hacky way of determining if the result is an Article object

              (0, _chai.expect)((0, _typeof2["default"])(result)).to.be.equal((0, _typeof2["default"])(new _article.Article("test", "test", "test", "test", "test", "test", "test")));
              (0, _chai.expect)(result.allheadline).to.be.equal('Test headline');
              (0, _chai.expect)(result.headline).to.be.deep.equal(['Test headline']);
              (0, _chai.expect)(result.alltext).to.be.equal('Test article');
              (0, _chai.expect)(result.text).to.be.deep.equal(['Test article']);

            case 40:
            case "end":
              return _context17.stop();
          }
        }
      }, _callee17);
    })));
    (0, _mocha.it)('Should not return an article if an error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18() {
      var test_link, stub_extractPageData, result, argument, stub_summarise, stub_extractNewsAUText, argument1, argument2, summarise_arg;
      return _regenerator["default"].wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              test_link = _preferences.sourcelinks["News.com.au"] + topic + '/test-link1/news-story/a4vjn6'; //test link
              //No articles found

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns("");
              _context18.next = 4;
              return _pageparser.PageParser.extractNewsAU(topic, test_link);

            case 4:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.calledOnce).to.be.equal(true);
              argument = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument).to.be.equal(test_link);
              (0, _chai.expect)(result).to.be.equal(undefined); //Smmry didn't work and manual text extraction didn't work either

              stub_extractPageData.restore();
              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(undefined);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              _context18.next = 15;
              return _pageparser.PageParser.extractNewsAU(topic, "test");

            case 15:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);
              stub_extractPageData.restore();
              stub_summarise.restore();
              stub_extractNewsAUText.restore(); //Smmry did work but manual text extraction didn't

              stub_extractPageData = (0, _sinon.stub)(_pageparser.PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
              stub_summarise = (0, _sinon.stub)(_summarise.Summarise, 'summarise').returns(invalid_test_smmry_json);
              stub_extractNewsAUText = (0, _sinon.stub)(_articleextractor.ArticleExtractor, 'extractNewsAUText').returns(undefined);
              _context18.next = 34;
              return _pageparser.PageParser.extractNewsAU(topic, "test");

            case 34:
              result = _context18.sent;
              (0, _chai.expect)(stub_extractPageData.callCount).to.be.equal(2);
              argument1 = stub_extractPageData.getCall(-2).args[0];
              argument2 = stub_extractPageData.getCall(-1).args[0];
              (0, _chai.expect)(argument1).to.be.equal("test");
              (0, _chai.expect)(argument2).to.be.equal(test_link); //SMMRY should have been called

              (0, _chai.expect)(stub_summarise.called).to.be.equal(true);
              summarise_arg = stub_summarise.getCall(-1).args[0];
              (0, _chai.expect)(summarise_arg).to.be.equal(test_link);
              (0, _chai.expect)(stub_extractNewsAUText.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(undefined);

            case 45:
            case "end":
              return _context18.stop();
          }
        }
      }, _callee18);
    })));
  });
  (0, _mocha.describe)('extractPageData', function () {
    (0, _mocha.it)('Should return webpage data from the specified URL', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19() {
      var url, response, stub_ajax, result;
      return _regenerator["default"].wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              url = 'https://www.example.com';
              response = "test";
              stub_ajax = (0, _sinon.stub)($, 'ajax').returns(response);
              _context19.next = 5;
              return _pageparser.PageParser.extractPageData(url);

            case 5:
              result = _context19.sent;
              (0, _chai.expect)(stub_ajax.called).to.be.equal(true);
              (0, _chai.expect)(result).to.be.equal(response);

            case 8:
            case "end":
              return _context19.stop();
          }
        }
      }, _callee19);
    })));
  });
});
(0, _mocha.suite)('DataParser', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('textSplitter', function () {
    (0, _mocha.it)('Should split up input text into an array of sentences', function () {
      var text1 = "This is a sentence.";
      var text2 = "This is a sentence. Here is another sentence.";
      var text3 = "This is a sentence. Here is another sentence! Here's another?";
      var text4 = "Here is a very long sentence greater than 150 characters to test if the algorithm can split it up and push it all onto the array in separate chunks instead of in one go. Then another sentence to make sure it's still working!";
      var text5 = "Here is a sentence with no punctuation";
      var text6 = "Here is a sentence with abbreviations: The U.S. army and the C.I.A. were involved, as well as the F.B.I and N.A.S.A.";
      var text7 = "12.5 gallons were produced.";
      var spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');

      var result = _pageparser.DataParser.textSplitter(text1);

      (0, _chai.expect)(result).to.be.deep.equal([text1]);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text2);
      (0, _chai.expect)(result.length).to.be.equal(2);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text3);
      (0, _chai.expect)(result.length).to.be.equal(3);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text4);
      (0, _chai.expect)(result.length).to.be.equal(3);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text5);
      (0, _chai.expect)(result).to.be.deep.equal([text5]);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text6);
      (0, _chai.expect)(result).to.be.deep.equal(['Here is a sentence with abbreviations: The US army and the CIA were involved, as well as the FBI and NASA.']);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
      (0, _sinon.restore)();
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      result = _pageparser.DataParser.textSplitter(text7);
      (0, _chai.expect)(result.length).to.be.equal(1);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(true);
    });
    (0, _mocha.it)('Should return undefined if not a valid string', function () {
      var text = undefined;
      var spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      (0, _chai.expect)(_pageparser.DataParser.textSplitter(text)).to.be.equal(undefined);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(false);
      (0, _sinon.restore)();
      text = "";
      spy_abbreviationConcatenation = (0, _sinon.spy)(_pageparser.DataParser, 'abbreviationConcatenation');
      (0, _chai.expect)(_pageparser.DataParser.textSplitter(text)).to.be.equal(undefined);
      (0, _chai.expect)(spy_abbreviationConcatenation.called).to.be.equal(false);
    });
  });
  (0, _mocha.describe)('isCharacter', function () {
    (0, _mocha.it)('Should return true on valid characters', function () {
      for (var i = 0; i < _pageparser.valid_chars.length; i++) {
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(_pageparser.valid_chars[i])).to.be.equal(true);
      }

      for (var _i = 0; _i <= 9; _i++) {
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(_i.toString())).to.be.equal(true);
      }

      for (var _i2 = 0; _i2 < 26; _i2++) {
        var lower = (_i2 + 10).toString(36).toLowerCase();

        var upper = (_i2 + 10).toString(36).toUpperCase();

        (0, _chai.expect)(_pageparser.DataParser.isCharacter(lower)).to.be.equal(true);
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(lower, 'lowercase')).to.be.equal(true);
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(upper)).to.be.equal(true);
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(upper, 'uppercase')).to.be.equal(true);
      }
    });
    (0, _mocha.it)('Should return false on invalid characters', function () {
      (0, _chai.expect)(_pageparser.DataParser.isCharacter("10")).to.be.equal(false);
      (0, _chai.expect)(_pageparser.DataParser.isCharacter("1", 'lowercase')).to.be.equal(false);
      (0, _chai.expect)(_pageparser.DataParser.isCharacter("1", 'uppercase')).to.be.equal(false);
      (0, _chai.expect)(_pageparser.DataParser.isCharacter("")).to.be.equal(false);
      (0, _chai.expect)(_pageparser.DataParser.isCharacter(undefined)).to.be.equal(false);
      (0, _chai.expect)(_pageparser.DataParser.isCharacter("test")).to.be.equal(false);

      for (var i = 0; i < 26; i++) {
        var lower = (i + 10).toString(36).toLowerCase();
        var upper = (i + 10).toString(36).toUpperCase();
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(lower, 'uppercase')).to.be.equal(false);
        (0, _chai.expect)(_pageparser.DataParser.isCharacter(upper, 'lowercase')).to.be.equal(false);
      }
    });
  });
  (0, _mocha.describe)('abbreviationConcatenation', function () {
    (0, _mocha.it)('Should correctly concatenate abbreviations', function () {
      var text = "Here is a sentence with abbreviations: The U.S. army and the C.I.A. were involved, as well as the F.B.I and N.A.S.A.";
      (0, _chai.expect)(_pageparser.DataParser.abbreviationConcatenation(text)).to.be.equal("Here is a sentence with abbreviations: The US army and the CIA were involved, as well as the FBI and NASA.");
    });
    (0, _mocha.it)('Should ignore regular sentences and decimal points', function () {
      var text1 = "Here is a regular sentence. Nothing special.";
      var text2 = "12.5 gallons were produced.";
      var text3 = "Version 2.5.4 is due to be released.";
      (0, _chai.expect)(_pageparser.DataParser.abbreviationConcatenation(text1)).to.be.equal(text1);
      (0, _chai.expect)(_pageparser.DataParser.abbreviationConcatenation(text2)).to.be.equal(text2);
      (0, _chai.expect)(_pageparser.DataParser.abbreviationConcatenation(text3)).to.be.equal(text3);
    });
  });
});