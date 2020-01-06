import {Article} from "./article.mjs";
import {Summarise} from "./summarise.mjs";
import {Translator} from "./translator.mjs";
import {language_choice} from "./preferences.js";
import {languages, translation_unavailable} from "./language_config.js";
import {sources} from "./preferences.js";
import {Speech} from "./speech.mjs";

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
    static getArticle(source, topic, topiclink, sentences)
    {
        if (source === "The Guardian")
            return PageParser.extractGuardian(topic, topiclink, sentences);
        else if (source === "BBC")
            return PageParser.extractBBC(topic, topiclink, sentences);
		else if (source === "Reuters")
			return PageParser.extractReuters(topic, topiclink, sentences);
    }

    /**
     * Queries a topic page on the Guardian website and selects a random article from it
     * @param topic - the news topic
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractGuardian(topic, topiclink, sentences)
    {
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */
		 
		 //This ain't too good. Maybe need to have another map where standard understood topics like UK can map to
		 //their website equivalents, e.g. UK maps to uk-news for the Guardian
		 if (topic === "uk")
		 {
			 topic = "uk-news";
		 }

        let publisher = "The Guardian";
        let linkdata = await PageParser.extractPageData(topiclink);
        linkdata = linkdata.split('<a href="' + sources[publisher] + '' + topic + '/');

        let linksarr = [];
        for (let i=1; i<linkdata.length; i+=1)
        {
            linksarr.push(linkdata[i].split('"')[0]);
        }

        const links = Array.from(new Set(linksarr));    //array of URLs for articles

        let randomlink;

        do
        {
            randomlink = sources[publisher] + topic + '/' + links[Math.floor(Math.random()*links.length)];  //select a random article
        }
        while (randomlink.startsWith(sources[publisher] + topic + '/video/'));  //articles devoted to a video are no good

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        if (data.includes('<p><strong>') || data.includes('<h2><strong>'))      //indicates a Q&A article
        {
            return undefined;
        }

        let headline = "Random headline";
        let text = "The topic of " + topic + " works!";

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink, sentences);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split('|')[0];      //get headline from article data
            text = Summarise.extractGuardianText(data);                              //extract article text from article data
        }
        else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
        }

        if (headline === undefined || text === undefined || headline.includes('?'))
        {
            return undefined;
        }

        /**
         * TRANSLATING
         */

        if (language_choice !== "English")
        {
            const publishertranslatedata = await Translator.translate(publisher, languages[language_choice]);
            const topictranslatedata = await Translator.translate(topic, languages[language_choice]);
            const headlinetranslatedata = await Translator.translate(headline, languages[language_choice]);
            const texttranslatedata = await Translator.translate(text, languages[language_choice]);

            //If translation API not available
            if (publishertranslatedata === undefined || topictranslatedata === undefined || headlinetranslatedata === undefined || texttranslatedata === undefined)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else if (publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200 || headlinetranslatedata['code'] !== 200 || texttranslatedata['code'] !== 200)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else
            {
                publisher = publishertranslatedata['text'];
                topic = topictranslatedata['text'];
                headline = headlinetranslatedata['text'];
                text = texttranslatedata['text'];
            }
        }

        return new Article(publisher, topic, headline, randomlink, text);
    }
	
	/**
     * Queries a topic page on the BBC website and selects a random article from it
     * @param topic - the news topic
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractBBC(topic, topiclink, sentences)
    {
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "BBC";

        let linkdata = await PageParser.extractPageData(topiclink);
		linkdata = linkdata.split('<div role="region"')[0];		//Removes articles that are "featured" or unrelated to subject
        linkdata = linkdata.split('href="/news/');

        let linksarr = [];
        for (let i=1; i<linkdata.length; i+=1)
        {
			const currentlink = linkdata[i].split('"')[0];		
            linksarr.push(currentlink);
        }
		
		//Parsing links we've found
		let articlelinks = [];
		for (let i=0; i<linksarr.length; i+=1)
		{
			const current = linksarr[i];
			if (!current.includes('/') && current.includes('-') && !isNaN(current[current.length-1]))
			{
				articlelinks.push(sources[publisher] + 'news/' + current);
			}
		}

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        const randomlink = links[Math.floor(Math.random()*links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        if (data.includes('<p><strong>') || data.includes('<h2><strong>'))      //indicates a Q&A article
        {
            return undefined;
        }

        let headline = "Random headline";
        let text = "The topic of " + topic + " works!";

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink, sentences);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split('- BBC News')[0];      //get headline from article data
            text = Summarise.extractBBCText(data);                              //extract article text from article data
        }
        else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        /**
         * TRANSLATING
         */

        if (language_choice !== "English")
        {
            const publishertranslatedata = await Translator.translate(publisher, languages[language_choice]);
            const topictranslatedata = await Translator.translate(topic, languages[language_choice]);
            const headlinetranslatedata = await Translator.translate(headline, languages[language_choice]);
            const texttranslatedata = await Translator.translate(text, languages[language_choice]);

            //If translation API not available
            if (publishertranslatedata === undefined || topictranslatedata === undefined || headlinetranslatedata === undefined || texttranslatedata === undefined)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else if (publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200 || headlinetranslatedata['code'] !== 200 || texttranslatedata['code'] !== 200)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else
            {
                publisher = publishertranslatedata['text'];
                topic = topictranslatedata['text'];
                headline = headlinetranslatedata['text'];
                text = texttranslatedata['text'];
            }
        }

        return new Article(publisher, topic, headline, randomlink, text);
    }
	
	/**
     * Queries a topic page on the Reuters website and selects a random article from it
     * @param topic - the news topic
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractReuters(topic, topiclink, sentences)
    {
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "Reuters";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('<a href="' + sources[publisher] + 'article/');

        let linksarr = [];
        for (let i=1; i<linkdata.length; i+=1)
        {
			const currentlink = linkdata[i].split('"')[0];		
            linksarr.push(currentlink);
        }
		
		if (!linksarr.length)
		{
			linkdata = permadata.split('<a href="/article/');

			for (let i=1; i<linkdata.length; i+=1)
			{
				const currentlink = linkdata[i].split('"')[0];		
				linksarr.push(currentlink);
			}
		}
		
		//Parsing links we've found
		let articlelinks = [];
		for (let i=0; i<linksarr.length; i+=1)
		{
			const current = linksarr[i];
			if (current.includes('/') && current.includes('-'))
			{
				articlelinks.push('https://uk.reuters.com/article/' + current);		//Removes the issue (seemingly) where some articles are geographically unavailable. Hard-code is annoying but works right now.
			}
		}

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        const randomlink = links[Math.floor(Math.random()*links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        if (data.includes('<h3'))      //indicates a Q&A article
        {
            return undefined;
        }

        let headline = "Random headline";
        let text = "The topic of " + topic + " works!";

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink, sentences);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split('- BBC News')[0];      //get headline from article data
            text = Summarise.extractReutersText(data);                              //extract article text from article data
        }
        else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
			/**
			Can maybe perform a split on the returned text here to remove the place of publishing and publisher that appears at the
			start of every Reuters article, e.g.
			TURIN, Italy (Reuters) - Cristiano Ronaldo scored a second-half hat-trick
			Could split at the dash that always appears
			Effect a little jarring to hear but not absolutely essential
			Shouldn't be too hard to remove.
			*/
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        /**
         * TRANSLATING
         */

        if (language_choice !== "English")
        {
            const publishertranslatedata = await Translator.translate(publisher, languages[language_choice]);
            const topictranslatedata = await Translator.translate(topic, languages[language_choice]);
            const headlinetranslatedata = await Translator.translate(headline, languages[language_choice]);
            const texttranslatedata = await Translator.translate(text, languages[language_choice]);

            //If translation API not available
            if (publishertranslatedata === undefined || topictranslatedata === undefined || headlinetranslatedata === undefined || texttranslatedata === undefined)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else if (publishertranslatedata['code'] !== 200 || topictranslatedata['code'] !== 200 || headlinetranslatedata['code'] !== 200 || texttranslatedata['code'] !== 200)
            {
                new Speech(translation_unavailable[language_choice]).speak();
            }
            else
            {
                publisher = publishertranslatedata['text'];
                topic = topictranslatedata['text'];
                headline = headlinetranslatedata['text'];
                text = texttranslatedata['text'];
            }
        }

        return new Article(publisher, topic, headline, randomlink, text);
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
}