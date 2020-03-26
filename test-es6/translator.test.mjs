import {describe, it, xit, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {restore, stub} from "sinon";
import {Translator} from "../dist/js/translator.js";
import {apikey, yandexurl} from "../dist/js/yandex.js";

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
            let stub_contactyandex = stub(Translator, 'contactyandex').returns(translation);

            let result = await Translator.translate(input, language);
            expect(result).to.be.equal(translation);
            expect(stub_constructyandexurl.called).to.be.equal(true);
            expect(stub_constructyandexurl.calledWith(input, language)).to.be.equal(true);
            expect(stub_contactyandex.called).to.be.equal(true);
        });

        it('Should return undefined if an external error occurs', async function () {
            const url = 'https://www.example.com';
            const input = 'input text';
            const language = 'French';

            stub(Translator, 'constructyandexurl').returns(url);
            stub(Translator, 'contactyandex').throws(new Error());
            let result = await Translator.translate(input, language);
            expect(result).to.be.equal(undefined);
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

    describe('contactyandex', function () {

        //ReferenceError: $ is not defined
        xit('Should return JSON data from Yandex', async function f() {
            let url = 'https://www.example.com';
            let JSON_response = {
              'success': true
            };
            let stub_ajax = stub($, 'ajax').returns(JSON_response);

            let result = await Translator.contactyandex(url);
            expect(result).to.be.deep.equal(JSON_response);
        });
    });
});