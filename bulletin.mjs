import {PageParser} from "./pageparser.mjs";
import {sources, topics, sentences} from "./preferences.js";

// for (let i=0; i<1; i++)     // change i< to prevent unnecessary credits being used up
// {
//     let data;
//
//     do
//     {
//         const source = sources[Math.floor(Math.random()*sources.length)];  //get random source to contact
//         data = PageParser.getArticle(source, topics[i], sentences);          //send source, topic and number of sentences to summarise to
//     }
//     while (data === undefined);     //returns undefined if chosen article is no good, i.e. a Q&A article on the Guardian
//
//     data.then(article => {      //returned in form of promise with value of article
//         article.read();
//     })
// }
//

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
        for (let i=0; i<1; i++)     // change i< to prevent unnecessary credits being used up
        {
            let data;

            do
            {
                const source = sources[Math.floor(Math.random()*sources.length)];  //get random source to contact
                data = PageParser.getArticle(source, topics[i], sentences);          //send source, topic and number of sentences to summarise to
            }
            while (data === undefined);     //returns undefined if chosen article is no good, i.e. a Q&A article on the Guardian

            data.then(article => {      //returned in form of promise with value of article
                article.read();
            })
        }
    }
}

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.greeting === "play")
            Bulletin.fetchNews();
        else if (request.greeting === "play"){
            window.speechSynthesis.cancel();
            console.log("Fired");}
    });