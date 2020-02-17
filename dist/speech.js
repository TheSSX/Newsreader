"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Speech = void 0;

var _preferences = require("./preferences.js");

var _language_config = require("./language_config.js");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
    _classCallCheck(this, Speech);

    this.speech = new SpeechSynthesisUtterance(text);
    this.speech.lang = _language_config.dialects[_preferences.language_choice];
    this.speech.volume = _preferences.volume;
    this.speech.rate = _preferences.rate;
    this.speech.pitch = _preferences.pitch;
  }
  /**
   * Reads aloud the object's text string using speechSynthesis
   */


  _createClass(Speech, [{
    key: "speak",
    value: function speak() {
      window.speechSynthesis.speak(this.speech);
    }
  }]);

  return Speech;
}();

exports.Speech = Speech;