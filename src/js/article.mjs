import {Speech} from "./speech.mjs";
import {min_sentences, max_sentences} from "./preferences.js";
import {DataParser} from "./pageparser.mjs";

/**
 Class for a news article object
 */
export class Article
{
    /**
     * Returns an article
     * @param publisher - the article publisher, e.g. BBC
     * @param topic - the article topic, e.g. sport
     * @param allheadline - the headline as a single string
     * @param headline - the headline as an array of strings, each ~150 chars long
     * @param link - the article hyperlink
     * @param alltext - the text of the article as a single string
     * @param text - the text of the article as an array of strings, each ~150 chars long
     * @param language - the language of the article
     * @param sentences - the number of sentences in this article
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
        //Read the publisher and topic
        new Speech(this.publisher, this.language).speak();
        new Speech(this.topic, this.language).speak();

        /*
        If the article language is English, we read the allheadline and alltext variables
        This is because the SpeechSynthesis module can read this out in one go
        If the article language is not English, we read the headline and text variables
        This is because the SpeechSynthesis module can only read a maximum of ~200 chars of non-English
        text before cutting out abruptly
         */
        if (this.language === "English")
        {
            let headline = DataParser.abbreviationConcatenation(this.allheadline);      //replace concatenations in the text with words easier to parse, e.g. Dr. becomes Doctor
            headline = headline.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");       //split the text into array of sentences
            if (headline)
                for (let i=0; i<headline.length; i++)
                {
                    new Speech(headline[i], this.language).speak();
                }
            else    //sentence splitting failed, just read the array instead
                new Speech(this.allheadline, this.language).speak();

            let text = DataParser.abbreviationConcatenation(this.alltext);
            text = text.replace(/([.?!])\s*(?=[A-Za-z])/g, "$1|").split("|");
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

    /**
     * Change the number of sentences in the article
     * Article text is replaced with array of sentences so we can easily read out the correct amount
     * @param sentences - the number of sentences to read out
     */
    amendLength(sentences)
    {
        if (sentences < min_sentences || sentences > max_sentences)
            return;

        this.sentences = sentences;
        let newText = [];       //contains the text of the correct number of sentences
        let temp = [];
        for (let i=0; i<this.originalText.length; i++)
        {
            if (['.', '?', '!'].includes(this.originalText[i].charAt(this.originalText[i].length-1)))       //we have the end of a sentence
            {
                for (let j=0; j<temp.length; j++)
                {
                    newText.push(temp[j]);      //push the whole of the sentence onto the array
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
            else    //temp contains current sentence
            {
                temp.push(this.originalText[i]);
            }
        }
    }
}