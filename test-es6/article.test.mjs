import {describe, it} from "mocha";
import {expect} from "chai";

import {Article} from "../dist/article.js";

describe('Article', function () {
    it('Should instantiate properly', function () {
        const article = new Article("test", "test", "test", "test", "test");
        expect(article).to.not.be.equal(null);
    });
});