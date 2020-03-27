import {Speech} from "./speech.mjs";
import {min_sentences, max_sentences} from "./preferences.js";
import {abbreviationConcatenation} from "./pageparser.mjs";

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
    constructor(publisher, topic, allheadline, headline, link, alltext, text, language="English", sentences=max_sentences)
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
        this.sentences = sentences;
    }

    /**
     * Read each field of the article, excluding the link
     */
    read()
    {
        new Speech(this.publisher, this.language).speak();
        new Speech(this.topic, this.language).speak();

        if (this.language === "English")
        {
            let headline = DataParser.abbreviationConcatenation(this.allheadline);
            headline = this.allheadline.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
            if (headline)
                for (let i=0; i<headline.length; i++)
                {
                    new Speech(headline[i], this.language).speak();
                }
            else
                new Speech(this.allheadline, this.language).speak();

            let text = DataParser.abbreviationConcatenation(this.alltext);
            text = this.alltext.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
            if (text)
                for (let i=0; i<this.sentences; i++)
                {
                    new Speech(text[i], this.language).speak();
                }
            else
                new Speech(this.alltext, this.language).speak();
        }
        else
        {
            for (let i=0; i<this.headline.length; i++)
            {
                new Speech(this.headline[i], this.language).speak();
            }

            for (let i=0; i<this.text.length; i++)
            {
                new Speech(this.text[i], this.language).speak();
            }
        }
    }

    amendLength(sentences)
    {
        if (sentences < min_sentences || sentences > max_sentences)
            return;

        this.sentences = sentences;
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