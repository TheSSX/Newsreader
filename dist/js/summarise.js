"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Summarise = exports.apikey = exports.smmryurl = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _preferences = require("./preferences.js");

var _pageparser = require("../../dist/js/pageparser");

/**
 * Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 * summarise the article itself.
 * Contains config info for querying the SMMRY API
 */
var smmryurl = "https://api.smmry.com/";
exports.smmryurl = smmryurl;
var apikey = "D7F33A666C";
exports.apikey = apikey;

var Summarise = /*#__PURE__*/function () {
  function Summarise() {
    (0, _classCallCheck2["default"])(this, Summarise);
  }

  (0, _createClass2["default"])(Summarise, null, [{
    key: "summarise",

    /**
     * Receives a URL to an article and the number of sentences to summarise down to
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<void>} - the JSON response from SMMRY
     */
    value: function () {
      var _summarise = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(articleurl) {
        var sentences,
            url,
            _args = arguments;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                sentences = _args.length > 1 && _args[1] !== undefined ? _args[1] : _preferences.max_sentences;
                url = this.constructsmmryurl(articleurl, sentences);
                _context.prev = 2;
                _context.next = 5;
                return _pageparser.PageParser.extractPageData(url);

              case 5:
                return _context.abrupt("return", _context.sent);

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](2);
                return _context.abrupt("return", undefined);

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[2, 8]]);
      }));

      function summarise(_x) {
        return _summarise.apply(this, arguments);
      }

      return summarise;
    }()
    /**
     * Inserts given parameters into a URL through which to query SMMRY over HTTP
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {string} - the exact HTTP URL to send
     */

  }, {
    key: "constructsmmryurl",
    value: function constructsmmryurl(articleurl, sentences) {
      if (!articleurl || !sentences) return undefined;
      return "".concat(smmryurl, "&SM_API_KEY=").concat(apikey, "&SM_LENGTH=").concat(sentences, "&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=").concat(articleurl);
    }
  }]);
  return Summarise;
}();

exports.Summarise = Summarise;