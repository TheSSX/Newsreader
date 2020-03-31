import {describe, it, xit, suite, beforeEach, afterEach, before} from "mocha";
import {expect} from "chai";
import {restore, stub} from "sinon";
import {Translator} from "../dist/js/translator.js";
import {apikey, yandexurl} from "../dist/js/yandex.js";
import {PageParser} from "../dist/js/pageparser.js";

suite('Translator', function () {

    afterEach(function () {
        restore();
    });

    describe('translate', function () {

        it('Should return a translation of the input string', async function () {
            const url = 'https://www.example.com';
            const translation = 'translation';
            const input = 'input text';
            const language = 'French';

            const stub_constructyandexurl = stub(Translator, 'constructyandexurl').returns(url);
            let stub_extractPageData = stub(PageParser, 'extractPageData').returns(translation);

            let result = await Translator.translate(input, language);
            expect(result).to.be.equal(translation);
            expect(stub_constructyandexurl.called).to.be.equal(true);
            expect(stub_constructyandexurl.calledWith(input, language)).to.be.equal(true);
            expect(stub_extractPageData.called).to.be.equal(true);
        });

        it('Should return undefined if an external error occurs', async function () {
            const url = 'https://www.example.com';
            const input = 'input text';
            const language = 'French';

            let stub_constructyandexurl = stub(Translator, 'constructyandexurl').returns(url);
            let stub_extractPageData = stub(PageParser, 'extractPageData').throws(new Error());
            let result = await Translator.translate(input, language);
            expect(result).to.be.equal(undefined);
            expect(stub_constructyandexurl.called).to.be.equal(true);
            expect(stub_constructyandexurl.calledWith(input, language)).to.be.equal(true);
            expect(stub_extractPageData.called).to.be.equal(true);
        });
    });

    describe('constructyandexurl', function () {

        it('Should return the correct url for AJAX based on input parameters', function () {
            let text = 'input text';
            let targetlang = 'German';
            const expectation = `${yandexurl}?key=${apikey}&text=${text}&lang=${targetlang}`;
            expect(Translator.constructyandexurl(text, targetlang)).to.be.equal(expectation);

            text = '';
            targetlang = '';
            expect(Translator.constructyandexurl(text, targetlang)).to.be.equal(undefined);
        });
    });
});