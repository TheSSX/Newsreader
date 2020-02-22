"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Summarise = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

/**
 * Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 * summarise the article itself.
 * Contains config info for querying the SMMRY API
 */
var smmryurl = "https://api.smmry.com/";
var apikey = "D7F33A666C";

var Summarise =
/*#__PURE__*/
function () {
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
      var _summarise = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(articleurl, sentences) {
        var url;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = this.constructsmmryurl(articleurl, sentences);
                _context.prev = 1;
                _context.next = 4;
                return this.contactsmmry(url);

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

      function summarise(_x, _x2) {
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
      return "".concat(smmryurl, "&SM_API_KEY=").concat(apikey, "&SM_LENGTH=").concat(sentences, "&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=").concat(articleurl);
    }
    /**
     * Queries SMMRY and returns JSON data
     * @param url - the GET request to SMMRY
     * @returns {*} - actually returns the JSON response from SMMRY
     */

  }, {
    key: "contactsmmry",
    value: function contactsmmry(url) {
      return $.ajax({
        url: url
      }).done(function (data) {}).fail(function (ajaxError) {});
    }
  }]);
  return Summarise;
}();

exports.Summarise = Summarise;