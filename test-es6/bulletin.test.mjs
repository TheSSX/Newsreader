import {describe, it, xit, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, spy, restore} from "sinon";
import {PageParser, DataParser} from "../dist/js/pageparser.js";
import {Article} from "../dist/js/article.js";
import {sourcelinks, topiclinks} from "../dist/js/preferences.js";
import {Bulletin} from "../dist/js/bulletin.js";

suite('Bulletin', function () {

    afterEach(function () {
        restore();
    });

    describe('fetchNews', function () {

        //ReferenceError: SpeechSynthesisUtterance is not defined
        xit('Should select an article from each topic and read it aloud', async function () {

            const article = new Article("test", "test", ["test"], "test", "test", ["text"], "test");
            let stub_getArticle = stub(PageParser, "getArticle").resolves(article);
            let stub_retryTopic = stub(Bulletin, "retryTopic").returns(true);
            let stub_checkSentences = stub(Bulletin, "checkSentences").resolves(article);
            let stub_checkTranslation = stub(Bulletin, "checkTranslation").resolves(article);
            let stub_readArticles = stub(Bulletin, "readArticles").returns(true);

            let test_sources = {};
            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                test_sources[key] = Math.random() >= 0.5;
            }

            let test_topics = {};
            let counter = 0;
            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                const val = Math.random() >= 0.5;
                test_topics[key] = val;
                if (val)
                    counter++;
            }

            await Bulletin.fetchNews(test_sources, test_topics);
            expect(stub_getArticle.callCount).to.be.equal(counter);
            expect(stub_retryTopic.called).to.be.equal(false);
            expect(stub_checkSentences.called).to.be.equal(true);
            expect(stub_checkTranslation.called).to.be.equal(true);
            expect(stub_readArticles.called).to.be.equal(true);

            restore();

            stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            stub_retryTopic = stub(Bulletin, "retryTopic").returns(true);
            stub_checkSentences = stub(Bulletin, "checkSentences").resolves(article);
            stub_checkTranslation = stub(Bulletin, "checkTranslation").resolves(article);
            stub_readArticles = stub(Bulletin, "readArticles").returns(true);

            await Bulletin.fetchNews(test_sources, test_topics);
            expect(stub_getArticle.callCount).to.be.equal(counter);
            expect(stub_retryTopic.callCount).to.be.equal(counter);
            expect(stub_checkSentences.called).to.be.equal(true);
            expect(stub_checkTranslation.called).to.be.equal(true);
            expect(stub_readArticles.called).to.be.equal(true);
        });

        it('Should retry fetching an article for a topic if initial attempt did not succeed', function () {
            const stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            const stub_retryTopic = stub(Bulletin, "retryTopic").returns(true);

            let test_sources = {};
            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                test_sources[key] = Math.random() >= 0.5;
            }

            let test_topics = {};
            let counter = 0;
            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                const val = Math.random() >= 0.5;
                test_topics[key] = val;
                if (val)
                    counter++;
            }

            Bulletin.fetchNews(test_sources, test_topics);
            expect(stub_getArticle.callCount).to.be.equal(counter);
            expect(stub_retryTopic.callCount).to.be.equal(counter);
        });

        it('Should prevent UK topic and News.com.au being attempted', function () {

            let stub_checkNewsAUUK = stub(Bulletin, 'checkNewsAUUK').returns(true);
            let test_sources = {};
            let test_topics = {};

            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                if (key === 'News.com.au')
                    test_sources[key] = true;
                else
                    test_sources[key] = false;
            }

            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                if (key === 'uk')
                    test_sources[key] = true;
                else
                    test_sources[key] = false;
            }

            let result = Bulletin.fetchNews(test_sources, test_topics);
            expect(result).to.be.equal(false);
            expect(stub_checkNewsAUUK.called).to.be.equal(true);
        });
    });
});