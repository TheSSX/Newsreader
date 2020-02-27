import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, spy, restore} from "sinon";
import {PageParser} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {Bulletin} from "../dist/bulletin.js";
import {ArticleExtractor, DataCleaner} from "../dist/articleextractor.js";
import {Translator} from "../dist/translator.js";
import {topics, language_choice, sources} from "../dist/preferences.js";
import {languages, translation_unavailable} from "../dist/language_config.js";
import {Speech} from "../dist/speech.js";
import {Summarise} from "../dist/summarise.js";

suite ('PageParser', function () {

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
});