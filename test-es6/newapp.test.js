import {Article} from "../dist/article.js";
import {describe, it} from "mocha";
import {expect} from "chai";
import {assert} from "chai";

describe('Article', function () {
    it('should be good', function () {
        const article = new Article("test", "test", "test", "test", "test");
        assert(article).to.not.be(null);
    });
});