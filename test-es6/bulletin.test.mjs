import {describe, it, suite, beforeEach, afterEach} from "mocha";
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

        // TODO finish this off by trying to stub read of Article
        // Currently getting error TypeError: Cannot stub non-existent own property read
        // Articles online indicating a module called proxyquire might be needed
        it('Should select an article from each topic and read it aloud', function () {

            const stub_retryTopic = stub(Bulletin, "retryTopic").callsFake(function () {
                return true;
            });

            let stub_getArticle = stub(PageParser, "getArticle").resolves(new Article("test", "test", DataParser.textSplitter("test"), "test", "test", DataParser.textSplitter("test"), "test"));

            Bulletin.fetchNews(sourcelinks, topiclinks);
            expect(stub_getArticle.callCount).to.be.equal(Object.keys(topiclinks).length);
            expect(stub_retryTopic.called).to.be.equal(false);

            stub_getArticle.restore();
            stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            Bulletin.fetchNews(sourcelinks, topiclinks);
            expect(stub_getArticle.callCount).to.be.equal(Object.keys(topiclinks).length);
            expect(stub_retryTopic.called).to.be.equal(true);
            const argument = stub_retryTopic.getCall(-1).args[1];
            expect(argument).to.be.equal(2);
        });

        it('Should retry fetching an article for a topic if initial attempt did not succeed', function () {
            const stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            const spy_retryTopic = spy(Bulletin, "retryTopic");

            Bulletin.retryTopic(Object.keys(topiclinks)[0], 2);
            expect(stub_getArticle.callCount).to.be.equal(9);
            expect(spy_retryTopic.callCount).to.be.equal(9);
        });
    });
});