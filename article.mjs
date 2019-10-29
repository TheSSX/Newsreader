/**
 Class for articles
 */

export class Article
{
    constructor(publisher, topic, title, link, text)
    {
        this.publisher = publisher;
        this.topic = topic;
        this.title = title;
        this.link = link;
        this.text = text;
        console.log(publisher);
        console.log(topic);
        console.log(title);
        console.log(text);
    }

    read()
    {
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.publisher));
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.topic));
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.title));
        window.speechSynthesis.speak(new SpeechSynthesisUtterance(this.text));
    }
}