import {PageParser} from "./pageparser.mjs";
import {sentences, sources, topics} from "./preferences.js";
import {Article} from "./article.mjs";      //only for testing purposes

/**
 Class for object to query random sources for each topic
 */

let articles = [];

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
        articles.push(new Article("hello1", "hello", "hello", "hello", "This is a long sentence i have decided to play to eat up lots of time"));
        articles.push(new Article("hello2", "hello", "hello", "hello", "This is a long sentence i have decided to play to eat up lots of time"));
        articles.push(new Article("hello3", "hello", "hello", "hello", "This is a long sentence i have decided to play to eat up lots of time"));

        while (articles.length > 0)
        {
            const current = articles[0];
            current.read();
            articles.shift();

            if (articles.length === 0)
            {
                //window.speechSynthesis.speak(new SpeechSynthesisUtterance(" ").onend = stop);
            }
        }

        return true;

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
            try
            {
                const data = PageParser.getArticle(source, topic, topiclink, sentences);          // send source, topic and number of sentences to summarise down to
                data.then(article => // returned in form of promise with value of article
                {
                    //article.read();
                    articles.push(article);
                })
                .catch(function () {
                    Bulletin.retryTopic(topic, 2);
                });
            }
            catch (TypeError)
            {
                Bulletin.retryTopic(topic, 2);      // retry fetching an article using recursion
            }
        }

        while (articles.length > 0)
        {
            const current = articles[0];
            current.read();
            articles.shift();

            if (articles.length === 0)
            {
                //Attempt to trigger the stop function so as to change the pause icon to play icon
                //Alternative is to speak "End of bulletin" or similar
                //Regardless, stop must be called
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("...").onend = stop);
            }
        }
    }

    static retryTopic(topic, attempt)
    {
        const source = Object.keys(sources)[Math.floor(Math.random() * Object.keys(sources).length)];  // get random source to contact
        const topiclink = topics[topic][source];
        try
        {
            const data = PageParser.getArticle(source, topic, topiclink, sentences);          // send source, topic and number of sentences to summarise to
            data.then(article => // returned in form of promise with value of article
            {
                //article.read();
                articles.push(article);
            })
            .catch(function () {
                Bulletin.retryTopic(topic, ++attempt);
            });
        }
        catch (TypeError)
        {
            if (attempt === 10)     // stop recursive loop, not managed to fetch an article for the topic
            {
                //TODO something different. Even if it's a different output message, like a meaningful error
                console.log("Failed on topic " + topic);
            }
            else
            {
                Bulletin.retryTopic(topic, ++attempt);      // try again, increase number of attempts
            }
        }
    }
}