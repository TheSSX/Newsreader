"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Speech = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _preferences = require("./preferences");

var _language_config = require("./language_config");

/**
 Class for a speech object
 */
var Speech =
/*#__PURE__*/
function () {
  /**
   * Creates an object requiring a text string to speak.
   * Takes user preferences from preferences.js
   * @param text - the string to speak
   */
  function Speech(text) {
    (0, _classCallCheck2["default"])(this, Speech);
    this.speech = new SpeechSynthesisUtterance(text);
    this.speech.lang = _language_config.dialects[_preferences.language_choice];
    this.speech.volume = _preferences.volume;
    this.speech.rate = _preferences.rate;
    this.speech.pitch = _preferences.pitch;
  }
  /**
   * Reads aloud the object's text string using speechSynthesis
   */


  (0, _createClass2["default"])(Speech, [{
    key: "speak",
    value: function speak() {
      window.speechSynthesis.speak(this.speech);
    }
  }]);
  return Speech;
}();

exports.Speech = Speech;