/**
 Class for object to parse source article pages
 */

import {PageParser} from "./pageparser.mjs";
import {sources} from "./preferences.mjs";
import {topics} from "./preferences.mjs";

export class Bulletin
{
    static fetchNews()
    {
        for (let i=0; i<topics.length; i++)
        {
            let data;

            do
            {
                const source = sources[Math.floor(Math.random()*sources.length)];  //get random source to contact
                data = PageParser.getArticle(source, topics[i]);
            }
            while (data === undefined);

            data.then(article => {
                article.read(4);
            })
        }
    }
}