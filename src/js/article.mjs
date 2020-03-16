import {Speech} from "./speech.mjs";

/**
 Class for an article object
 */
export class Article
{
    /**
     * Create an article
     * @param publisher - the news source
     * @param topic - the news topic
     * @param title - the title of the article
     * @param link - the link to the article
     * @param text - the summarised article text
     */
    constructor(publisher, topic, title, link, text, language="English")
    {
        this.publisher = publisher;
        this.topic = topic;
        this.title = title;
        this.link = link;
        this.text = text;
        this.language = language;
        this.originalText = text;
    }

    /**
     * Read each field of the article, excluding the link
     */
    read()
    {
        new Speech(this.publisher, this.language).speak();
        new Speech(this.topic, this.language).speak();
        new Speech(this.title, this.language).speak();
        new Speech(this.text, this.language).speak();
    }

    amendLength(sentences)
    {
        const arrText = this.originalText.match( /[^\.!\?]+[\.!\?]+/g );
        let newText = "";

        try
        {
            for (let i=0; i<sentences; i++)
            {
                newText += arrText[i] + " ";
            }

            this.text = newText;
        }
        catch (TypeError){}
    }
}