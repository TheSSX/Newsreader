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

const valid_test_smmry_json = {
    'sm_api_title': 'test-headline',
    'sm_api_content': 'test-content',
    'sm_api_error': 0
};

const invalid_test_smmry_json = {
    'sm_api_title': 'test-headline',
    'sm_api_content': 'test-content',
    'sm_api_error': 2
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

        it('Should return a valid article', async function () {

            const topic = Object.keys(topics)[0];   //random topic
            const test_link = sources["The Guardian"] + topic + '/test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<p>Test</p><a href="' + test_link + '"</a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractGuardian(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractGuardianText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractGuardianText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns("Test article");

            result = await PageParser.extractGuardian(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractGuardianText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const topic = Object.keys(topics)[0];   //random topic
            const test_link = sources["The Guardian"] + topic + '/test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractGuardian(topic, test_link, 3);
            expect(stub_extractPageData.called).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractGuardian(topic, test_link, 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            result = await PageParser.extractGuardian(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractGuardianText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractGuardianText.restore();



            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"</a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            result = await PageParser.extractGuardian(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractGuardianText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractBBC', function () {

        it('Should return a valid article', async function () {

            const topic = Object.keys(topics)[0];   //random topic
            const test_link = 'test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractBBC(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["BBC"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractBBCText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractBBCText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns("Test article");

            result = await PageParser.extractBBC(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["BBC"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractBBCText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const topic = Object.keys(topics)[0];   //random topic
            const test_link = 'test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractBBC(topic, test_link, 3);
            expect(stub_extractPageData.called).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractBBC(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns(undefined);

            result = await PageParser.extractBBC(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["BBC"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractBBCText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractBBCText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"</a><p>Test</p><div role="region"></div>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns(undefined);

            result = await PageParser.extractBBC(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["BBC"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractBBCText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });
});