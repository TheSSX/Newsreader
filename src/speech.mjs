import {language_choice, pitch, rate, volume} from "./preferences.js";
import {dialects} from "./language_config.js";

/**
 Class for a speech object
 */
export class Speech
{
    /**
     * Creates an object requiring a text string to speak.
     * Takes user preferences from preferences.js
     * @param text - the string to speak
     */
    constructor(text)
    {
        this.speech = new SpeechSynthesisUtterance(text);
        this.speech.lang = dialects[language_choice];
        this.speech.volume = volume;
        this.speech.rate = rate;
        this.speech.pitch = pitch;
    }

    /**
     * Reads aloud the object's text string using speechSynthesis
     */
    speak()
    {
        window.speechSynthesis.speak(this.speech);
    }
}