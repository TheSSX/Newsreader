import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, mock} from "sinon";
import {PageParser} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {sentences, sources, topics} from "../dist/preferences.js";
import {Bulletin} from "../dist/bulletin.js";

let fake_getArticle, fake_Article, fake_read;

suite('Bulletin', function () {

    // beforeEach(function () {
    //     // fake_Article = stub(new Article("test", "test", "test", "test", "test"), "read").callsFake(function () {
    //     //    return true;
    //     // });
    //     fake_Article = new Article("test", "test", "test", "test", "test");
    //     fake_read = stub(fake_Article, "read").callsFake(function () {
    //        return true;
    //     });
    //
    //     fake_getArticle = stub(PageParser, "getArticle").resolves(fake_Article);
    // });
    //
    // afterEach(function () {
    //     fake_read.restore();
    //     fake_getArticle.restore();
    //     fake_Article = undefined;
    // });

    describe('fetchNews', function () {

        it('Should select an article from each topic and read it aloud', function () {
            Bulletin.retryTopic = stub().returns(true);
            PageParser.getArticle = stub().resolves(new Article("test", "test", "test", "test", "test"));

            Bulletin.fetchNews();
            expect(PageParser.getArticle.callCount).to.be.equal(9);     // 9 topics
            expect(Bulletin.retryTopic.called).to.be.equal(false);
        });
    });
});