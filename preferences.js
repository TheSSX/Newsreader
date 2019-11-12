/**
 * Contains the user preferences, specifically which sources to query, which topics to hear from and the number of
 * sentences they want each article to be summarised down to
 */

import {languages} from "./language_config.js";

export let languagedropdown = Object.keys(languages);

export let sources = [
    "The Guardian"
];

export let topics = [
    "sport",
    "politics",
    "uk-news",
    "science",
    "technology",
    "environment",
    "society",
    "business",
    "world"
];

/**
 * User preferences for speech and article size
 */
export let sentences = 4;
export let language_choice = 'English GB';
export let pitch = 1;
export let volume = 1;
export let rate = 1;