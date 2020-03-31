/**
 * Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 * summarise the article itself.
 * Contains config info for querying the SMMRY API
 */

import {max_sentences} from "./preferences.js";
import {PageParser} from "./pageparser.mjs";

export const smmryurl = "https://api.smmry.com/";
export const apikey = "D7F33A666C";

export class Summarise
{
    /**
     * Receives a URL to an article and the number of sentences to summarise down to
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<void>} - the JSON response from SMMRY
     */
    static async summarise(articleurl, sentences=max_sentences)
    {
        const url = this.constructsmmryurl(articleurl, sentences);

        try
        {
            return await PageParser.extractPageData(url);
        } catch       // yes I know this is bad
        {
            return undefined;
        }
    }

    /**
     * Inserts given parameters into a URL through which to query SMMRY over HTTP
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {string} - the exact HTTP URL to send
     */
    static constructsmmryurl(articleurl, sentences)
    {
        if (!articleurl || !sentences)
            return undefined;
        return `${smmryurl}&SM_API_KEY=${apikey}&SM_LENGTH=${sentences}&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=${articleurl}`;
    }
}