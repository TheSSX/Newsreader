import {PageParser} from "./pageparser.mjs";
import {sources, topics, sentences} from "./preferences.js";

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
        for (let i=0; i<Object.keys(topics).length; i++)     // change i< to prevent unnecessary credits being used up
		//for (let i=0; i<1; i++)     // change i< to prevent unnecessary credits being used up
        {
            const source = Object.keys(sources)[Math.floor(Math.random()*Object.keys(sources).length)];  //get random source to contact
            const topic = Object.keys(topics)[i];
            const topiclink = topics[topic][source];
            const data = PageParser.getArticle(source, topic, topiclink, sentences);          //send source, topic and number of sentences to summarise to

            data.then(article => {      //returned in form of promise with value of article
                try
                {
                    article.read();
                }
                catch(TypeError)
                {
                    Bulletin.retryTopic(topic, 2);
                }
            })
        }
    }

    static retryTopic(topic, attempt)
    {
        const source = Object.keys(sources)[Math.floor(Math.random()*Object.keys(sources).length)];  //get random source to contact

        const topiclink = topics[topic][source];
        const data = PageParser.getArticle(source, topic, topiclink, sentences);          //send source, topic and number of sentences to summarise to

        data.then(article => {      //returned in form of promise with value of article
            try
            {
                article.read();
            }
            catch(TypeError)
            {
                if (attempt === 10)
                {
                    console.log("Failed on topic " + topic);
                }
                else
                {
                    Bulletin.retryTopic(topic, ++attempt);
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
    function(request, sender, sendResponse) {
        if (request.greeting === "play")
            Bulletin.fetchNews();
        else if (request.greeting === "pause")
            window.speechSynthesis.pause();
        else if (request.greeting === "resume")
            window.speechSynthesis.resume();
        else if (request.greeting === "stop")
            window.speechSynthesis.cancel();
    });