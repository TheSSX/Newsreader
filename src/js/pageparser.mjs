import {Article} from "./article.mjs";
import {ArticleExtractor, DataCleaner} from "./articleextractor.mjs";
import {sourcelinks} from "./preferences.js";
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
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<*|Article>} - the article is contained in the promise value
     */
    static getArticle(source, topic, topiclink)
    {
        switch(source)
        {
            case "The Guardian":
                return PageParser.extractGuardian(topic, topiclink);
            case "BBC":
                return PageParser.extractBBC(topic, topiclink);
            case "Reuters":
                return PageParser.extractReuters(topic, topiclink);
            case "Sky News":
                return PageParser.extractSky(topic, topiclink);
            case "Associated Press":
                return PageParser.extractAP(topic, topiclink);
            case "Evening Standard":
                return PageParser.extractEveningStandard(topic, topiclink);
            case "The Independent":
                return PageParser.extractIndependent(topic, topiclink);
            case "ITV News":
                return PageParser.extractITV(topic, topiclink);
            case "News.com.au":
                return PageParser.extractNewsAU(topic, topiclink);
            default:
                throw new TypeError('Invalid source');
        }
    }

    /**
     * Queries a topic page on the Guardian website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractGuardian(topic, topiclink)
    {
        return new Article("works", topic, "hey", "link", "hello");
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */
        
        if (topic === "uk")
        {
            topic = "uk-news";
        }

        let publisher = "The Guardian";
        let linkdata = await PageParser.extractPageData(topiclink);
        linkdata = linkdata.split('<a href="');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            if (current.includes('-'))
            {
                articlelinks.push(current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink;
        let counter = 0;

        do
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            counter++;
        }
        while (randomlink.startsWith(sourcelinks[publisher] + topic + '/video/') && counter < 3);  //articles devoted to a video are no good

        if (randomlink.startsWith(sourcelinks[publisher] + topic + '/video/'))
        {
            return undefined;
        }

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split(' |')[0];      //get headline from article data
            text = ArticleExtractor.extractGuardianText(data);
            if (text !== undefined)
            {
                if (text.split(' - ')[1])
                {
                    text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
            }
            else {
                return undefined;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' |')[0];      //get headline from article data
                text = ArticleExtractor.extractGuardianText(data);
                if (text !== undefined)
                {
                    if (text.split(' - ')[1])
                    {
                        text = text.split(' - ')[1];
                    }

                    text = "Not enough summary credits! " + text;
                }
                else
                {
                    return undefined;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the BBC website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractBBC(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "BBC";

        let linkdata = await PageParser.extractPageData(topiclink);
        linkdata = linkdata.split('<div role="region"')[0];		//Removes articles that are "featured" or unrelated to subject
        linkdata = linkdata.split('href="/news/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            if (!current.includes('/') && current.includes('-') && !isNaN(current[current.length - 1]))
            {
                articlelinks.push(sourcelinks[publisher] + 'news/' + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        const randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        const data = await PageParser.extractPageData(randomlink);  //fetch data from article page

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split(' - BBC News')[0];
            text = ArticleExtractor.extractBBCText(data);
            if (text !== undefined)
            {
                if (text.split(' - ')[1])
                {
                    text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' - BBC News')[0];      //get headline from article data
                text = ArticleExtractor.extractBBCText(data);
                if (text !== undefined)
                {
                    if (text.split(' - ')[1])
                    {
                        text = text.split(' - ')[1];
                    }

                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the Reuters website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractReuters(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "Reuters";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('<a href="' + sourcelinks[publisher] + 'article/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        if (!linksarr.length)
        {
            linkdata = permadata.split('<a href="/article/');

            for (let i = 1; i < linkdata.length; i += 1)
            {
                const currentlink = linkdata[i].split('"')[0];
                linksarr.push(currentlink);
            }
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            if (current.includes('/') && current.includes('-'))
            {
                articlelinks.push('https://uk.reuters.com/article/' + current);		//Removes the issue (seemingly) where some articles are geographically unavailable. Hard-code is annoying but works right now.
                articlelinks.push('https://www.reuters.com/article/' + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3)
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split(' - Reuters')[0];      //get headline from article data
            text = ArticleExtractor.extractReutersText(data);
            if (text !== undefined)
            {
                if (text.split(' - ')[1])
                {
                    text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' - Reuters')[0];      //get headline from article data
                text = ArticleExtractor.extractReutersText(data);
                if (text !== undefined)
                {
                    if (text.split(' - ')[1])
                    {
                        text = text.split(' - ')[1];
                    }

                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the Sky News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractSky(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "Sky News";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata;

        if (topic === "sport")
        {
            linkdata = permadata.split('<a class="news-list__headline-link" href="https://www.skysports.com/');
        } else
        {
            linkdata = permadata.split('<a href="' + sourcelinks[publisher] + 'story/');
        }

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        if (!linksarr.length)
        {
            if (topic === "sport")
            {
                linkdata = permadata.split('<a class="news-list__headline-link" href="https://www.skysports.com/');
            } else
            {
                linkdata = permadata.split('<a href="/story/');
            }

            for (let i = 1; i < linkdata.length; i += 1)
            {
                const currentlink = linkdata[i].split('"')[0];
                linksarr.push(currentlink);
            }
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            if (current.includes('-'))
            {
                if (topic === "sport")
                {
                    articlelinks.push('https://www.skysports.com/' + current);
                } else
                {
                    articlelinks.push(sourcelinks[publisher] + 'story/' + current);
                }
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3)
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split(' |')[0];      //get headline from article data
            text = ArticleExtractor.extractSkyText(data);
            if (text !== undefined)
            {
                if (text.split(' - ')[1])
                {
                    text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' |')[0];      //get headline from article data
                text = ArticleExtractor.extractSkyText(data);
                if (text !== undefined)
                {
                    if (text.split(' - ')[1])
                    {
                        text = text.split(' - ')[1];
                    }

                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        //Checking of a live coverage article. Might need to rejig this to have a technique for a bunch of articles
        if (headline.includes("LIVE") || headline.includes("Live"))
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the Associated Press website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractAP(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "Associated Press";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('href="/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            //if (current.matches("/^[a-z0-9]+$/"))
            if (!current.includes('-') && !current.includes('/') && !current.includes('.') && current.length && current !== "termsofservice" && current !== "privacystatement")
            {
                articlelinks.push(sourcelinks[publisher] + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3)
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = ArticleExtractor.extractAPHeadline(data);   //SMMRY can't find the headline in AP articles. So we extract it ourselves
            text = ArticleExtractor.extractAPText(data);
            if (text !== undefined)
            {
                if (text.split(' - ')[1])
                {
                    text = text.split(' - ')[1];
                }

                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = ArticleExtractor.extractAPHeadline(data);   //SMMRY can't find the headline in AP articles. So we extract it ourselves
                text = ArticleExtractor.extractAPText(data);
                if (text !== undefined)
                {
                    if (text.split(' — ')[1])
                    {
                        text = text.split(' — ')[1];
                    }

                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the Evening Standard website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractEveningStandard(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "Evening Standard";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('href="/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            //if (current.matches("/^[a-z0-9]+$/"))
            if (current.includes('-') && (current.includes('news/') || current.includes('sport/') || current.includes('tech/')) && current.endsWith(".html"))
            {
                articlelinks.push(sourcelinks[publisher] + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3 || (randomlink === undefined && timeout === 3))
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            headline = data.split('<title>')[1].split(' | London Evening Standard')[0];      //get headline from article data
            text = ArticleExtractor.extractEveningStandardText(data);
            if (text !== undefined)
            {
                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' | London Evening Standard')[0];      //get headline from article data
                text = ArticleExtractor.extractEveningStandardText(data);
                if (text !== undefined)
                {
                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the Independent website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractIndependent(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "The Independent";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('href="/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            //if (current.matches("/^[a-z0-9]+$/"))
            if (current.includes('-') && current.endsWith(".html") && !current.includes('service/') && !current.includes('independentpremium/') && !current.includes('long_reads/') && !current.includes('extras/') && !current.includes('food-and-drink/recipes/'))
            {
                articlelinks.push(sourcelinks[publisher] + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3 || (randomlink === undefined && timeout === 3))
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            if (data.split('<title>')[1].split(' | ')[0])
            {
                headline = data.split('<title>')[1].split(' | ')[0];      //get headline from article data
            } else
            {
                headline = data.split('<title>')[1].split('</title>')[0];      //got an article which had an inconsistent headline scheme once
            }

            text = ArticleExtractor.extractIndependentText(data);
            if (text !== undefined)
            {
                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                headline = data.split('<title>')[1].split(' | ')[0];      //get headline from article data
                text = ArticleExtractor.extractIndependentText(data);
                if (text !== undefined)
                {
                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        headline = DataCleaner.cleanText(headline);

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the News.com.au website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractNewsAU(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "News.com.au";

        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('href="https://www.news.com.au/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            //if (current.matches("/^[a-z0-9]+$/"))
            if (current.includes('-') && current.includes("/news-story/") && !current.includes('/game-reviews/'))
            {
                articlelinks.push(sourcelinks[publisher] + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3 || (randomlink === undefined && timeout === 3))
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            if (data.split('<title>')[1])
            {
                headline = data.split('<title>')[1];
                if (headline.split('</title>')[0])
                {
                    headline = headline.split('</title>')[0];      //get headline from article data
                } else
                {
                    return undefined;
                }
            } else
            {
                return undefined;
            }

            text = ArticleExtractor.extractNewsAUText(data);
            if (text !== undefined)
            {
                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                if (data.split('<title>')[1])
                {
                    headline = data.split('<title>')[1];
                    if (headline.split('</title>')[0])
                    {
                        headline = headline.split('</title>')[0];      //get headline from article data
                    } else
                    {
                        return undefined;
                    }
                } else
                {
                    return undefined;
                }

                text = ArticleExtractor.extractNewsAUText(data);
                if (text !== undefined)
                {
                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//TODO not sure this includes statement works
        {
            return undefined;
        }

        headline = DataCleaner.cleanText(headline);

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Queries a topic page on the ITV News website and selects a random article from it
     * @param topic - the news topic
     * @param topiclink - the link to that topic on the specified website
     * @returns {Promise<undefined|Article>} - returns a constructed news article or undefined if the article is no good
     */
    static async extractITV(topic, topiclink)
    {        return new Article("works", topic, "hey", "link", "hello");

        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        let publisher = "ITV News";
        const permadata = await PageParser.extractPageData(topiclink);
        let linkdata = permadata.split('href="/');

        let linksarr = [];
        for (let i = 1; i < linkdata.length; i += 1)
        {
            const currentlink = linkdata[i].split('"')[0];
            linksarr.push(currentlink);
        }

        //Parsing links we've found
        let articlelinks = [];
        for (let i = 0; i < linksarr.length; i += 1)
        {
            const current = linksarr[i];
            //if (current.matches("/^[a-z0-9]+$/"))
            if (current.includes('-') && current.includes("news/") && !current.includes("topic/") && !current.includes("meet-the-team/") && !current.includes("/uk-weather-forecast-") && !current.includes("/assets/") && /\d/.test(current))
            {
                articlelinks.push(sourcelinks[publisher] + current);
            }
        }

        const links = Array.from(new Set(articlelinks));    //array of URLs for articles

        if (links === undefined || links.length === 0)
        {
            return undefined;
        }

        let randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article

        /**
         * Extracting article from article page
         */

        let data = await PageParser.extractPageData(randomlink);  //fetch data from article page
        let timeout = 0;

        while (data === undefined && timeout < 3)		//sometimes Reuters article exists on www.reuters and not uk.reuters or vice versa. Currently, just choose a different article
        {
            randomlink = links[Math.floor(Math.random() * links.length)];  //select a random article
            data = await PageParser.extractPageData(randomlink);  //fetch data from article page
            timeout += 1;

            if (data === undefined && timeout === 3 || (randomlink === undefined && timeout === 3))
            {
                return undefined;
            }
        }

        let headline, text;

        /**
         * SUMMARISING
         */

        const smmrydata = await Summarise.summarise(randomlink);     //send article to SMMRY

        if (smmrydata === undefined)    //SMMRY API unavailable
        {
            if (data.split('<title>')[1])
            {
                headline = data.split('<title>')[1];
                if (headline.split(' - ITV News')[0])
                {
                    headline = headline.split(' - ITV News')[0];      //get headline from article data
                } else
                {
                    return undefined;
                }
            } else if (data.split('<h1 class="update__title update__title--large">')[1])
            {
                headline = data.split('<h1 class="update__title update__title--large">')[1];
                if (headline.split('</h1>')[0])
                {
                    headline = headline.split('</h1>')[0];
                } else
                {
                    return undefined;
                }
            } else
            {
                return undefined;
            }

            text = ArticleExtractor.extractITVText(data);
            if (text !== undefined)
            {
                text = "Not enough summary credits! " + text;
            }
        } else    //SMMRY API working fine
        {
            headline = smmrydata['sm_api_title'];     //article headline returned
            text = smmrydata['sm_api_content'];       //summarised article returned
            const error = smmrydata['sm_api_error'];    //detecting presence of error code

            if (error === 2)
            {
                if (data.split('<title>')[1])
                {
                    headline = data.split('<title>')[1];
                    if (headline.split(' - ITV News')[0])
                    {
                        headline = headline.split(' - ITV News')[0];      //get headline from article data
                    } else
                    {
                        return undefined;
                    }
                } else if (data.split('<h1 class="update__title update__title--large">')[1])
                {
                    headline = data.split('<h1 class="update__title update__title--large">')[1];
                    if (headline.split('</h1>')[0])
                    {
                        headline = headline.split('</h1>')[0];
                    } else
                    {
                        return undefined;
                    }
                } else
                {
                    return undefined;
                }

                text = ArticleExtractor.extractITVText(data);
                if (text !== undefined)
                {
                    text = "Not enough summary credits! " + text;
                }
            }
        }

        if (headline === undefined || text === undefined || headline.includes('?'))		//not sure this includes statement works
        {
            return undefined;
        }

        headline = DataCleaner.cleanText(headline);

        // /**
        //  * TRANSLATING
        //  */
        //
        // if (language_choice !== "English")
        // {
        //     const translations = await callTranslation(publisher, topic, headline, text);
        //
        //     if (translations !== undefined)
        //     {
        //         publisher = translations[0];
        //         topic = translations[1];
        //         headline = translations[2];
        //         text = translations[3];
        //     }
        //     else
        //     {
        //         new Speech(translation_unavailable[language_choice]).speak();
        //     }
        // }

        return new Article(publisher, topic, headline, randomlink, text);
    }

    /**
     * Extracts data from article page
     * @param theurl - the URL of the web article to access
     * @returns {*} - actually returns the page data
     */
    static extractPageData(theurl)
    {
        return $.ajax({url: theurl}).done(function (data)
        {
        }).fail(function (ajaxError)
        {
        });    //not convinced this actually returns or throws an error
    }
}