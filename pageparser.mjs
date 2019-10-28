/**
 Class for object to parse source article pages
 */

import {Article} from "./article.mjs";

export class PageParser
{
    static getArticle(source, topic)
    {
        if (source === "The Guardian")
            return PageParser.extractGuardian(topic);
        //else if (source === "BBC")
            //return this.extractBBC(topic);
    }

    static async extractGuardian(topic)
    {
        /**
         * GETTING RANDOM LINK FOR TOPIC
         */

        // let linkdata;

        // try
        // {
        //     linkdata = await this.extractGuardianLinks(topic).split('<a href="https://www.theguardian.com/' + topic + '/');
        // }
        // catch (ajaxError)
        // {
        //     return undefined;
        // }

        let linkdata = await PageParser.extractGuardianLinks(topic);
        linkdata = linkdata.split('<a href="https://www.theguardian.com/' + topic + '/');

        let linksarr = [];
        for (let i=1; i<linkdata.length; i+=1)
        {
            linksarr.push(linkdata[i].split('"')[0]);
        }

        const links = Array.from(new Set(linksarr));

        let randomlink;

        do
        {
            randomlink = 'https://www.theguardian.com/' + topic + '/' + links[Math.floor(Math.random()*links.length)];
        }
        while (randomlink.startsWith('https://www.theguardian.com/' + topic + '/video/'));

        /**
         * Extracting article from article page
         */

        // let data;

        // try
        // {
        //     data = await this.extractPageData(randomlink);
        // }
        // catch(ajaxError)
        // {
        //     return undefined;
        // }

        const data = await PageParser.extractPageData(randomlink);

        if (data.includes('<p><strong>'))
        {
            console.log(randomlink + " has <strong>");
            return undefined;
        }

        const headline = data.split('<title>')[1].split('|')[0];
        return new Article("The Guardian", topic, headline, randomlink);
    }

    static extractPageData(theurl)
    {
        return $.ajax({url: theurl}).done(function(data){}).fail(function(ajaxError){});    //not convinced this actually returns or throws an error
    }

    static extractGuardianLinks(topic)
    {
        return $.ajax({ url: 'https://www.theguardian.com/' + topic + '/3019/dec/31/'}).done(function(data){}).fail(function(ajaxError){});      //same here
    }
}