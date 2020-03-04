"use strict";

var _mocha = require("mocha");

var _chai = require("chai");

var _sinon = require("sinon");

var _popup = require("../dist/popup.js");

(0, _mocha.suite)('popup', function () {
  (0, _mocha.describe)('starter', function () {
    (0, _mocha.it)('Should stop any playing speech first, then send a message to start a new one', function () {
      var stub_stopper = (0, _sinon.stub)(_popup.stopper).returns(true);
      (0, _popup.starter)();
      (0, _chai.expect)(stub_stopper.calledOnce).to.be.equal(true);
    });
  });
});