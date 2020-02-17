//import {Speech} from "./speech.mjs";
const Speech = require('speech.mjs').Speech;

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
    constructor(publisher, topic, title, link, text)
    {
        this.publisher = publisher;
        this.topic = topic;
        this.title = title;
        this.link = link;
        this.text = text;
    }

    /**
     * Read each field of the article, excluding the link
     */
    read()
    {
        new Speech(this.publisher).speak();
        new Speech(this.topic).speak();
        new Speech(this.title).speak();
        new Speech(this.text).speak();
    }
}