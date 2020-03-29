import {describe, it, xit, suite, afterEach} from "mocha";
import {expect} from "chai";
import {stub, restore, spy} from "sinon";
import {PageParser, DataParser, valid_chars} from "../dist/js/pageparser.js";
import {Article} from "../dist/js/article.js";
import {ArticleExtractor} from "../dist/js/articleextractor.js";
import {topiclinks, sourcelinks} from "../dist/js/preferences.js";
import {Summarise} from "../dist/js/summarise.js";

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

const topic = Object.keys(topiclinks)[Math.floor(Math.random() * Object.keys(topiclinks).length)];   //random topic

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

            argument = PageParser.getArticle("The Guardian", "test", "test");
            expect(stub_extractGuardian.called).to.be.equal(true);
            expect(argument).to.be.equal(guardianreturn);
            argument = PageParser.getArticle("BBC", "test", "test");
            expect(stub_extractBBC.called).to.be.equal(true);
            expect(argument).to.be.equal(bbcreturn);
            argument = PageParser.getArticle("Reuters", "test", "test");
            expect(stub_extractReuters.called).to.be.equal(true);
            expect(argument).to.be.equal(reutersreturn);
            argument = PageParser.getArticle("Sky News", "test", "test");
            expect(stub_extractSky.called).to.be.equal(true);
            expect(argument).to.be.equal(skyreturn);
            argument = PageParser.getArticle("Associated Press", "test", "test");
            expect(stub_extractAP.called).to.be.equal(true);
            expect(argument).to.be.equal(apreturn);
            argument = PageParser.getArticle("Evening Standard", "test", "test");
            expect(stub_extractEveningStandard.called).to.be.equal(true);
            expect(argument).to.be.equal(eveningstandardreturn);
            argument = PageParser.getArticle("The Independent", "test", "test");
            expect(stub_extractIndependent.called).to.be.equal(true);
            expect(argument).to.be.equal(independentreturn);
            argument = PageParser.getArticle("ITV News", "test", "test");
            expect(stub_extractITV.called).to.be.equal(true);
            expect(argument).to.be.equal(itvreturn);
            argument = PageParser.getArticle("News.com.au", "test", "test");
            expect(stub_extractNewsAU.called).to.be.equal(true);
            expect(argument).to.be.equal(newsaureturn);

            expect(function () {
                PageParser.getArticle("test", "test", "test");
            }).to.throw(TypeError);
        });
    });

    describe('extractGuardian', function () {

        it('Should return a valid article', async function () {

            const test_link = sourcelinks["The Guardian"] + topic + '/test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            let result = await PageParser.extractGuardian(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractGuardianText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", DataParser.textSplitter("test"), "test", "test", DataParser.textSplitter("test"), "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractGuardianText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns("Test article");

            result = await PageParser.extractGuardian(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            expect(stub_extractGuardianText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = sourcelinks["The Guardian"] + topic + '/test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractGuardian(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);




            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            result = await PageParser.extractGuardian(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            expect(stub_extractGuardianText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractGuardianText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Guardian</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractGuardianText = stub(ArticleExtractor, 'extractGuardianText').returns(undefined);

            result = await PageParser.extractGuardian(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

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

            let result = await PageParser.extractBBC(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractBBCText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractBBCText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns("Test article");

            result = await PageParser.extractBBC(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            expect(stub_extractBBCText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractBBC(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns(undefined);

            result = await PageParser.extractBBC(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            expect(stub_extractBBCText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractBBCText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - BBC News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p><div role="region"></div>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractBBCText = stub(ArticleExtractor, 'extractBBCText').returns(undefined);

            result = await PageParser.extractBBC(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["BBC"] + 'news/' + test_link);

            expect(stub_extractBBCText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractReuters', function () {

        it('Should return a valid article', async function () {

            const test_link = 'article/test-link1/test';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sourcelinks["Reuters"] + test_link + '"</a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            let result = await PageParser.extractReuters(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            //Manual article extraction shouldn't have been called
            expect(stub_extractReutersText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractReutersText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns("Test article");

            result = await PageParser.extractReuters(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            expect(stub_extractReutersText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'article/test-link1/test';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractReuters(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            result = await PageParser.extractReuters(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            expect(stub_extractReutersText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractReutersText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Reuters</title><p>Test</p><a href="/' + test_link + '"></a><a href="' + sourcelinks["Reuters"] + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractReutersText = stub(ArticleExtractor, 'extractReutersText').returns(undefined);

            result = await PageParser.extractReuters(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Reuters"] + test_link, 'https://uk.reuters.com/' + test_link]);

            expect(stub_extractReutersText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractSky', function () {

        it('Should return a valid article', async function () {

            const test_link = 'test-link1';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            let result = await PageParser.extractSky(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);

            //Manual article extraction shouldn't have been called
            expect(stub_extractSkyText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractSkyText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns("Test article");

            result = await PageParser.extractSky(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);

            expect(stub_extractSkyText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'story/test-link1';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractSky(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            result = await PageParser.extractSky(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);

            expect(stub_extractSkyText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractSkyText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | Sky News</title><p>Test</p><a href="' + sourcelinks["Sky News"] + 'story/' + test_link + '"></a><a class="news-list__headline-link" href="https://www.skysports.com/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractSkyText = stub(ArticleExtractor, 'extractSkyText').returns(undefined);

            result = await PageParser.extractSky(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);


            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.oneOf([sourcelinks["Sky News"] + 'story/' +  test_link, 'https://www.skysports.com/' + test_link]);

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

            let result = await PageParser.extractAP(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Associated Press"] + test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractAPHeadline.called).to.be.equal(false);
            expect(stub_extractAPText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractAPHeadline.restore();
            stub_extractAPText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns("Test headline");
            stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns("Test article");

            result = await PageParser.extractAP(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Associated Press"] + test_link);

            expect(stub_extractAPHeadline.called).to.be.equal(true);
            expect(stub_extractAPText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = '501c4j';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractAP(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - Associated Press</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractAPHeadline = stub(ArticleExtractor, 'extractAPHeadline').returns(undefined);
            let stub_extractAPText = stub(ArticleExtractor, 'extractAPText').returns(undefined);

            result = await PageParser.extractAP(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Associated Press"] + test_link);

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

            result = await PageParser.extractAP(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Associated Press"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Associated Press"] + test_link);

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

            let result = await PageParser.extractEveningStandard(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractEveningStandardText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractEveningStandardText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns("Test article");

            result = await PageParser.extractEveningStandard(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            expect(stub_extractEveningStandardText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'news/test-link1.html';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractEveningStandard(topic, test_link);
            expect(stub_extractPageData.called).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns(undefined);

            result = await PageParser.extractEveningStandard(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            expect(stub_extractEveningStandardText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractEveningStandardText.restore();



            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | London Evening Standard</title><p>Test</p><a href="/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractEveningStandardText = stub(ArticleExtractor, 'extractEveningStandardText').returns(undefined);

            result = await PageParser.extractEveningStandard(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["Evening Standard"] + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["Evening Standard"] + test_link);

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

            let result = await PageParser.extractIndependent(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractIndependentText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractIndependentText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns("Test article");

            result = await PageParser.extractIndependent(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            expect(stub_extractIndependentText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = 'test-link1.html';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractIndependent(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns(undefined);

            result = await PageParser.extractIndependent(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            expect(stub_extractIndependentText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractIndependentText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline | The Independent</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractIndependentText = stub(ArticleExtractor, 'extractIndependentText').returns(undefined);

            result = await PageParser.extractIndependent(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["The Independent"] + 'news/' + test_link);

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

            let result = await PageParser.extractITV(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractITVText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractITVText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<h1 class="update__title update__title--large">Test headline</h1><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns("Test article");

            result = await PageParser.extractITV(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            expect(stub_extractITVText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = '2020-03-03/test-link';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractITV(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            let argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns(undefined);

            result = await PageParser.extractITV(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            expect(stub_extractITVText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractITVText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline - ITV News</title><p>Test</p><a href="/news/' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractITVText = stub(ArticleExtractor, 'extractITVText').returns(undefined);

            result = await PageParser.extractITV(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(sourcelinks["ITV News"] + 'news/' + test_link);

            expect(stub_extractITVText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractNewsAU', function () {

        it('Should return a valid article', async function () {

            const test_link = sourcelinks["News.com.au"] + topic + '/test-link1/news-story/a4vjn6';      //test link

            //Mocking a topic page with article links
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');

            //Mocking a summarised article
            let stub_summarise = stub(Summarise, 'summarise').returns(valid_test_smmry_json);

            //Shouldn't call this function but stubbing to reduce execution time and to test zero calls
            let stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            let result = await PageParser.extractNewsAU(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            //Manual article extraction shouldn't have been called
            expect(stub_extractNewsAUText.called).to.be.equal(false);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));



            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractNewsAUText.restore();

            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns("Test article");

            result = await PageParser.extractNewsAU(topic, "test");

            //First for getting links on topic page, second for getting article page
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            expect(stub_extractNewsAUText.called).to.be.equal(true);

            //My hacky way of determining if the result is an Article object
            expect(typeof result).to.be.equal(typeof new Article("test", "test", "test", "test", "test", "test", "test"));
            expect(result.allheadline).to.be.equal('Test headline');
            expect(result.headline).to.be.deep.equal(['Test headline']);
            expect(result.alltext).to.be.equal('Test article');
            expect(result.text).to.be.deep.equal(['Test article']);
        });

        it('Should not return an article if an error occurs', async function () {

            const test_link = sourcelinks["News.com.au"] + topic + '/test-link1/news-story/a4vjn6';      //test link

            //No articles found
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns("");

            let result = await PageParser.extractNewsAU(topic, test_link);
            expect(stub_extractPageData.calledOnce).to.be.equal(true);
            const argument = stub_extractPageData.getCall(-1).args[0];
            expect(argument).to.be.equal(test_link);
            expect(result).to.be.equal(undefined);



            //Smmry didn't work and manual text extraction didn't work either
            stub_extractPageData.restore();
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            let stub_summarise = stub(Summarise, 'summarise').returns(undefined);
            let stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            result = await PageParser.extractNewsAU(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            let argument1 = stub_extractPageData.getCall(-2).args[0];
            let argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            let summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            expect(stub_extractNewsAUText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);

            stub_extractPageData.restore();
            stub_summarise.restore();
            stub_extractNewsAUText.restore();


            //Smmry did work but manual text extraction didn't
            stub_extractPageData = stub(PageParser, 'extractPageData').returns('<title>Test headline</title><p>Test</p><a href="' + test_link + '"></a><p>Test</p>');
            stub_summarise = stub(Summarise, 'summarise').returns(invalid_test_smmry_json);
            stub_extractNewsAUText = stub(ArticleExtractor, 'extractNewsAUText').returns(undefined);

            result = await PageParser.extractNewsAU(topic, "test");
            expect(stub_extractPageData.callCount).to.be.equal(2);
            argument1 = stub_extractPageData.getCall(-2).args[0];
            argument2 = stub_extractPageData.getCall(-1).args[0];
            expect(argument1).to.be.equal("test");
            expect(argument2).to.be.equal(test_link);

            //SMMRY should have been called
            expect(stub_summarise.called).to.be.equal(true);
            summarise_arg = stub_summarise.getCall(-1).args[0];
            expect(summarise_arg).to.be.equal(test_link);

            expect(stub_extractNewsAUText.called).to.be.equal(true);
            expect(result).to.be.equal(undefined);
        });
    });

    describe('extractPageData', function () {

        xit('Should return webpage data from the specified URL', async function () {
            let url = 'https://www.example.com';
            let response = "test";
            let stub_ajax = stub($, 'ajax').returns(response);

            let result = await Summarise.contactsmmry(url);
            expect(result).to.be.equal(response);
        });
    });
});

suite('DataParser', function () {

    afterEach(function () {
        restore();
    });

    describe('textSplitter', function () {

        it('Should split up input text into an array of sentences', function () {
            const text1 = "This is a sentence.";
            const text2 = "This is a sentence. Here is another sentence.";
            const text3 = "This is a sentence. Here is another sentence! Here's another?";
            const text4 = "Here is a very long sentence greater than 150 characters to test if the algorithm can split it up and push it all onto the array in separate chunks instead of in one go. Then another sentence to make sure it's still working!";
            const text5 = "Here is a sentence with no punctuation";
            const text6 = "Here is a sentence with abbreviations: The U.S. army and the C.I.A. were involved, as well as the F.B.I and N.A.S.A.";
            const text7 = "12.5 gallons were produced.";

            let spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');

            let result = DataParser.textSplitter(text1);
            expect(result).to.be.deep.equal([text1]);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text2);
            expect(result.length).to.be.equal(2);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text3);
            expect(result.length).to.be.equal(3);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text4);
            expect(result.length).to.be.equal(3);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text5);
            expect(result).to.be.deep.equal([text5]);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text6);
            expect(result).to.be.deep.equal(['Here is a sentence with abbreviations: The US army and the CIA were involved, as well as the FBI and NASA.']);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);

            restore();

            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            result = DataParser.textSplitter(text7);
            expect(result.length).to.be.equal(1);
            expect(spy_abbreviationConcatenation.called).to.be.equal(true);
        });

        it('Should return undefined if not a valid string', function () {
            let text = undefined;
            let spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            expect(DataParser.textSplitter(text)).to.be.equal(undefined);
            expect(spy_abbreviationConcatenation.called).to.be.equal(false);

            restore();

            text = "";
            spy_abbreviationConcatenation = spy(DataParser, 'abbreviationConcatenation');
            expect(DataParser.textSplitter(text)).to.be.equal(undefined);
            expect(spy_abbreviationConcatenation.called).to.be.equal(false);
        });
    });

    describe('isCharacter', function () {

        it('Should return true on valid characters', function () {
            for (let i=0; i<valid_chars.length; i++)
                expect(DataParser.isCharacter(valid_chars[i])).to.be.equal(true);

            for (let i=0; i<=9; i++)
                expect(DataParser.isCharacter(i.toString())).to.be.equal(true);

            for (let i=0; i<26; i++)
            {
                const lower = (i+10).toString(36).toLowerCase();
                const upper = (i+10).toString(36).toUpperCase();
                expect(DataParser.isCharacter(lower)).to.be.equal(true);
                expect(DataParser.isCharacter(lower, 'lowercase')).to.be.equal(true);
                expect(DataParser.isCharacter(upper)).to.be.equal(true);
                expect(DataParser.isCharacter(upper, 'uppercase')).to.be.equal(true);
            }
        });

        it('Should return false on invalid characters', function () {
            expect(DataParser.isCharacter("10")).to.be.equal(false);
            expect(DataParser.isCharacter("1", 'lowercase')).to.be.equal(false);
            expect(DataParser.isCharacter("1", 'uppercase')).to.be.equal(false);
            expect(DataParser.isCharacter("")).to.be.equal(false);
            expect(DataParser.isCharacter(undefined)).to.be.equal(false);
            expect(DataParser.isCharacter("test")).to.be.equal(false);

            for (let i=0; i<26; i++)
            {
                const lower = (i+10).toString(36).toLowerCase();
                const upper = (i+10).toString(36).toUpperCase();
                expect(DataParser.isCharacter(lower, 'uppercase')).to.be.equal(false);
                expect(DataParser.isCharacter(upper, 'lowercase')).to.be.equal(false);
            }
        });
    });

    describe('abbreviationConcatenation', function () {

        it('Should correctly concatenate abbreviations', function () {
            const text = "Here is a sentence with abbreviations: The U.S. army and the C.I.A. were involved, as well as the F.B.I and N.A.S.A.";
            expect(DataParser.abbreviationConcatenation(text)).to.be.equal("Here is a sentence with abbreviations: The US army and the CIA were involved, as well as the FBI and NASA.");
        });

        it('Should ignore regular sentences and decimal points', function () {
            const text1 = "Here is a regular sentence. Nothing special.";
            const text2 = "12.5 gallons were produced.";
            const text3 = "Version 2.5.4 is due to be released.";

            expect(DataParser.abbreviationConcatenation(text1)).to.be.equal(text1);
            expect(DataParser.abbreviationConcatenation(text2)).to.be.equal(text2);
            expect(DataParser.abbreviationConcatenation(text3)).to.be.equal(text3);
        });
    });
});