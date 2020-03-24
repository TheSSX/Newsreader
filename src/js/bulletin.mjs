import {PageParser} from "./pageparser.mjs";
import {sourcelinks, topiclinks} from "./preferences.js";
import {Article} from "./article.mjs";
import {Speech} from "./speech.mjs";
import {languages, translation_unavailable} from "./language_config.js";
import {Translator} from "./translator.mjs";

let articles, remaining;

/**
 Class for object to query random sourcelinks for each topic
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
    static fetchNews(sources, topics)
    {
        // articles = [];
        // remaining = 2;
        //
        // articles.push(new Article("We're no strangers to love", "politics", "A full commitment's what I'm thinking of", "hello", "Sentence 1. Sentence 2! Sentence 3? Sentence 4. Sentence 5. Sentence 6. Sentence 7!"));
        // articles.push(new Article("Do you remember", "world", "Love was changing the minds of pretenders", "hello", "Sentence 1. Sentence 2! Sentence 3? Sentence 4. Sentence 5. Sentence 6. Sentence 7!"));
        // articles.push(new Article("Do you remember", "sport", "Love was changing the minds of pretenders", "hello", "Sentence 1. Sentence 2! Sentence 3? Sentence 4. Sentence 5. Sentence 6. Sentence 7!"));
        //
        // const utterance = new SpeechSynthesisUtterance("");
        // utterance.onend = async function () {
        //     let nextArticle = articles.shift();
        //     if (nextArticle === undefined) {
        //         chrome.runtime.sendMessage({greeting: "stop"});
        //         chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
        //         return true;
        //     }
        //
        //     Bulletin.checkSentences(nextArticle).then(newArticle => {
        //         Bulletin.checkTranslation(newArticle).then(result => {
        //             nextArticle = result;
        //             Bulletin.readArticles(nextArticle, articles);
        //         });
        //     });
        // };
        // window.speechSynthesis.speak(utterance);
        // return true;

        articles = [];
        remaining = Object.keys(topics).length;

        for (let i = 0; i < Object.keys(topics).length; i++)     // change i< to prevent unnecessary credits being used up
        {
            let source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];  // get random source to contact
            const topic = Object.keys(topics)[i];       // topics are read in a random order every time

            if (!topics[topic]) {
                remaining--;
                continue;
            }

            //News.com.au does not have UK news.
            if (topic === "uk" && source === "News.com.au")
            {
                if (checkNewsAUUK(sources, topics))
                    continue
            }

            while (topic === "uk" && source === "News.com.au")
            {
                source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];
            }

            while (!sources[source]) {
                source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];
            }

            const topiclink = topiclinks[topic][source];    // for the selected source, get the URL to the selected topic page
            try
            {
                const data = PageParser.getArticle(source, topic, topiclink);          // send source, topic and number of sentences to summarise down to
                data.then(article => // returned in form of promise with value of article
                {
                    articles.push(article);
                    remaining--;

                    if (remaining === 0)
                    {
                        const utterance = new SpeechSynthesisUtterance("");
                        utterance.onend = async function () {
                            let nextArticle = articles.shift();
                            if (nextArticle === undefined)
                            {
                                chrome.runtime.sendMessage({greeting: "stop"});
                                chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                                return true;
                            }

                            Bulletin.checkSentences(nextArticle).then(newArticle => {
                                Bulletin.checkTranslation(newArticle).then(result => {
                                    nextArticle = result;
                                    Bulletin.readArticles(nextArticle, articles);
                                });
                            });
                        };

                        window.speechSynthesis.speak(utterance);
                        return true;
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
        const source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];  // get random source to contact
        const topiclink = topiclinks[topic][source];
        try
        {
            const data = PageParser.getArticle(source, topic, topiclink);          // send source, topic and number of sentences to summarise to
            data.then(article => // returned in form of promise with value of article
            {
                articles.push(article);
                remaining--;

                if (remaining === 0)
                {
                    const utterance = new SpeechSynthesisUtterance("");
                    utterance.onend = async function () {
                        let nextArticle = articles.shift();
                        if (nextArticle === undefined)
                        {
                            chrome.runtime.sendMessage({greeting: "stop"});
                            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                            return true;
                        }

                        Bulletin.checkSentences(nextArticle).then(newArticle => {
                            Bulletin.checkTranslation(newArticle).then(result => {
                                nextArticle = result;
                                Bulletin.readArticles(nextArticle, articles);
                            });
                        });
                    };

                    window.speechSynthesis.speak(utterance);
                    return true;
                }
            })
            .catch(function () {
                Bulletin.retryTopic(topic, ++attempt);
            });
        }
        catch (TypeError)
        {
            if (attempt >= 10)     // stop recursive loop, not managed to fetch an article for the topic
            {
                remaining--;

                if (remaining === 0)
                {
                    const utterance = new SpeechSynthesisUtterance("");
                    utterance.onend = async function () {
                        let nextArticle = articles.shift();
                        if (nextArticle === undefined)
                        {
                            chrome.runtime.sendMessage({greeting: "stop"});
                            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                            return true;
                        }

                        Bulletin.checkSentences(nextArticle).then(newArticle => {
                            Bulletin.checkTranslation(newArticle).then(result => {
                                nextArticle = result;
                                Bulletin.readArticles(nextArticle, articles);
                            });
                        });
                    };

                    window.speechSynthesis.speak(utterance);
                    return true;
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
            chrome.runtime.sendMessage({greeting: "stop"});
            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
            return true;
        }

        const message = {
            "headline": current.headline,
            "publisher": current.publisher,
            "topic": capitalizeFirstLetter(current.topic)
        };

        chrome.storage.local.set({"headline": message.headline});
        chrome.storage.local.set({"publisher": message.publisher});
        chrome.storage.local.set({"topic": message.topic});
        chrome.runtime.sendMessage({greeting: message});

        current.read();

        const utterance = new SpeechSynthesisUtterance("");
        utterance.onend = async function () {
            let nextArticle = articles.shift();
            if (nextArticle === undefined)
            {
                chrome.runtime.sendMessage({greeting: "stop"});
                chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                return true;
            }

            Bulletin.checkSentences(nextArticle).then(newArticle => {
                Bulletin.checkTranslation(newArticle).then(result => {
                    nextArticle = result;
                    Bulletin.readArticles(nextArticle, articles);
                });
            });
        };

        window.speechSynthesis.speak(utterance);
    }

    static async checkSentences(article)
    {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['sentences'], function (result) {
                const sentences = result['sentences'];

                if (sentences)
                {
                    article.amendLength(sentences);
                }

                resolve(article);
            });
        });
    }

    static async checkTranslation(article)
    {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(['language'], async function (result) {
                const language_choice = result['language'];

                if (language_choice)
                {
                    if (language_choice !== 'English')
                    {
                        const translatedArticle = await Bulletin.getTranslatedArticle(article, language_choice);

                        if (translatedArticle !== undefined)
                        {
                            article = translatedArticle;
                        }
                        else
                        {
                            new Speech(translation_unavailable[language_choice], language_choice).speak();
                        }
                    }
                }

                resolve(article);
            });
        });
    }

    static async getTranslatedArticle(article, language_choice)
    {
        //return new Article("This is " + language_choice, "This is " + article.topic, "", "", "hello", ["translated text"], language_choice);
        const publishertranslatedata = await Translator.translate(article.publisher, languages[language_choice]);
        const topictranslatedata = await Translator.translate(article.topic, languages[language_choice]);

        let headline = [];
        for (let i=0; i<article.headline.length; i++)
        {
            const current = await Translator.translate(article.headline[i], languages[language_choice]);
            if (current['code'] !== 200)
                return undefined;
            headline.push(current['text']);
        }

        let text = [];
        for (let i=0; i<article.text.length; i++)
        {
            const current = await Translator.translate(article.text[i], languages[language_choice]);
            if (current['code'] !== 200)
                return undefined;
            text.push(current['text']);
        }

        //If translation API not available
        if (publishertranslatedata === undefined || topictranslatedata === undefined || article.headline.length !== headline.length || article.text.length !== text.length)
        {
            return undefined;
        }
        else if (publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200)
        {
            return undefined;
        }
        else
        {
            const publisher = publishertranslatedata['text'];
            const topic = topictranslatedata['text'];

            return new Article(publisher, topic, article.headline, headline, article.link, article.alltext, text, language_choice);
        }
    }
}

//Thanks to user Steve Harrison on Stack Overflow
//Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function capitalizeFirstLetter(string) {
    try
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    catch(TypeError)
    {
        return string;
    }
}

export function checkNewsAUUK(sources, topics)
{
    if (!sources['News.com.au'] || !topics['uk'])
        return false;

    for (let i=0; i<Object.keys(sources).length; i++)
    {
        if (sources[Object.keys(sources)[i]] && Object.keys(sources)[i] !== 'News.com.au')
            return false;
    }

    for (let i=0; i<Object.keys(topics).length; i++)
    {
        if (topics[Object.keys(topics)[i]] && Object.keys(topics)[i] !== 'uk')
            return false;
    }

    return true;
}
