import {describe, it} from "mocha";
import {expect} from "chai";
import {stub} from "sinon";
import {Speech} from "../dist/speech.js";

import {Article} from "../dist/article.js";

describe('Article', function () {

    it('Should instantiate properly', function () {
        const article = new Article("test", "test", "test", "test", "test");
        expect(article).to.not.be.equal(null);
    });

    it('Should read aloud its parameters', function () {
        const fake_read = stub(Speech, "speech").callsFake(function () {
           return true;
        });
        new Article("test1", "test2", "test3", "test4", "test5").read();
        expect(fake_read.callCount).to.be.equal(4);
        expect(fake_read.getCall(0).calledWithExactly("test1")).to.be.equal(true);
        expect(fake_read.getCall(1).calledWithExactly("test2")).to.be.equal(true);
        expect(fake_read.getCall(2).calledWithExactly("test3")).to.be.equal(true);
        expect(fake_read.getCall(4).calledWithExactly("test5")).to.be.equal(true);
    });
});