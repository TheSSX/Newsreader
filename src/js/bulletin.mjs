import {PageParser} from "./pageparser.mjs";
import {sourcelinks, topiclinks} from "./preferences.js";
import {Article} from "./article.mjs";
import {Speech} from "./speech.mjs";
import {languages, translation_unavailable} from "./language_config.js";
import {Translator} from "./translator.mjs";

let articles = [];
let remaining = 0;

/**
 Class for constructing a bulletin of articles and reading them aloud
 Sends back messages for current article being read
 */
export class Bulletin
{
    /**
     * For each topic specified in the list the user wants to hear from:
     * 1) Pick a random news source to fetch this topc from
     * 2) Attempt to pick a random article on that subject
     * 3) Send that article to the SMMRY API, inputting the number of sentences to summarise down to
     * 4) Call the read function, passing the array of articles
     *
     * @param sources - the map of sources. A source maps to true if it is selected by the user
     * @param topics - the map of topics. A topic maps to true if it is selected by the user
     */
    static fetchNews(sources, topics)
    {
        //News.com.au does not have UK news
        if (Bulletin.checkNewsAUUK(sources, topics))
            return false;

        articles = [];      //each fetched article is stored here
        remaining = Object.keys(topics).length;     //loop until we have no more articles to fetch

        for (let i = 0; i < Object.keys(topics).length; i++)
        {
            let source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];  // get random source to contact
            const topic = Object.keys(topics)[i];       // topics are read in a random order every time

            if (!topics[topic]) {       //if the user has not ticked this topic, skip it
                remaining--;
                continue;
            }

            while (!sources[source])        //loop until we get a source the user selected. Will not loop forever as this has already been checked for
            {
                source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];
            }

            const topiclink = topiclinks[topic][source];    // for the selected source, get the URL to the selected topic page from preferences.js
            try
            {
                const data = PageParser.getArticle(source, topic, topiclink);          // send source, topic and number of sentences to summarise down to
                data.then(article => // article returned in form of promise
                {
                    articles.push(article);
                    remaining--;

                    if (remaining <= 0)     //begin reading articles out
                    {
                        let nextArticle = articles.shift();
                        if (nextArticle === undefined)      //no articles to play
                        {
                            chrome.runtime.sendMessage({greeting: "stop"});
                            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                            return false;
                        }

                        Bulletin.checkSentences(nextArticle).then(newArticle => {       //change article length if necessary
                            Bulletin.checkTranslation(newArticle).then(result => {      //change article translation if necessary
                                nextArticle = result;
                                Bulletin.readArticles(nextArticle, articles);
                                return true;
                            });
                        });
                    }
                })
                .catch(function () {        //Error occurred with this source, try again
                    Bulletin.retryTopic(topic, 2);
                });
            }
            catch (TypeError)
            {
                Bulletin.retryTopic(topic, 2);      // retry fetching an article using recursion
            }
        }
    }

    /**
     * Retries getting an article with the given topic, up to a maximum of 10 tries before failing gracefully
     * @param topic - the topic to look for
     * @param attempt - keeps track of how many attempts we've had so far
     * @returns {boolean} - true/false if managed to get an article
     */
    static retryTopic(topic, attempt)
    {
        const source = Object.keys(sourcelinks)[Math.floor(Math.random() * Object.keys(sourcelinks).length)];  // get random source to contact
        const topiclink = topiclinks[topic][source];
        try
        {
            const data = PageParser.getArticle(source, topic, topiclink);          // send source, topic and number of sentences to summarise to
            data.then(article => // article returned in form of promise
            {
                articles.push(article);
                remaining--;

                if (remaining <= 0)
                {
                    let nextArticle = articles.shift();
                    if (nextArticle === undefined)
                    {
                        chrome.runtime.sendMessage({greeting: "stop"});
                        chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                        return false;
                    }

                    Bulletin.checkSentences(nextArticle).then(newArticle => {
                        Bulletin.checkTranslation(newArticle).then(result => {
                            nextArticle = result;
                            Bulletin.readArticles(nextArticle, articles);
                            return true;
                        });
                    });
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

                if (remaining <= 0)
                {
                    let nextArticle = articles.shift();
                    if (nextArticle === undefined)
                    {
                        chrome.runtime.sendMessage({greeting: "stop"});
                        chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                        return false;
                    }

                    Bulletin.checkSentences(nextArticle).then(newArticle => {
                        Bulletin.checkTranslation(newArticle).then(result => {
                            nextArticle = result;
                            Bulletin.readArticles(nextArticle, articles);
                            return true;
                        });
                    });
                }
            }
            else
            {
                Bulletin.retryTopic(topic, ++attempt);      // try again, increase number of attempts
            }
        }
    }

    /**
     * Reads aloud the articles and calls itself recursively
     * @param current - the current article to read aloud
     * @param articles - the list of remaining articles to read aloud
     * @returns {boolean} - true once finished
     */
    static readArticles(current, articles)
    {
        if (current === undefined)      //no more articles left to read
        {
            chrome.runtime.sendMessage({greeting: "stop"});     //send message to front end that articles have finished
            chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
            return true;
        }

        let message;        //contains details of current article to display on front end
        if (current.language === 'English')
        {
            message = {
                "headline": '<a href="' + current.link + '" target="_blank">' + current.allheadline + '</a>',
                "publisher": current.publisher,
                "topic": Bulletin.capitalizeFirstLetter(current.topic),
            };
        }
        else
        {
            message = {
                "headline": '<a href="' + current.link + '" target="_blank">' + current.headline + '</a>',
                "publisher": current.publisher,
                "topic": Bulletin.capitalizeFirstLetter(current.topic),
            };
        }

        //Store details of current article in storage to allow for persistent popup
        chrome.storage.local.set({"headline": message.headline});
        chrome.storage.local.set({"publisher": message.publisher});
        chrome.storage.local.set({"topic": message.topic});
        chrome.runtime.sendMessage({greeting: message});

        current.read();     //read the article

        const utterance = new SpeechSynthesisUtterance("");
        utterance.onend = async function () {
            let nextArticle = articles.shift();
            if (nextArticle === undefined)
            {
                chrome.runtime.sendMessage({greeting: "stop"});
                chrome.storage.local.remove(['playing', 'paused', 'headline', 'publisher', 'topic']);
                return true;
            }

            Bulletin.checkSentences(nextArticle).then(newArticle => {       //amend the number of sentences in article if necessary
                Bulletin.checkTranslation(newArticle).then(result => {      //amend the language of the article if necessary
                    nextArticle = result;
                    Bulletin.readArticles(nextArticle, articles);
                });
            });
        };

        window.speechSynthesis.speak(utterance);
    }

    /**
     * Reads the current value of sentences user wants from Chrome storage and changes the length of the given article to reflect this
     * @param article - the article in question
     * @returns {Promise<unknown>} - the new amended article
     */
    static async checkSentences(article)
    {
        return new Promise((resolve) => {
            chrome.storage.local.get(['sentences'], function (result) {     //read sentences from storage
                const sentences = result['sentences'];

                if (sentences)
                {
                    article.amendLength(sentences);
                }

                resolve(article);
            });
        });
    }

    /**
     * Reads the current language the user wants from Chrome storage and translates the article if not English
     * @param article - the article in question
     * @returns {Promise<unknown>} - the translated article
     */
    static async checkTranslation(article)
    {
        return new Promise((resolve) => {
            chrome.storage.local.get(['language'], async function (result) {        //read language string
                const language_choice = result['language'];

                if (language_choice)
                {
                    if (language_choice !== 'English')
                    {
                        const translatedArticle = await Bulletin.getTranslatedArticle(article, language_choice);    //translate the article

                        if (translatedArticle !== undefined)
                        {
                            article = translatedArticle;
                        }
                        else
                        {
                            new Speech(translation_unavailable[language_choice], language_choice).speak();      //translation could not be performed, inform the user of this by speaking 'Translation unavailable' in their selected language
                        }
                    }
                }

                resolve(article);
            });
        });
    }

    /**
     * Calls the translation class to translate each element of the article
     * @param article - the article to translate
     * @param language_choice - the language to translate to
     * @returns {Promise<undefined|Article>} - the translated article
     */
    static async getTranslatedArticle(article, language_choice)
    {
        const publishertranslatedata = await Translator.translate(article.publisher, languages[language_choice]);   //translate publisher

        if (publishertranslatedata === undefined)
            return undefined;

        const topictranslatedata = await Translator.translate(article.topic, languages[language_choice]);   //translate topic

        let headline = [];
        for (let i=0; i<article.headline.length; i++)       //translate each part in the headline
        {
            const current = await Translator.translate(article.headline[i], languages[language_choice]);
            if (current['code'] !== 200)
                return undefined;
            headline.push(current['text']);
        }

        let text = [];
        for (let i=0; i<article.text.length; i++)       //translate each part of the text
        {
            const current = await Translator.translate(article.text[i], languages[language_choice]);
            if (current['code'] !== 200)
                return undefined;
            text.push(current['text']);
        }

        //If translation API not available
        if (topictranslatedata === undefined || article.headline.length !== headline.length || article.text.length !== text.length)
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

    /**
     * Checks if News.com.au and UK are the only source and topic selected. Invalid if so, because News.com.au does not support UK news
     * @param sources - the map of sources. A source maps to true if the user has selected it
     * @param topics - the map of topics. A topic maps to true if the user has selected it
     * @returns {boolean} - true if only News.com.au and UK are selected, false otherwise
     */
    static checkNewsAUUK(sources, topics)
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

    //Thanks to user Steve Harrison on Stack Overflow
    //Link: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
    /**
     * Capitalises the first letter of a given string
     * @param string - the string in question
     * @returns {string|*} - the capitalised string or the original string if this failed
     */
    static capitalizeFirstLetter(string) {
        try {
            return string.charAt(0).toUpperCase() + string.slice(1);
        } catch (TypeError) {
            return string;
        }
    }
}
