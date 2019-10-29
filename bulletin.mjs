/**
 Class for object to parse source article pages
 */

import {PageParser} from "./pageparser.mjs";
import {sources, topics, sentences} from "./preferences.js";

export class Bulletin
{
    static fetchNews()
    {
        for (let i=0; i<2; i++)
        {
            let data;

            do
            {
                const source = sources[Math.floor(Math.random()*sources.length)];  //get random source to contact
                data = PageParser.getArticle(source, topics[i], sentences);
            }
            while (data === undefined);

            data.then(article => {
                article.read();
            })
        }
    }
}