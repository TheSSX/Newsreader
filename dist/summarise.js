"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Summarise = void 0;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    _classCallCheck(this, Summarise);
  }

  _createClass(Summarise, null, [{
    key: "summarise",

    /**
     * Receives a URL to an article and the number of sentences to summarise down to
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<void>} - the JSON response from SMMRY
     */
    value: function () {
      var _summarise = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(articleurl, sentences) {
        var url;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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