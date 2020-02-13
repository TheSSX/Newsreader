import {PageParser} from "./pageparser.mjs";
import {sentences, sources, topics} from "./preferences.js";

/**
 Class for object to query random sources for each topic
 */
export class Bulletin
{

    /**
     * For each topic specified in the list the user wants to hear from:
     * 1) Pick a random news source to fetch this topc from
     * 2) Attempt to pick a random article on that subject
     * 3) Send that article to the SMMRY API, inputting the number of sentences to summarise down to
     * 4) For each article, read the publication, topic, title and summarised article
     */
    static fetchNews()
    {
        for (let i = 0; i < Object.keys(topics).length; i++)     // change i< to prevent unnecessary credits being used up
        {
            let source = Object.keys(sources)[Math.floor(Math.random() * Object.keys(sources).length)];  // get random source to contact
            const topic = Object.keys(topics)[i];       // topics are read in a random order every time

            //News.com.au does not have UK news. Need a different source
            while (topic === "uk" && source === "News.com.au")
            {
                source = Object.keys(sources)[Math.floor(Math.random() * Object.keys(sources).length)];
            }

            const topiclink = topics[topic][source];    // for the selected source, get the URL to the selected topic page
            const data = PageParser.getArticle(source, topic, topiclink, sentences);          // send source, topic and number of sentences to summarise down to

            data.then(article => // returned in form of promise with value of article
            {
                try
                {
                    article.read();
                } catch (TypeError)
                {
                    Bulletin.retryTopic(topic, 2);      // retry fetching an article using recursion
                }
            })
        }
    }

    static retryTopic(topic, attempt)
    {
        const source = Object.keys(sources)[Math.floor(Math.random() * Object.keys(sources).length)];  // get random source to contact
        const topiclink = topics[topic][source];
        const data = PageParser.getArticle(source, topic, topiclink, sentences);          // send source, topic and number of sentences to summarise to

        data.then(article => // returned in form of promise with value of article
        {
            try
            {
                article.read();
            } catch (TypeError)
            {
                if (attempt === 10)     // stop recursive loop, not managed to fetch an article for the topic
                {
                    console.log("Failed on topic " + topic);
                } else
                {
                    Bulletin.retryTopic(topic, ++attempt);      // try again, increase number of attempts
                }
            }
        })
    }
}

/**
 * Receives messages from popup.mjs
 * These messages let us know user function, e.g. playing or pausing a bulletin
 */
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse)
    {
        if (request.greeting === "play")
            Bulletin.fetchNews();
        else if (request.greeting === "pause")
            window.speechSynthesis.pause();
        else if (request.greeting === "resume")
            window.speechSynthesis.resume();
        else if (request.greeting === "stop")
            window.speechSynthesis.cancel();
    });