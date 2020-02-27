import {describe, it, suite, beforeEach, afterEach} from "mocha";
import {expect} from "chai";
import {stub, spy, restore} from "sinon";
import {PageParser} from "../dist/pageparser.js";
import {Article} from "../dist/article.js";
import {topics} from "../dist/preferences.js";
import {Bulletin} from "../dist/bulletin.js";
import {DataCleaner} from "../dist/articleextractor";

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

            let stub_getArticle = stub(PageParser, "getArticle").resolves(new Article("test", "test", "test", "test", "test"));

            Bulletin.fetchNews();
            expect(stub_getArticle.callCount).to.be.equal(Object.keys(topics).length);
            expect(stub_retryTopic.called).to.be.equal(false);

            stub_getArticle.restore();
            stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            Bulletin.fetchNews();
            expect(stub_getArticle.callCount).to.be.equal(Object.keys(topics).length);
            expect(stub_retryTopic.called).to.be.equal(true);
            const argument = stub_retryTopic.getCall(-1).args[1];
            expect(argument).to.be.equal(2);
        });

        it('Should retry fetching an article for a topic if initial attempt did not succeed', function () {
            const stub_getArticle = stub(PageParser, "getArticle").throws(new TypeError());
            const spy_retryTopic = spy(Bulletin, "retryTopic");
            const spy_log = spy(console, "log");

            Bulletin.retryTopic(Object.keys(topics)[0], 2);
            expect(stub_getArticle.callCount).to.be.equal(9);
            expect(spy_retryTopic.callCount).to.be.equal(9);
            expect(spy_log.called).to.be.equal(true);
        });
    });
});