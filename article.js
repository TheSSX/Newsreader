/**
 Class for articles
 */

export class Article
{
    constructor(publisher, topic, title, link)
    {
        this.publisher = publisher;
        this.topic = topic;
        this.title = title;
        this.link = link;
    }

    speak(sentences)
    {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.publisher));
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.topic));
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.title));
        // const summary = SMMRY.summarise(this.link) with sentences number of sentences
        // window.speechSynthesis.speak(new SpeechSynthesisUtterance(summary));
    }
}