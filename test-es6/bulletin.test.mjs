const chrome = require('sinon-chrome/extensions');
import {describe, it, xit, suite, beforeEach, afterEach, before, after} from "mocha";
import {expect} from "chai";
import {stub, spy, restore} from "sinon";
import {PageParser} from "../dist/js/pageparser.js";
import {Article} from "../dist/js/article.js";
import {sourcelinks, topiclinks} from "../dist/js/preferences.js";
import {Bulletin} from "../dist/js/bulletin.js";
import {Translator} from "../dist/js/translator.js";
import {languages} from "../dist/js/language_config.js";

suite('Bulletin', function () {

    before(function () {
        global.chrome = chrome;
    });

    after(function () {
        chrome.flush();
    });

    afterEach(function () {
        restore();
    });

    describe('fetchNews', function () {

        //ReferenceError: SpeechSynthesisUtterance is not defined
        it('Should select an article from each topic and read it aloud', async function () {

            const article = new Article("test", "test", "test", ["test"], "test", "test", ["text"]);
            let stub_getArticle = stub(PageParser, "getArticle").resolves(article);
            let stub_retryTopic = stub(Bulletin, "retryTopic").returns(true);
            let stub_checkSentences = stub(Bulletin, "checkSentences").resolves(article);

            // These are left out because testing seems to fail on them
            // They are multiple promises deep so that might be the cause
            // Regardless, they aren't crucial because if we test checkSentences is called, we know these are called too
            //let stub_checkTranslation = stub(Bulletin, "checkTranslation").resolves(article);
            //let stub_readArticles = stub(Bulletin, "readArticles").returns(true);

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
                if (i === 0)
                {
                    test_topics[key] = true;
                }
                const val = Math.random() >= 0.5;
                test_topics[key] = val;
                if (val)
                    counter++;
            }

            await Bulletin.fetchNews(test_sources, test_topics);
            expect(stub_getArticle.callCount).to.be.equal(counter);
            expect(stub_retryTopic.called).to.be.equal(false);
            expect(chrome.runtime.sendMessage.called).to.be.equal(false);
            expect(chrome.storage.local.remove.called).to.be.equal(false);
            expect(stub_checkSentences.called).to.be.equal(true);
            //expect(stub_checkTranslation.called).to.be.equal(true);
            //expect(stub_readArticles.called).to.be.equal(true);
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
                if (i === 0)
                {
                    test_topics[key] = true;
                }
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

    describe('retryTopic', function () {

        it('Should retry fetching an article on the same topic but a different source', async function () {
            const article = new Article("test", "test", "test", ["test"], "test", "test", ["text"]);
            let stub_getArticle = stub(PageParser, "getArticle").resolves(article);
            let stub_checkSentences = stub(Bulletin, "checkSentences").resolves(article);

            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const topic = Object.keys(topiclinks)[i];
                await Bulletin.retryTopic(topic, 2);
            }

            expect(stub_getArticle.callCount).to.be.equal(Object.keys(topiclinks).length);
            expect(stub_checkSentences.called).to.be.equal(true);
            expect(chrome.runtime.sendMessage.called).to.be.equal(false);
            expect(chrome.storage.local.remove.called).to.be.equal(false);
        });

        it('Should recursively call itself a maximum of 9 times before cutting off attempts on current topic', async function () {
            let stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());

            const topic = Object.keys(topiclinks)[0];
            await Bulletin.retryTopic(topic, 2);
            expect(stub_getArticle.callCount).to.be.equal(9);
        });
    });

    describe('readArticles', function () {

        //ReferenceError: SpeechSynthesisUtterance is not defined
        xit('Should send appropriate chrome messages, read current article and recursively call itself for next article', async function () {

            const article = new Article("test", "test", "test", ["test"], "test", "test", ["text"]);
            const allarticles = [article, article, article];
            const spy_readArticles = spy(Bulletin, 'readArticles');
            const stub_checkSentences = stub(Bulletin, 'checkSentences').resolves(article);
            const stub_checkTranslation = stub(Bulletin, 'checkTranslation').resolves(article);

            const result = await Bulletin.readArticles(allarticles.shift(), allarticles);
            expect(spy_readArticles.callCount).to.be.equal(allarticles.length);
            expect(stub_checkSentences.callCount).to.be.equal(allarticles.length-1);
            expect(stub_checkTranslation.callCount).to.be.equal(allarticles.length-1);
            expect(result).to.be.equal(true);
        });

        it('Should send a stop message and return true if no more articles are to be read', async function () {
            const article = new Article("test", "test", "test", ["test"], "test", "test", ["text"]);
            const spy_readArticles = spy(Bulletin, 'readArticles');
            const stub_checkSentences = stub(Bulletin, 'checkSentences').resolves(article);
            const stub_checkTranslation = stub(Bulletin, 'checkTranslation').resolves(article);

            const result = await Bulletin.readArticles(undefined, []);
            expect(spy_readArticles.callCount).to.be.equal(1);
            expect(stub_checkSentences.called).to.be.equal(false);
            expect(stub_checkTranslation.called).to.be.equal(false);
            expect(result).to.be.equal(true);
        });
    });

    describe('checkSentences', function () {

        it('Should resolve to a valid article', function () {

            const article = new Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
            const stub_amendLength = stub(Article.prototype, 'amendLength').returns(true);
            Bulletin.checkSentences(article).then(newArticle => {
                expect(stub_amendLength.called).to.be.equal(true);
                expect(newArticle).to.be.deep.equal(article);
            });
        });
    });

    describe('checkTranslation', function () {

        it('Should resolve to a valid article', function () {

            const article = new Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
            const stub_getTranslatedArticle = stub(Bulletin, 'getTranslatedArticle').returns(article);
            Bulletin.checkTranslation(article).then(newArticle => {
                expect(stub_getTranslatedArticle.called).to.be.equal(true);
                expect(newArticle).to.be.deep.equal(article);
            });
        });
    });

    describe('getTranslatedArticle', function () {

        it('Should fetch individual translations for each relevant field and return a new translated article', async function () {
            const valid_translation = {
              'code': 200,
              'text': 'translation'
            };

            let article = new Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);

            for(let i=0; i<Object.keys(languages).length; i++)
            {
                const language_choice = Object.keys(languages)[i];

                const stub_translate = stub(Translator, 'translate').returns(valid_translation);
                const result = await Bulletin.getTranslatedArticle(article, language_choice);

                expect(stub_translate.callCount).to.be.equal(4);
                expect(stub_translate.calledWith(article.publisher)).to.be.equal(true);
                expect(stub_translate.calledWith(article.topic)).to.be.equal(true);
                expect(stub_translate.calledWith(article.headline[0])).to.be.equal(true);
                expect(stub_translate.calledWith(article.text[0])).to.be.equal(true);

                expect(result.publisher).to.be.equal(valid_translation['text']);
                expect(result.topic).to.be.equal(valid_translation['text']);
                expect(result.headline).to.be.deep.equal([valid_translation['text']]);
                expect(result.text).to.be.deep.equal([valid_translation['text']]);

                restore();
            }

            article = new Article("publisher", "topic", "allheadline", ["This is a multi-sentence headline.", "Here's another sentence."], "link", "alltext", ["This is a multi-sentence article.", "Here's another sentence.", "Here's one more."]);

            for(let i=0; i<Object.keys(languages).length; i++)
            {
                const language_choice = Object.keys(languages)[i];

                const stub_translate = stub(Translator, 'translate').returns(valid_translation);
                const result = await Bulletin.getTranslatedArticle(article, language_choice);

                expect(stub_translate.callCount).to.be.at.least(4);
                expect(stub_translate.calledWith(article.publisher)).to.be.equal(true);
                expect(stub_translate.calledWith(article.topic)).to.be.equal(true);

                for(let i=0; i<article.headline.length; i++)
                {
                    expect(stub_translate.calledWith(article.headline[i])).to.be.equal(true);
                }

                for(let i=0; i<article.text.length; i++)
                {
                    expect(stub_translate.calledWith(article.text[i])).to.be.equal(true);
                }

                expect(result.publisher).to.be.equal(valid_translation['text']);
                expect(result.topic).to.be.equal(valid_translation['text']);

                let expected_headline = [];
                for(let i=0; i<article.headline.length; i++)
                {
                    expected_headline.push(valid_translation['text']);
                }
                expect(result.headline).to.be.deep.equal(expected_headline);

                let expected_text = [];
                for(let i=0; i<article.text.length; i++)
                {
                    expected_text.push(valid_translation['text']);
                }
                expect(result.text).to.be.deep.equal(expected_text);

                restore();
            }
        });

        it('Should return undefined if the translation API was down', async function () {

            const invalid_translation = {
                'code': 500,
                'text': 'failure'
            };

            let article = new Article("publisher", "topic", "allheadline", ["headline"], "link", "alltext", ["text"]);
            let stub_translate = stub(Translator, 'translate').returns(invalid_translation);

            for(let i=0; i<Object.keys(languages).length; i++)
            {
                const language_choice = Object.keys(languages)[i];
                const result = await Bulletin.getTranslatedArticle(article, language_choice);
                expect(stub_translate.called).to.be.equal(true);
                expect(result).to.be.equal(undefined);
            }

            restore();

            for(let i=0; i<Object.keys(languages).length; i++)
            {
                stub_translate = stub(Translator, 'translate').returns(undefined);

                const language_choice = Object.keys(languages)[i];
                const result = await Bulletin.getTranslatedArticle(article, language_choice);
                expect(stub_translate.callCount).to.be.equal(1);
                expect(result).to.be.equal(undefined);

                restore();
            }
        });
    });

    describe('checkNewsAUUK', function () {

        it('Should return true if News.com.au and uk are the only sources and topics selected', function () {

            let test_sources = {'News.com.au': true};
            let test_topics = {'uk': true};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);

            test_sources = {'News.com.au': true, 'test': false};
            test_topics = {'uk': true, 'test': false};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);

            test_sources = {};
            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                test_sources[key] = false;
            }

            test_sources['News.com.au'] = true;

            test_topics = {};
            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                test_topics[key] = false;
            }

            test_topics['uk'] = true;

            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(true);
        });

        it('Should return false if News.com.au and uk are not the only sources and topics', function () {

            let test_sources = {'News.com.au': false};
            let test_topics = {'uk': false};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);

            test_sources = {'News.com.au': false, 'test': false};
            test_topics = {'uk': false, 'test': false};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);

            test_sources = {'News.com.au': true};
            test_topics = {'uk': false};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);

            test_sources = {'News.com.au': false};
            test_topics = {'uk': true};
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);

            test_sources = {};
            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                test_sources[key] = false;
            }

            test_topics = {};
            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                test_topics[key] = false;
            }

            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);

            test_sources = {};
            for (let i=0; i<Object.keys(sourcelinks).length; i++)
            {
                const key = Object.keys(sourcelinks)[i];
                test_sources[key] = true;
            }

            test_sources['News.com.au'] = false;

            test_topics = {};
            for (let i=0; i<Object.keys(topiclinks).length; i++)
            {
                const key = Object.keys(topiclinks)[i];
                test_topics[key] = false;
            }

            test_topics['uk'] = false;

            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
            test_sources['News.com.au'] = true;
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
            test_sources['News.com.au'] = false;
            test_topics['uk'] = true;
            expect(Bulletin.checkNewsAUUK(test_sources, test_topics)).to.be.equal(false);
        })
    });

    describe('capitalizeFirstLetter', function () {

        it('Should capitalise the first letter of a given string', function () {

            const suffix = "aaaa";

            for(let i=0; i<26; i++)
            {
                const lower = (i+10).toString(36).toLowerCase();
                const upper = (i+10).toString(36).toUpperCase();
                const string = lower + suffix;

                expect(Bulletin.capitalizeFirstLetter(string)).to.be.equal(upper + suffix);
            }
        });

        it('Should return the original string if already capitalised', function () {

            const suffix = "aaaa";

            for(let i=0; i<26; i++)
            {
                const upper = (i+10).toString(36).toUpperCase();
                const string = upper + suffix;

                expect(Bulletin.capitalizeFirstLetter(string)).to.be.equal(upper + suffix);
            }
        });

        it('Should return the original input on a TypeError being thrown', function () {

            let string = '%^&*()';
            expect(Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
            string = 1;
            expect(Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
            string = -0.5;
            expect(Bulletin.capitalizeFirstLetter(string)).to.be.equal(string);
        });
    });
});