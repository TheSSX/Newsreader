import {Article} from "./article.mjs";
import {Summarise} from "./summarise.mjs";

/**
 Class for object to parse source article pages
 */
export class PageParser
{
    /**
     * Calls the right function for selecting and parsing an article based on the news source
     * @param source - the news source
     * @param topic- the news topic
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<*|Article>} - the article is contained in the promise value
     */
    static getArticle(source, topic, sentences)
    {
        if (source === "The Guardian")
            return PageParser.extractGuardian(topic, sentences);
        //else if (source === "BBC")
            //return this.extractBBC(topic);
    }

    /**
     * Queries a topic page on the Guardian website and selects a random article from it
     * @param topic - the news topic
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractGuardian(topic, sentences)
    {
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let linkdata = await PageParser.extractGuardianLinks(topic);
        linkdata = linkdata.split('<a href="https://www.theguardian.com/' + topic + '/');

        let linksarr = [];
        for (let i=1; i<linkdata.length; i+=1)
        {
            linksarr.push(linkdata[i].split('"')[0]);
        }

        const links = Array.from(new Set(linksarr));    //array of URLs for articles

        let randomlink;

        do
        {
            randomlink = 'https://www.theguardian.com/' + topic + '/' + links[Math.floor(Math.random()*links.length)];  //select a random article
        }
        while (randomlink.startsWith('https://www.theguardian.com/' + topic + '/video/'));  //articles devoted to a video are no good

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        if (data.includes('<p><strong>') || data.includes('<h2><strong>'))      //indicates a Q&A article
        {
            return undefined;
        }

        let headline;
        let text;
        return new Article("The Guardian", topic, "Sport headline", randomlink, "This works!");
        const smmrydata = await Summarise.summarise(randomlink, sentences);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split('|')[0];      //get headline from article data
            text = Summarise.extractText(data);                              //extract article text from article data
        }
        else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
        }

        if (headline === undefined || text === undefined)
        {
            return undefined;
        }

        return new Article("The Guardian", topic, headline, randomlink, text);
    }

    /**
     * Extracts data from article page
     * @param theurl - the URL of the web article to access
     * @returns {*} - actually returns the page data
     */
    static extractPageData(theurl)
    {
        return $.ajax({url: theurl}).done(function(data){}).fail(function(ajaxError){});    //not convinced this actually returns or throws an error
    }

    /**
     * Extracts data from Guardian topic page
     * @param topic - the news topic to focus on
     * @returns {*} - actually returns the page data
     */
    static extractGuardianLinks(topic)
    {
        return $.ajax({ url: 'https://www.theguardian.com/' + topic + '/3019/dec/31/'}).done(function(data){}).fail(function(ajaxError){});      //same here
    }
}