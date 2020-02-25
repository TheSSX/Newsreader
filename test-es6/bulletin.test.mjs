import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub} from "sinon";
import {PageParser} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {sentences, sources, topics} from "../dist/preferences.js";
import {Bulletin} from "../dist/bulletin.js";

let fake_PageParser, fake_Article;

suite('Bulletin', function () {

    beforeEach(function () {
        // fake_Article = stub(new Article("test", "test", "test", "test", "test"), "read").callsFake(function () {
        //    return true;
        // });
        fake_Article = new Article("test", "test", "test", "test", "test");
        fake_Article.read = stub(Article, "read").callsFake(function () {
           return true;
        });

        fake_PageParser = stub(PageParser, "getArticle").resolves(fake_Article);
    });

    afterEach(function () {
        fake_Article.restore();
        fake_PageParser.restore();
    });

    describe('fetchNews', function () {

        it('Should select an article from each topic and read it aloud', function () {
            Bulletin.retryTopic = stub().returns(true);
            Bulletin.fetchNews();
            expect(fake_Article.read).calledOnce();
        });
    });
});