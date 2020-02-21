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
const itv = require('../test_articles/itv.js');
const newscomau = require('../test_articles/newscomau.js');

let fake_cleanHTML, fake_cleanText;

suite('ArticleExtractor', function () {

    /**
     * Stubbing DataCleaner before each test
     */
    beforeEach(function () {
        fake_cleanHTML  = stub(DataCleaner, "cleanHTML").callsFake(function () {
           return "<p>Test</p>";
        });
        fake_cleanText  = stub(DataCleaner, "cleanText").callsFake(function () {
           return "This works";
        });
        //DataCleaner.cleanHTML = stub().returns("<p>Test</p>");    //these worked okay but couldn't get them to restore
        //DataCleaner.cleanText = stub().returns("This works");
    });

    /**
     * Removing stubs after each test
     */
    afterEach(function () {
        fake_cleanHTML.restore();
        fake_cleanText.restore();
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
            expect(fake_cleanText.calledOnce);
            const argument = fake_cleanText.getCall(-1).args[0];
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
            expect(fake_cleanText.calledOnce);
            const argument = fake_cleanText.getCall(-1).args[0];
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
            expect(fake_cleanHTML.calledOnce);
            expect(fake_cleanText.calledOnce);
            const argument1 = fake_cleanHTML.getCall(-1).args[0];
            const argument2 = fake_cleanText.getCall(-1).args[0];
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
            expect(fake_cleanText.calledOnce);
            const argument = fake_cleanText.getCall(-1).args[0];
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
            expect(fake_cleanHTML.calledOnce);
            expect(fake_cleanText.calledOnce);
            const argument1 = fake_cleanHTML.getCall(-1).args[0];
            const argument2 = fake_cleanText.getCall(-1).args[0];
            expect(argument1).to.not.be.equal(undefined);
            expect(argument2).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });

    describe('extractITVText', function () {

        it('Should remove unnecessary content on the page', function () {
            let data = '<article class="update"><p>Test</p>';
            expect(ArticleExtractor.extractITVText(data)).to.not.be.equal(undefined);
            data = '<article class="update"><p>Test</p><div className="update__share">';
            expect(ArticleExtractor.extractITVText(data)).to.not.be.equal(undefined);
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractITVText(itv);
            expect(fake_cleanHTML.calledOnce);
            expect(fake_cleanText.calledOnce);
            const argument1 = fake_cleanHTML.getCall(-1).args[0];
            const argument2 = fake_cleanText.getCall(-1).args[0];
            expect(argument1).to.not.be.equal(undefined);
            expect(argument2).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });

    describe('extractAUStart', function () {

        it('Should remove unnecessary content on the page', function () {
            let data = '<p class="description">Test</p>';
            expect(ArticleExtractor.extractAUStart(data)).to.be.equal("Test");
            data = 'Test';
            expect(ArticleExtractor.extractAUStart(data)).to.be.equal("");
        });
    });

    describe('extractAUEnd', function () {

        it('Should remove unnecessary content on the page', function () {
            let data = 'Test';
            expect(ArticleExtractor.extractAUEnd(data)).to.be.equal("");
            //data = '<div class="story-content"><p>Test</p>';
            //expect(ArticleExtractor.extractAUEnd(data)).to.be.equal("");
            data = '<div class="story-content"><p>Test</p><div id="share-and-comment">';
            expect(ArticleExtractor.extractAUEnd(data)).to.not.be.equal("");
        });

        it('Should return text between <p> tags', function () {
            const returned = ArticleExtractor.extractAUEnd(newscomau);
            expect(fake_cleanHTML.calledOnce);
            expect(fake_cleanText.calledOnce);
            const argument1 = fake_cleanHTML.getCall(-1).args[0];
            const argument2 = fake_cleanText.getCall(-1).args[0];
            expect(argument1).to.not.be.equal('');
            expect(argument2).to.not.be.equal("");
            expect(returned).to.equal("This works");
        });
    });

    describe('extractNewsAUText', function () {

        it('Should return undefined with no data', function () {
           expect(ArticleExtractor.extractNewsAUText(undefined)).to.be.equal(undefined);
        });

        it('Should return the concatenation of the start and end of article', function () {
            ArticleExtractor.extractAUStart = stub().returns("This");
            ArticleExtractor.extractAUEnd = stub().returns("works");
            expect(ArticleExtractor.extractNewsAUText("Test")).to.be.equal("This works");
        });
    });
});

suite('DataCleaner', function () {

    describe('cleanHTML', function () {

        it('Should remove <figure> elements', function () {
            let text = '<figure><div class="test"></div></figure>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<figure class="test"><div class="test-again"></figure>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<figure class="test">Test</figure>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
        });

        it('Should remove <footer> elements', function () {
            let text = '<footer><div class="test"></div></footer>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<footer class="test"><div class="test-again"></footer>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<footer class="test">Test</footer>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
        });

        it('Should remove <span> elements', function () {
            let text = '<span><div class="test"></div></span>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<span class="test"><div class="test-again"></span>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
            text = '<span class="test">Test</span>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
        });

        it('Should remove <p><em> elements', function () {
            const text = '<p><em>Test</em></p>';
            expect(DataCleaner.cleanHTML(text)).to.be.equal("");
        });
    });

    describe('cleanText', function () {

        it('Should remove HTML tags', function () {
            const text = '<header>1</header><body><figure><div class="test"><p>2</p></div></figure><article><br><button>3</button></article></body><footer>4</footer>';
            expect(DataCleaner.cleanText(text)).to.be.equal("1234");
        });

        it('Should replace invalid characters with their correct ones', function () {
            let text = '&#x2013;';
            expect(DataCleaner.cleanText(text)).to.be.equal("-");
            text = '&#x201D;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"');

            text = '&#x2018;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"');
            text = '&#x2019;';
            expect(DataCleaner.cleanText(text)).to.be.equal("'");
            text = '&#x201C;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"');
            text = '&amp;';
            expect(DataCleaner.cleanText(text)).to.be.equal('&');
            text = '&#x2026;';
            expect(DataCleaner.cleanText(text)).to.be.equal('...');
            text = '&#x2022;';
            expect(DataCleaner.cleanText(text)).to.be.equal('•');
            text = '&#x200B;';
            expect(DataCleaner.cleanText(text)).to.be.equal('');
            text = '&#x2014;';
            expect(DataCleaner.cleanText(text)).to.be.equal('-');
            text = '&#xF3;';
            expect(DataCleaner.cleanText(text)).to.be.equal('ó');
            text = '&#39;';
            expect(DataCleaner.cleanText(text)).to.be.equal("'");
            text = '&quot;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"');
            text = '&nbsp;';
            expect(DataCleaner.cleanText(text)).to.be.equal(' ');
            text = ' span>';
            expect(DataCleaner.cleanText(text)).to.be.equal('');
            text = '&#163;';
            expect(DataCleaner.cleanText(text)).to.be.equal('£');
            text = '&#8364;';
            expect(DataCleaner.cleanText(text)).to.be.equal('€');
            text = 'Sharing the full story, not just the headlines';
            expect(DataCleaner.cleanText(text)).to.be.equal('');
            text = '&rsquo;Test&rsquo;';
            expect(DataCleaner.cleanText(text)).to.be.equal("'Test'");
            text = '&lsquo;Test&lsquo;';
            expect(DataCleaner.cleanText(text)).to.be.equal("'Test'");
            text = '&ldquo;Test&ldquo;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"Test"');
            text = '&rdquo;Test&rdquo;';
            expect(DataCleaner.cleanText(text)).to.be.equal('"Test"');
            text = '   Test   ';
            expect(DataCleaner.cleanText(text)).to.be.equal('Test');
            text = 'Test   here';
            expect(DataCleaner.cleanText(text)).to.be.equal('Test here');
        });
    });
});