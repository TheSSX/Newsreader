import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub} from "sinon";
import {starter, stopper, pauser, resumer} from "../dist/popup.js"

suite('popup', function () {

    describe('starter', function () {

        it('Should stop any playing speech first, then send a message to start a new one', function () {
            const stub_stopper = stub(stopper).returns(true);
            starter();
            expect(stub_stopper.calledOnce).to.be.equal(true);
        });
    });
});