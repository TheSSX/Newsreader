import {describe, it} from "mocha";
import {expect} from "chai";
import {stub, createStubInstance} from "sinon";
import {Speech} from "../dist/speech.js";
import {Article} from "../dist/article.js";

describe('Article', function () {

    it('Should instantiate properly', function () {
        const article = new Article("test", "test", "test", "test", "test");
        expect(article).to.not.be.equal(null);
    });
    //
    // it('Should read aloud its parameters', function () {
    //     new Article("test1", "test2", "test3", "test4", "test5").read();
    //     expect(Speech.speak.callCount).to.be.equal(4);
    //     expect(Speech.speak.getCall(0).calledWithExactly("test1")).to.be.equal(true);
    //     expect(Speech.speak.getCall(1).calledWithExactly("test2")).to.be.equal(true);
    //     expect(Speech.speak.getCall(2).calledWithExactly("test3")).to.be.equal(true);
    //     expect(Speech.speak.getCall(4).calledWithExactly("test5")).to.be.equal(true);
    // });
});