import {apikey, yandexurl} from "./yandex.js";

/**
 Class for translating articles via the Yandex free translation service.
 Yandex offers one million free characters translated every day.
 */
export class Translator
{

    /**
     * Manages the translation of text to a target language
     * @param text - the text to translate
     * @param targetlang - the target language to translate to
     * @returns {Promise<undefined>} - the JSON response from Yandex
     */
    static async translate(text, targetlang)
    {
        const url = this.constructyandexurl(text, targetlang);

        try
        {
            return await this.contactyandex(url);
        } catch
        {
            return undefined;
        }
    }

    /**
     * Constructs the GET request for querying the Yandex API
     * @param text - the text to translate
     * @param targetlang - the target language to translate to
     * @returns {string} - the constructed URL
     */
    static constructyandexurl(text, targetlang)
    {
        if (!text || !targetlang)
            return undefined;
        return `${yandexurl}?key=${apikey}&text=${text}&lang=${targetlang}`;
    }

    /**
     * Queries Yandex and returns JSON data
     * @param url - the URL to query
     * @returns {*} - the JSON data
     */
    static contactyandex(url)
    {
        return $.ajax({url: url}).done(function (data)
        {
        }).fail(function (ajaxError)
        {
        });
    }
}