"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translator = void 0;

var _yandex = require("./yandex.js");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 Class for translating articles via the Yandex free translation service.
 Yandex offers one million free characters translated every day.
 */
var Translator =
/*#__PURE__*/
function () {
  function Translator() {
    _classCallCheck(this, Translator);
  }

  _createClass(Translator, null, [{
    key: "translate",

    /**
     * Manages the translation of text to a target language
     * @param text - the text to translate
     * @param targetlang - the target language to translate to
     * @returns {Promise<undefined>} - the JSON response from Yandex
     */
    value: function () {
      var _translate = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(text, targetlang) {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.constructyandexurl(text, targetlang);
                _context.prev = 1;
                _context.next = 4;
                return this.contactyandex(url);

              case 4:
                return _context.abrupt("return", _context.sent);

              case 7:
                _context.prev = 7;
                _context.t0 = _context["catch"](1);
                return _context.abrupt("return", undefined);

              case 10:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 7]]);
      }));

      function translate(_x, _x2) {
        return _translate.apply(this, arguments);
      }

      return translate;
    }()
    /**
     * Constructs the GET request for querying the Yandex API
     * @param text - the text to translate
     * @param targetlang - the target language to translate to
     * @returns {string} - the constructed URL
     */

  }, {
    key: "constructyandexurl",
    value: function constructyandexurl(text, targetlang) {
      return "".concat(_yandex.yandexurl, "?key=").concat(_yandex.apikey, "&text=").concat(text, "&lang=").concat(targetlang);
    }
    /**
     * Queries Yandex and returns JSON data
     * @param url - the URL to query
     * @returns {*} - the JSON data
     */

  }, {
    key: "contactyandex",
    value: function contactyandex(url) {
      return $.ajax({
        url: url
      }).done(function (data) {}).fail(function (ajaxError) {});
    }
  }]);

  return Translator;
}();

exports.Translator = Translator;