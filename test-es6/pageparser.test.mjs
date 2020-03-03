import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, restore} from "sinon";
import {PageParser} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {ArticleExtractor} from "../dist/articleextractor.js";
import {topics, sources} from "../dist/preferences.js";
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

const topic = Object.keys(topics)[Math.floor(Math.random() * Object.keys(topics).length)];   //random topic

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

            const test_link = sources["The Guardian"] + topic + '/test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');

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

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
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

            const test_link = sources["The Guardian"] + topic + '/test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractGuardian(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractGuardian(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
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
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
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

            const test_link = 'test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');

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

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
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

            const test_link = 'test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractBBC(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractBBC(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
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
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
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

    describe('extractReuters', function () {

        it('Should return a valid article', async function () {

            const test_link = 'article/test-link1/test';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sources["Reuters"] + test_link + '"</a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractReuters(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractReutersText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractReutersText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sources["Reuters"] + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns("Test article");

            result = await PageParser.extractReuters(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractReutersText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'article/test-link1/test';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractReuters(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractReuters(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sources["Reuters"] + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            result = await PageParser.extractReuters(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractReutersText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractReutersText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sources["Reuters"] + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            result = await PageParser.extractReuters(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractReutersText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractSky', function () {

        it('Should return a valid article', async function () {

            const test_link = 'test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractSky(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            //expect(summarise_arg1).to.be.equal(sources["Sky News"] + 'story/' +  test_link);
            expect(summarise_arg1).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractSkyText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractSkyText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns("Test article");

            result = await PageParser.extractSky(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractSkyText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'story/test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractSky(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractSky(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            result = await PageParser.extractSky(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractSkyText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractSkyText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sources["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            result = await PageParser.extractSky(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.oneOf([sources["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractSkyText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });
    describe('extractAP', function () {

        it('Should return a valid article', async function () {

            const test_link = '501c4j';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns(undefined);
            let stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractAP(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Associated Press"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractAPHeadline.called).to.be.equal(false);
            expect(stub_extractAPText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractAPHeadline.restore();
            stub_extractAPText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns("Test headline");
            stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns("Test article");

            result = await PageParser.extractAP(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Associated Press"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractAPHeadline.called).to.be.equal(true);
            expect(stub_extractAPText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = '501c4j';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractAP(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractAP(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns(undefined);
            let stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns(undefined);

            result = await PageParser.extractAP(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Associated Press"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractAPHeadline.called).to.be.equal(true);
            expect(stub_extractAPText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractAPHeadline.restore();
            stub_extractAPText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns(undefined);
            stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns(undefined);

            result = await PageParser.extractAP(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Associated Press"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractAPHeadline.called).to.be.equal(true);
            expect(stub_extractAPText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractEveningStandard', function () {

        it('Should return a valid article', async function () {

            const test_link = 'news/test-link1.html';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractEveningStandard(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Evening Standard"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractEveningStandardText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractEveningStandardText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns("Test article");

            result = await PageParser.extractEveningStandard(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Evening Standard"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractEveningStandardText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'news/test-link1.html';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractEveningStandard(topic, test_link, 3);
            expect(stub_extractPageData.called).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractEveningStandard(topic, test_link, 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns(undefined);

            result = await PageParser.extractEveningStandard(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Evening Standard"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractEveningStandardText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractEveningStandardText.restore();



            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns(undefined);

            result = await PageParser.extractEveningStandard(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["Evening Standard"] + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractEveningStandardText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractIndependent', function () {

        it('Should return a valid article', async function () {

            const test_link = 'test-link1.html';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractIndependent(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["The Independent"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractIndependentText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractIndependentText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns("Test article");

            result = await PageParser.extractIndependent(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["The Independent"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractIndependentText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'test-link1.html';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractIndependent(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractIndependent(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns(undefined);

            result = await PageParser.extractIndependent(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["The Independent"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractIndependentText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractIndependentText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns(undefined);

            result = await PageParser.extractIndependent(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["The Independent"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractIndependentText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractITV', function () {

        it('Should return a valid article', async function () {

            const test_link = '2020-03-03/test-link';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractITV(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["ITV News"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            //Manual article extraction shouldn't have been called
            expect(stub_extractITVText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractITVText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns("Test article");

            result = await PageParser.extractITV(topic, "test", sentences);

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["ITV News"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractITVText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = '2020-03-03/test-link';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractITV(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractITV(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns(undefined);

            result = await PageParser.extractITV(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg1 = stub_summarise.getCall(-1).args[0];
            let summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["ITV News"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractITVText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractITVText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns(undefined);

            result = await PageParser.extractITV(topic, "test", sentences);
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sources["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg1 = stub_summarise.getCall(-1).args[0];
            summarise_arg2 = stub_summarise.getCall(-1).args[1];
            expect(summarise_arg1).to.be.equal(sources["ITV News"] + 'news/' + test_link);
            expect(summarise_arg2).to.be.equal(sentences);

            expect(stub_extractITVText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractNewsAU', function () {

        it('Should return a valid article', async function () {

            const test_link = sources["News.com.au"] + topic + '/test-link1/news-story/a4vjn6';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            let sentences = 4;

            //Can't figure this out at all
            //TypeError: (0 , _sinon.stub)(...).resolves is not a function
            //const stub_callTranslation = stub(callTranslation).resolves(undefined);

            let result = await PageParser.extractNewsAU(topic, "test", sentences);

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
            expect(stub_extractNewsAUText.called).to.be.equal(false);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractNewsAUText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns("Test article");

            result = await PageParser.extractNewsAU(topic, "test", sentences);

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

            expect(stub_extractNewsAUText.called).to.be.equal(true);

            //expect(stub_callTranslation.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test"));
            expect(result.title).to.be.equal('Test headline');
            expect(result.text).to.be.equal('Not enough summary credits! Test article');
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = sources["News.com.au"] + topic + '/test-link1/news-story/a4vjn6';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractNewsAU(topic, test_link, 3);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);


            //Zero or fewer sentences requested in article
            result = await PageParser.extractNewsAU(topic, "test", 0);
            expect(result).to.be.equal(undefined);


            //Smmry didn't work and manual text extraction didn't work either
            const sentences = 3;
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            result = await PageParser.extractNewsAU(topic, "test", sentences);
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

            expect(stub_extractNewsAUText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractNewsAUText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            result = await PageParser.extractNewsAU(topic, "test", sentences);
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

            expect(stub_extractNewsAUText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });
});