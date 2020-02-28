import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, spy, restore} from "sinon";
import {PageParser, callTranslation} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {Bulletin} from "../dist/bulletin.js";
import {ArticleExtractor, DataCleaner} from "../dist/articleextractor.js";
import {Translator} from "../dist/translator.js";
import {topics, language_choice, sources} from "../dist/preferences.js";
import {languages, translation_unavailable} from "../dist/language_config.js";
import {Speech} from "../dist/speech.js";
import {Summarise} from "../dist/summarise.js";

const test_smmry_json = {
    'sm_api_title': 'test-headline',
    'sm_api_content': 'test-content',
    'sm_api_error': 0
};

suite ('PageParser', function () {

    afterEach(function () {
        restore();
    });

    describe('getArticle', function () {

        it('Should call the right function depending on the news source', function () {
            const guardianreturn = "Guardian works";
            const bbcreturn = "BBC works";
            const reutersreturn = "Reuters works";
            const skyreturn = "Sky works";
            const apreturn = "AP works";
            const eveningstandardreturn = "Evening Standard works";
            const independentreturn = "Independent works";
            const itvreturn = "ITV works";
            const newsaureturn = "News AU works";

            const stub_extractGuardian = stub(PageParser, 'extractGuardian').returns(guardianreturn);
            const stub_extractBBC = stub(PageParser, 'extractBBC').returns(bbcreturn);
            const stub_extractReuters = stub(PageParser, 'extractReuters').returns(reutersreturn);
            const stub_extractSky = stub(PageParser, 'extractSky').returns(skyreturn);
            const stub_extractAP = stub(PageParser, 'extractAP').returns(apreturn);
            const stub_extractEveningStandard = stub(PageParser, 'extractEveningStandard').returns(eveningstandardreturn);
            const stub_extractIndependent = stub(PageParser, 'extractIndependent').returns(independentreturn);
            const stub_extractITV = stub(PageParser, 'extractITV').returns(itvreturn);
            const stub_extractNewsAU = stub(PageParser, 'extractNewsAU').returns(newsaureturn);

            let argument;

            argument = PageParser.getArticle("The Guardian", "test", "test", "test");
            expect(stub_extractGuardian.called).to.be.equal(true);
            expect(argument).to.be.equal(guardianreturn);
            argument = PageParser.getArticle("BBC", "test", "test", "test");
            expect(stub_extractBBC.called).to.be.equal(true);
            expect(argument).to.be.equal(bbcreturn);
            argument = PageParser.getArticle("Reuters", "test", "test", "test");
            expect(stub_extractReuters.called).to.be.equal(true);
            expect(argument).to.be.equal(reutersreturn);
            argument = PageParser.getArticle("Sky News", "test", "test", "test");
            expect(stub_extractSky.called).to.be.equal(true);
            expect(argument).to.be.equal(skyreturn);
            argument = PageParser.getArticle("Associated Press", "test", "test", "test");
            expect(stub_extractAP.called).to.be.equal(true);
            expect(argument).to.be.equal(apreturn);
            argument = PageParser.getArticle("Evening Standard", "test", "test", "test");
            expect(stub_extractEveningStandard.called).to.be.equal(true);
            expect(argument).to.be.equal(eveningstandardreturn);
            argument = PageParser.getArticle("The Independent", "test", "test", "test");
            expect(stub_extractIndependent.called).to.be.equal(true);
            expect(argument).to.be.equal(independentreturn);
            argument = PageParser.getArticle("ITV News", "test", "test", "test");
            expect(stub_extractITV.called).to.be.equal(true);
            expect(argument).to.be.equal(itvreturn);
            argument = PageParser.getArticle("News.com.au", "test", "test", "test");
            expect(stub_extractNewsAU.called).to.be.equal(true);
            expect(argument).to.be.equal(newsaureturn);

            expect(function () {
                PageParser.getArticle("test", "test", "test", "test");
            }).to.throw(TypeError);
        });
    });

    describe('extractGuardian', function () {

        it('Should find no links on an invalid page',  async function () {

            const stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            const result = await PageParser.extractGuardian("test", "test-link", 3);
            expect(stub_extractPageData.called).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal("test-link");
            expect(result).to.be.equal(undefined);
        });

        it('Should return a valid article', async function () {

            //Should return undefined for articles of zero or less requested length
            let result = await PageParser.extractGuardian(topic, "test-link", 0);
            expect(result).to.be.equal(undefined);

            const topic = Object.keys(topics)[0];   //random topic
            const test_link = sources["The Guardian"] + topic + '/test-link1';      //test link

            //Mocking a topic page with article links
            const stub_extractPageData = stub(PageParser, 'extractPageData').returns('<p>Test</p><a href="' + test_link + '"</a><p>Test</p>');

            //Mocking a summarised article
            const stub_summarise = stub(Summarise, 'summarise').returns(test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            const stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            result = await PageParser.extractGuardian(topic, "test", 3);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            const argument1 = stub_extractPageData.getCall(-2).args[0];
            const argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);

            //Manual article extraction shouldn't have been called
            expect(stub_extractGuardianText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            expect(typeof result).to.be.equal(Article);
        });
    });
});