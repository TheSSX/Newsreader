import {describe, it} from "mocha";
import {expect} from "chai";

import {ArticleExtractor, DataCleaner} from "../dist/articleextractor.js";

describe('ArticleExtractor', function () {

    //Test 1
    it('Should return undefined on bad headlines', function () {
       const text = '<p><strong>Test</strong></p>';
       const text1 = '<h2>Test</h2>';

       const testarray = [text, text1];

       for (let i=0; i<testarray.length; i+=1)
       {
           expect(ArticleExtractor.extractGuardianText(testarray[i])).to.be.equal(undefined);
       }
    });

    //Test 2
    it('Should remove unnecessary content on the page', function () {
        let data = "test";
        expect(ArticleExtractor.extractGuardianText(data)).to.be.equal(undefined);
        data = '<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body"><p>Test</p>';
        expect(ArticleExtractor.extractGuardianText(data)).to.not.contain('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-es6-id="article-review-body">');
    });
});
