"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _summarise = require("../dist/js/summarise.js");

var _preferences = require("../dist/js/preferences.js");

(0, _mocha.suite)('Summarise', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('summarise', function () {
    (0, _mocha.it)('Should return a summarised article', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var url, smmryurl, summary, stub_constructsmmryurl, stub_contactsmmry, sentences, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = 'https://www.example.com';
              smmryurl = 'https://www.smmry.com';
              summary = 'summary';
              stub_constructsmmryurl = (0, _sinon.stub)(_summarise.Summarise, 'constructsmmryurl').returns(smmryurl);
              stub_contactsmmry = (0, _sinon.stub)(_summarise.Summarise, 'contactsmmry').returns(summary);
              sentences = _preferences.max_sentences - 1;
              _context.next = 8;
              return _summarise.Summarise.summarise(url);

            case 8:
              result = _context.sent;
              (0, _chai.expect)(result).to.be.equal(summary);
              (0, _chai.expect)(stub_constructsmmryurl.called).to.be.equal(true);
              (0, _chai.expect)(stub_constructsmmryurl.calledWith(url, _preferences.max_sentences)).to.be.equal(true);
              (0, _chai.expect)(stub_contactsmmry.called).to.be.equal(true);
              stub_constructsmmryurl.restore();
              stub_contactsmmry.restore();
              stub_constructsmmryurl = (0, _sinon.stub)(_summarise.Summarise, 'constructsmmryurl').returns(smmryurl);
              stub_contactsmmry = (0, _sinon.stub)(_summarise.Summarise, 'contactsmmry').returns(summary);
              _context.next = 19;
              return _summarise.Summarise.summarise(url, sentences);

            case 19:
              result = _context.sent;
              (0, _chai.expect)(result).to.be.equal(summary);
              (0, _chai.expect)(stub_constructsmmryurl.called).to.be.equal(true);
              (0, _chai.expect)(stub_constructsmmryurl.calledWith(url, sentences)).to.be.equal(true);
              (0, _chai.expect)(stub_contactsmmry.called).to.be.equal(true);

            case 24:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _mocha.it)('Should return undefined if an external error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var url, smmryurl, stub_constructsmmryurl, stub_contactsmmry, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = 'https://www.example.com';
              smmryurl = 'https://www.smmry.com';
              stub_constructsmmryurl = (0, _sinon.stub)(_summarise.Summarise, 'constructsmmryurl').returns(smmryurl);
              stub_contactsmmry = (0, _sinon.stub)(_summarise.Summarise, 'contactsmmry')["throws"](new Error());
              _context2.next = 6;
              return _summarise.Summarise.summarise(url);

            case 6:
              result = _context2.sent;
              (0, _chai.expect)(result).to.be.equal(undefined);
              (0, _chai.expect)(stub_constructsmmryurl.called).to.be.equal(true);
              (0, _chai.expect)(stub_constructsmmryurl.calledWith(url, _preferences.max_sentences)).to.be.equal(true);
              (0, _chai.expect)(stub_contactsmmry.called).to.be.equal(true);

            case 11:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  (0, _mocha.describe)('constructsmmryurl', function () {
    (0, _mocha.it)('Should return the correct url for AJAX based on input parameters', function () {
      var articleurl = 'https://www.example.com';
      var sentences = _preferences.max_sentences - 1;
      var expectation = "".concat(_summarise.smmryurl, "&SM_API_KEY=").concat(_summarise.apikey, "&SM_LENGTH=").concat(sentences, "&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=").concat(articleurl);
      (0, _chai.expect)(_summarise.Summarise.constructsmmryurl(articleurl, sentences)).to.be.equal(expectation);
      articleurl = '';
      sentences = _preferences.max_sentences + 1;
      (0, _chai.expect)(_summarise.Summarise.constructsmmryurl(articleurl, sentences)).to.be.equal(undefined);
    });
  });
  (0, _mocha.describe)('contactsmmry', function () {
    //ReferenceError: $ is not defined
    (0, _mocha.xit)('Should return JSON data from Smmry', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
      var url, JSON_response, stub_ajax, result;
      return _regenerator["default"].wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              url = 'https://www.example.com';
              JSON_response = {
                'success': true
              };
              stub_ajax = (0, _sinon.stub)($, 'ajax').returns(JSON_response);
              _context3.next = 5;
              return _summarise.Summarise.contactsmmry(url);

            case 5:
              result = _context3.sent;
              (0, _chai.expect)(result).to.be.deep.equal(JSON_response);

            case 7:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    })));
  });
});