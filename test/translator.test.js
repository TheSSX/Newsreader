"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _translator = require("../dist/js/translator.js");

var _yandex = require("../dist/js/yandex.js");

(0, _mocha.suite)('Translator', function () {
  (0, _mocha.afterEach)(function () {
    (0, _sinon.restore)();
  });
  (0, _mocha.describe)('translate', function () {
    (0, _mocha.it)('Should return a translation of the input string', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var url, translation, input, language, stub_constructyandexurl, stub_contactyandex, result;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              url = 'https://www.example.com';
              translation = 'translation';
              input = 'input text';
              language = 'French';
              stub_constructyandexurl = (0, _sinon.stub)(_translator.Translator, 'constructyandexurl').returns(url);
              stub_contactyandex = (0, _sinon.stub)(_translator.Translator, 'contactyandex').returns(translation);
              _context.next = 8;
              return _translator.Translator.translate(input, language);

            case 8:
              result = _context.sent;
              (0, _chai.expect)(result).to.be.equal(translation);
              (0, _chai.expect)(stub_constructyandexurl.called).to.be.equal(true);
              (0, _chai.expect)(stub_constructyandexurl.calledWith(input, language)).to.be.equal(true);
              (0, _chai.expect)(stub_contactyandex.called).to.be.equal(true);

            case 13:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    })));
    (0, _mocha.it)('Should return undefined if an external error occurs', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var url, input, language, stub_constructyandexurl, stub_contactyandex, result;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              url = 'https://www.example.com';
              input = 'input text';
              language = 'French';
              stub_constructyandexurl = (0, _sinon.stub)(_translator.Translator, 'constructyandexurl').returns(url);
              stub_contactyandex = (0, _sinon.stub)(_translator.Translator, 'contactyandex')["throws"](new Error());
              _context2.next = 7;
              return _translator.Translator.translate(input, language);

            case 7:
              result = _context2.sent;
              (0, _chai.expect)(result).to.be.equal(undefined);
              (0, _chai.expect)(stub_constructyandexurl.called).to.be.equal(true);
              (0, _chai.expect)(stub_constructyandexurl.calledWith(input, language)).to.be.equal(true);
              (0, _chai.expect)(stub_contactyandex.called).to.be.equal(true);

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    })));
  });
  (0, _mocha.describe)('constructyandexurl', function () {
    (0, _mocha.it)('Should return the correct url for AJAX based on input parameters', function () {
      var text = 'input text';
      var targetlang = 'German';
      var expectation = "".concat(_yandex.yandexurl, "?key=").concat(_yandex.apikey, "&text=").concat(text, "&lang=").concat(targetlang);
      (0, _chai.expect)(_translator.Translator.constructyandexurl(text, targetlang)).to.be.equal(expectation);
      text = '';
      targetlang = '';
      (0, _chai.expect)(_translator.Translator.constructyandexurl(text, targetlang)).to.be.equal(undefined);
    });
  });
  (0, _mocha.describe)('contactyandex', function () {
    //ReferenceError: $ is not defined
    (0, _mocha.xit)('Should return JSON data from Yandex', /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
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
              return _translator.Translator.contactyandex(url);

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