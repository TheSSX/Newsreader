import {Article} from "../article.mjs";

const describe = require('mocha').describe;
const it = require('mocha').it;
const { expect } = require('chai');

describe('Article', function () {
    it('should be good', function () {
        const article = new Article("test", "test", "test", "test", "test")
        expect(article).to.not.be(null);
    });
});