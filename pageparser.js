/**
 Class for object to parse source article pages
 */

import Article from '../Newsreader/article.js';

class PageParser
{
    getArticle(source, topic)
    {
        if (source === "Guardian")
            return extractGuardian(topic);
        else if (source === "BBC")
            return extractBBC(topic);
    }

    extractGuardian(topic)
    {
        $.ajax({ url: 'https://www.theguardian.com/' + topic + '/3019/dec/31/', success: async function(data)
        {
            const all = data.split('<a href="https://www.theguardian.com/' + topic + '/');

            let linksarr = [];
            for (let i=1; i<all.length; i+=1)
            {
                linksarr.push(all[i].split('"')[0]);
            }

            const links = Array.from(new Set(linksarr));

            let randomlink;

            do
            {
                randomlink = 'https://www.theguardian.com/' + topic + '/' + links[Math.floor(Math.random()*links.length)];
            }
            while (randomlink.startsWith('https://www.theguardian.com/' + topic + '/video/'));

            try
            {
                const data = await extractPageData(randomlink);

                if (data.includes('<p><strong>'))
                {
                    console.log(theurl + " has <strong>");
                    return false;
                }

                const headline = data.split('<title>')[1].split('|')[0];

                return new Article("The Guardian", topic, headline, randomlink);
            }
            catch(ajaxError)
            {

            }

            return true;
        },
        error: function(error)
        {
            console.log(error);
            return false;
        }});
    }

    extractPageData(theurl)
    {
        return $.ajax({url: theurl}).done(function(data){}).fail(function(ajaxError){});    //not convinced this actually returns or throws an error
    }
}