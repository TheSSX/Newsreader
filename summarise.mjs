/**
 Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 summarise the article itself.
 */

import {apikey, smmryurl} from "./smmry.js";

export class Summarise
{
    static async summarise(articleurl, sentences)
    {
        const url = this.constructsmmryurl(articleurl, sentences);
        return await this.contactsmmry(url);
    }

    static constructsmmryurl(articleurl, sentences)
    {
        return `${smmryurl}&SM_API_KEY=${apikey}&SM_LENGTH=${sentences}&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=${articleurl}`;
    }

    static contactsmmry(url)
    {
        return $.ajax({ url: url}).done(function(data){}).fail(function(ajaxError){});      //same here
    }
}