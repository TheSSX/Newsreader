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

        for (let i=0; i<this.text.length; i++)
        {
            new Speech(this.text[i], this.language).speak();
        }
    }

    amendLength(sentences)
    {
        let newText = [];
        let temp = [];
        let remaining = sentences;

        for (let i=0; i<this.originalText.length; i++)
        {
            if (['.', '?', '!'].includes(this.originalText[i].charAt(this.originalText[i].length-1)))
            {
                for (let j=0; j<temp.length; j++)
                {
                    newText.push(temp[j]);
                }
                newText.push(this.originalText[i]);
                temp = [];
                remaining--;
                if (remaining === 0)
                {
                    this.text = newText;
                    return;
                }
            }
            else
            {
                temp.push(this.originalText[i]);
            }
        }
    }
}