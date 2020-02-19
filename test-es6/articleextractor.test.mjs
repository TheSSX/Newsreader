import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, restore} from "sinon";

import {ArticleExtractor, DataCleaner} from "../dist/articleextractor.js";
const guardian = require('../test_articles/guardian.js');
const bbc = require('../test_articles/BBC.js');
const independent = require('../test_articles/independent.js');
const ap = require('../test_articles/AP.js');
const sky = require('../test_articles/sky.js');
const reuters = require('../test_articles/reuters.js');
const eveningstandard = require('../test_articles/eveningstandard.js');

suite('ArticleExtractor', function () {

    /**
     * Stubbing DataCleaner before each test
     */
    beforeEach(function () {
        DataCleaner.cleanHTML = stub().returns("<p>Test</p>");
        DataCleaner.cleanText = stub().returns("This works");
    });

    /**
     * Removing stubs after each test
     */
    afterEach(function () {
        restore();
    });

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
            expect(ArticleExtractor.extractGuardianText(data)).to.not.be.equal(undefined);
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractGuardianText(guardian);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });




    describe('extractBBCText', function () {

        it("Should recognise pages that aren't articles", function () {
            const text = 'Test';
            expect(ArticleExtractor.extractBBCText(text)).to.be.equal(undefined);
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractBBCText(bbc);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });




    describe('extractIndependentText', function () {

        it('Should return undefined on bad headlines', function () {
            const text = '<p><strong>Test</strong></p>';
            const text1 = '<h2><span class="title">Test</span></h2>';

            const testarray = [text, text1];

            for (let i=0; i<testarray.length; i+=1)
            {
                expect(ArticleExtractor.extractIndependentText(testarray[i])).to.be.equal(undefined);
            }
        });

        it('Should remove unnecessary content on the page', function () {
            let data = '<div class="body-content"><p>Test</p>';
            expect(ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
            data = '<div class="body-content"><p>Test</p><div class="article-bottom">';
            expect(ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
            data = '<div class="body-content"><p>Test</p><div class="partners" id="partners">';
            expect(ArticleExtractor.extractIndependentText(data)).to.not.be.equal(undefined);
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractIndependentText(independent);
            expect(DataCleaner.cleanHTML.calledOnce);
            expect(DataCleaner.cleanText.calledOnce);
            const argument1 = DataCleaner.cleanHTML.getCall(-1).args[0];
            const argument2 = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument1).to.not.be.equal(undefined);
            expect(argument2).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });




    describe('extractReutersText', function () {

        it('Should return text between <p> tags', function () {
            DataCleaner.cleanText = stub().returns("Reuters - This worksAll quotes delayed a minimum of 15 minutes");
            const returned = ArticleExtractor.extractReutersText(reuters);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.be.equal("This works");
        });
    });




    describe('extractAPText', function () {

        it('Should return text between <p> tags', function () {
            DataCleaner.cleanText = stub().returns("(AP) — This works");
            const returned = ArticleExtractor.extractAPText(ap);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.be.equal("This works");
        });
    });




    describe('extractSkyText', function () {

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractSkyText(sky);
            expect(DataCleaner.cleanText.calledOnce);
            const argument = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });




    describe('extractEveningStandardText', function () {

        it('Should remove unnecessary content on the page', function () {
            let data = '<p>Update newsletter preferences</p><p>Test</p>';
            expect(ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
            data = '<div class="body-content"><p>Test</p>';
            expect(ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
            data = '<div class="body-content"><p>Test</p><aside class="tags">';
            expect(ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
            data = '<div class="body-content"><p>Test</p><div class="share-bar-syndication">';
            expect(ArticleExtractor.extractEveningStandardText(data)).to.not.be.equal(undefined);
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractEveningStandardText(eveningstandard);
            expect(DataCleaner.cleanHTML.calledOnce);
            expect(DataCleaner.cleanText.calledOnce);
            const argument1 = DataCleaner.cleanHTML.getCall(-1).args[0];
            const argument2 = DataCleaner.cleanText.getCall(-1).args[0];
            expect(argument1).to.not.be.equal(undefined);
            expect(argument2).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });
});