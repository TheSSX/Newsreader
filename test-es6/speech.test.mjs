import {describe, it, xit, suite, afterEach} from "mocha";
import {expect} from "chai";
import {stub, restore} from "sinon";
import {Speech} from "../dist/js/speech.js";
import {languages} from "../dist/js/language_config.js";

suite('Speech', function () {

    afterEach(function () {
        restore();
    });

    describe('constructor', function () {

        xit('Should instantiate properly', function () {
            const text = "test";
            const language = Object.keys(languages)[Math.floor(Math.random() * Object.keys(languages).length)];
            let speech = new Speech(text, language);
            expect(speech).to.not.be.equal(null);
        });
    });

    describe('speak', function () {

        xit('Should read aloud its utterance', function () {
            const text = "test";
            const language = Object.keys(languages)[Math.floor(Math.random() * Object.keys(languages).length)];
            let stub_speak = stub(window.speechSynthesis, 'speak').returns(true);

            let speech = new Speech(text, language);
            speech.speak();
            expect(stub_speak.getCall(0).calledWithExactly(speech.speech)).to.be.equal(true);
        });
    })
});