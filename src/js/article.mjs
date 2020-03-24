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
    constructor(publisher, topic, allheadline, headline, link, alltext, text, language="English")
    {
        this.publisher = publisher;
        this.topic = topic;
        this.allheadline = allheadline;
        this.headline = headline;
        this.link = link;
        this.alltext = alltext;
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

        //TODO find some way to get this working
        //If SMMRY isn't available, this reads out the entirety of the article because that's what is stored in alltext
        //If SMMRY is available, that's fine because alltext contains max_sentences worth of the article.
        //As a result, it can sound very clunky and it will be more noticeable as most evaluators will speak English
        //The for loop is necessary for non-English articles. Can't get around it
        //Possibilites: amend textSplitter to return an array of a requested size
        //Also amend amendLength to take an input array

        // if (this.language === "English")
        // {
        //     new Speech(this.allheadline, this.language).speak();
        //     new Speech(this.alltext, this.language).speak();
        // }
        // else
        // {
            for (let i=0; i<this.headline.length; i++)
            {
                new Speech(this.headline[i], this.language).speak();
            }

            for (let i=0; i<this.text.length; i++)
            {
                new Speech(this.text[i], this.language).speak();
            }
        //}
    }

    amendLength(sentences)
    {
        let newText = [];
        let temp = [];
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
                sentences--;
                if (sentences <= 0)
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