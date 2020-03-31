import {describe, it, xit, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {restore, stub} from "sinon";
import {Speech} from "../dist/js/speech.js";
import {Article} from "../dist/js/article.js";
import {min_sentences, max_sentences} from "../dist/js/preferences.js";
import {JSDOM} from "jsdom";
const jsdom = require('jsdom-global')();
//require('mocha-jsdom')({skipWindowCheck: true, url: "http://localhost"});

suite('Article', function () {

    afterEach(function () {
        restore();
        jsdom();
    });

    describe('constructor', function () {
        it('Should instantiate properly', function () {
            let article = new Article("test", "test", "test", ["test"], "test", "test", ["test"], "French", 3);
            expect(article).to.not.be.equal(null);
            article = new Article("test", "test", "test", ["test"], "test", "test", ["test"]);
            expect(article).to.not.be.equal(null);
        });
    });

    describe('read', function () {
        xit('Should read aloud its parameters', function () {

            const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
            const oldwindow = global.window;
            global.window = dom.window;

            stub(global.window, 'SpeechSynthesisUtterance');
            stub(Speech.prototype, 'speak').returns(true);
            new Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", ["array-text"]).read();
            expect(Speech.prototype.speak.callCount).to.be.equal(4);
            expect(Speech.prototype.speak.getCall(0).calledWithExactly("publisher")).to.be.equal(true);
            expect(Speech.prototype.speak.getCall(1).calledWithExactly("topic")).to.be.equal(true);
            expect(Speech.prototype.speak.getCall(2).calledWithExactly("string-headline")).to.be.equal(true);
            expect(Speech.prototype.speak.getCall(4).calledWithExactly("string-text")).to.be.equal(true);

            global.window = oldwindow;
        });
    });

    describe('amendLength', function () {

        const short_article = [
            'This article has 6 sentences.',
            'Here is a sentence.',
            'Here is another.',
            'This should work fine.',
            'In this case, all fields end in a period.',
            'So the basic functionality will work.'
        ];

        const long_article = [
          'This article also has 6 sentences but they are',
          ' broken up for testing purposes and',
          ' to see the effect.',
          'It also makes use of ',
          'various other punctuation!',
          'Here is a regular sentence.',
          'Hello?',
          'Can you still ',
          'hear me?',
          'Okay good, I was just',
          ' checking.'
        ];

        it('Should change the number of sentences in the text field', function () {

            let article = new Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", short_article);
            expect(article.originalText).to.be.deep.equal(short_article);
            expect(article.text.length).to.be.equal(short_article.length);
            let newLength = 4;
            article.amendLength(newLength);
            expect(article.text.length).to.be.equal(newLength);
            expect(article.originalText.length).to.be.equal(short_article.length);
            newLength = 5;
            article.amendLength(newLength);
            expect(article.text.length).to.be.equal(newLength);
            expect(article.originalText.length).to.be.equal(short_article.length);

            article = new Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", long_article);
            expect(article.originalText).to.be.deep.equal(long_article);
            expect(article.text.length).to.be.equal(long_article.length);
            newLength = 2;
            article.amendLength(newLength);
            expect(article.text.length).to.be.equal(5);
            expect(article.originalText.length).to.be.equal(long_article.length);
            newLength = 6;
            article.amendLength(newLength);
            expect(article.text.length).to.be.equal(long_article.length);
            expect(article.originalText.length).to.be.equal(long_article.length);
        });

        it('Should do nothing with a length outside the global range', function () {

            const article = new Article("publisher", "topic", "string-headline", ["array-headline"], "link", "string-text", short_article);
            let newLength = min_sentences - 1;
            let oldtext = article.text;
            let oldoriginaltext = article.originalText;
            article.amendLength(newLength);
            expect(article.text).to.be.deep.equal(oldtext);
            expect(article.originalText).to.be.deep.equal(oldoriginaltext);
            newLength = max_sentences + 1;
            oldtext = article.text;
            oldoriginaltext = article.originalText;
            article.amendLength(newLength);
            expect(article.text).to.be.deep.equal(oldtext);
            expect(article.originalText).to.be.deep.equal(oldoriginaltext);
        });
    });
});