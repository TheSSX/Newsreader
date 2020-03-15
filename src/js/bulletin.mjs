import {PageParser} from "./pageparser.mjs";
import {sentences, sources, topics} from "./preferences.js";
import {Article} from "./article.mjs";

let articles, remaining;

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
    static async fetchNews()
    {
        articles = [];
        remaining = 2;

        articles.push(new Article("We're no strangers to love", "you know the rules and so do I", "A full commitment's what I'm thinking of", "hello", "You wouldn't get this from any other guy"));
        articles.push(new Article("Do you remember", "The twenty first night of September?", "Love was changing the minds of pretenders", "hello", "While chasing the clouds away"));

        Bulletin.readArticles(articles.shift(), articles);
        return true;

        articles = [];
        remaining = Object.keys(topics).length;

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
                    articles.push(article);
                    remaining--;

                    if (remaining === 0)
                    {
                        Bulletin.readArticles(articles.shift(), articles);
                    }
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
                articles.push(article);
                remaining--;

                if (remaining === 0)
                {
                    Bulletin.readArticles(articles.shift(), articles);
                }
            })
            .catch(function () {
                Bulletin.retryTopic(topic, ++attempt);
            });
        }
        catch (TypeError)
        {
            if (attempt === 10)     // stop recursive loop, not managed to fetch an article for the topic
            {
                remaining--;

                if (remaining === 0)
                {
                    Bulletin.readArticles(articles.shift(), articles);
                }
            }
            else
            {
                Bulletin.retryTopic(topic, ++attempt);      // try again, increase number of attempts
            }
        }
    }

    static readArticles(current, articles)
    {
        if (current === undefined)
        {
            return true;
        }

        const message = {
            "headline": current.title,
            "publisher": current.publisher,
            "topic": capitalizeFirstLetter(current.topic)
        };

        chrome.storage.local.set({"headline": message.headline});
        chrome.storage.local.set({"publisher": message.publisher});
        chrome.storage.local.set({"topic": message.topic});
        chrome.runtime.sendMessage({greeting: message});

        current.read();

        const utterance = new SpeechSynthesisUtterance("");
        utterance.onend = function () {
            Bulletin.readArticles(articles.shift(), articles);
        };

        window.speechSynthesis.speak(utterance);
    }
}

//Thanks to user Steve Harrison on Stack Overflow
//Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
