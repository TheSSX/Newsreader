import {describe, it, xit, suite, beforeEach, afterEach, before} from "mocha";
import {expect} from "chai";
import {restore, stub} from "sinon";
import {Summarise} from "../dist/js/summarise.js";
import {max_sentences} from "../dist/js/preferences.js";
import {smmryurl, apikey} from "../dist/js/summarise.js";
import {PageParser} from "../dist/js/pageparser.js";

suite('Summarise', function () {

    afterEach(function () {
        restore();
    });

    describe('summarise', function () {

        it('Should return a summarised article', async function () {
            const url = 'https://www.example.com';
            const smmryurl = 'https://www.smmry.com';
            const summary = 'summary';
            let stub_constructsmmryurl = stub(Summarise, 'constructsmmryurl').returns(smmryurl);
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns(summary);
            let sentences = max_sentences - 1;

            let result = await Summarise.summarise(url);
            expect(result).to.be.equal(summary);
            expect(stub_constructsmmryurl.called).to.be.equal(true);
            expect(stub_constructsmmryurl.calledWith(url, max_sentences)).to.be.equal(true);
            expect(stub_extractPageData.called).to.be.equal(true);

            stub_constructsmmryurl.restore();
            stub_extractPageData.restore();

            stub_constructsmmryurl = stub(Summarise, 'constructsmmryurl').returns(smmryurl);
            stub_extractPageData = stub(PageParser, 'extractPageData').returns(summary);

            result = await Summarise.summarise(url, sentences);
            expect(result).to.be.equal(summary);
            expect(stub_constructsmmryurl.called).to.be.equal(true);
            expect(stub_constructsmmryurl.calledWith(url, sentences)).to.be.equal(true);
            expect(stub_extractPageData.called).to.be.equal(true);
        });

        it('Should return undefined if an external error occurs', async function () {
            const url = 'https://www.example.com';
            const smmryurl = 'https://www.smmry.com';
            let stub_constructsmmryurl = stub(Summarise, 'constructsmmryurl').returns(smmryurl);
            let stub_extractPageData = stub(PageParser, 'extractPageData').throws(new Error());

            const result = await Summarise.summarise(url);
            expect(result).to.be.equal(undefined);
            expect(stub_constructsmmryurl.called).to.be.equal(true);
            expect(stub_constructsmmryurl.calledWith(url, max_sentences)).to.be.equal(true);
            expect(stub_extractPageData.called).to.be.equal(true);
        });
    });

    describe('constructsmmryurl', function () {

        it('Should return the correct url for AJAX based on input parameters', function () {
            let articleurl = 'https://www.example.com';
            let sentences = max_sentences - 1;
            const expectation = `${smmryurl}&SM_API_KEY=${apikey}&SM_LENGTH=${sentences}&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=${articleurl}`;
            expect(Summarise.constructsmmryurl(articleurl, sentences)).to.be.equal(expectation);

            articleurl = '';
            sentences = max_sentences + 1;
            expect(Summarise.constructsmmryurl(articleurl, sentences)).to.be.equal(undefined);
        });
    });
});