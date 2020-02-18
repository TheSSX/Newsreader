import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub} from "sinon";

import {ArticleExtractor, DataCleaner} from "../dist/articleextractor.js";
const article = require('../test_articles/guardian.js');

suite('ArticleExtractor', function () {

    describe('extractGuardianText', function () {
        
        it('Should return undefined on bad headlines', function () {
            const text = '<p><strong>Test</strong></p>';
            const text1 = '<h2>Test</h2>';

            const testarray = [text, text1];

            for (let i=0; i<testarray.length; i+=1)
            {
                expect(ArticleExtractor.extractGuardianText(testarray[i])).to.be.equal(undefined);
            }
        });

        it('Should remove unnecessary content on the page', function () {
            const data = '<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body"><p>Test</p>';
            expect(ArticleExtractor.extractGuardianText(data)).to.not.contain('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body">');
        });

        it('Should return text between <p> tags', function () {
            DataCleaner.cleanText = stub().returns("This works");
            const returned = ArticleExtractor.extractGuardianText(article);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(0).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });
});


