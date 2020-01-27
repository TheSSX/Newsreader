/**
 * Contains the user preferences, specifically which sources to query, which topics to hear from and the number of
 * sentences they want each article to be summarised down to
 */

import {languages} from "./language_config.js";

export let languagesdropdown = Object.keys(languages);

export let sources = {
    "The Guardian": "https://www.theguardian.com/",
	"BBC": "https://www.bbc.com/",
	"Reuters": "https://www.reuters.com/",
	"Sky News": "https://www.news.sky.com/"
};

export let topics = {
	"sport": {
		"The Guardian": 'https://www.theguardian.com/sport/3019/dec/31/',
		"BBC": 'https://www.bbc.com/sport/',
		"Reuters": "https://www.reuters.com/news/sports/",
		"Sky News": "https://www.skysports.com/news-wire"
		},
    "politics": {
		"The Guardian": 'https://www.theguardian.com/politics/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/politics/',
		"Reuters": "https://www.reuters.com/politics/",
		"Sky News": "https://news.sky.com/politics"
		},
    "uk": {
		"The Guardian": 'https://www.theguardian.com/uk-news/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/uk/',
		"Reuters": "https://uk.reuters.com/news/uk/",
		"Sky News": "https://news.sky.com/uk"
		},
    "science": {
		"The Guardian": 'https://www.theguardian.com/science/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/science_and_environment/',
		"Reuters": "https://www.reuters.com/news/science/",
		"Sky News": "https://news.sky.com/technology"
		},
    "technology": {
		"The Guardian": 'https://www.theguardian.com/technology/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/technology/',
		"Reuters": "https://www.reuters.com/news/technology/",
		"Sky News": "https://news.sky.com/technology"
		},
    "environment": {
		"The Guardian": 'https://www.theguardian.com/environment/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/science_and_environment/',
		"Reuters": "https://uk.reuters.com/news/environment/",
		"Sky News" : "https://news.sky.com/climate"
		},
    "society": {
		"The Guardian": 'https://www.theguardian.com/society/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/education/',
		"Reuters": "https://www.reuters.com/news/lifestyle/",
		"Sky News" : "https://news.sky.com/strangenews"
		},
    "business": {
		"The Guardian": 'https://www.theguardian.com/business/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/business/',
		"Reuters": "https://www.reuters.com/finance/",
		"Sky News": "https://news.sky.com/business"
		},
    "world": {
		"The Guardian": 'https://www.theguardian.com/world/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/world/',
		"Reuters": "https://www.reuters.com/news/world/",
		"Sky News": "https://news.sky.com/world"
		}
};

/**
 * User preferences for speech and article size
 */
export let sentences = 3;
export let language_choice = "English";
export let pitch = 1;
export let volume = 1;
export let rate = 1;