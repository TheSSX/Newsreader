"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Translator = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _yandex = require("./yandex");

/**
 Class for translating articles via the Yandex free translation service.
 Yandex offers one million free characters translated every day.
 */
var Translator =
/*#__PURE__*/
function () {
  function Translator() {
    (0, _classCallCheck2["default"])(this, Translator);
  }

  (0, _createClass2["default"])(Translator, null, [{
    key: "translate",

    /**
     * Manages the translation of text to a target language
     * @param text - the text to translate
     * @param targetlang - the target language to translate to
     * @returns {Promise<undefined>} - the JSON response from Yandex
     */
    value: function () {
      var _translate = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(text, targetlang) {
        var url;
        return _regenerator["default"].wrap(function _callee$(_context) {
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