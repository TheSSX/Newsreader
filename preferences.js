/**
 * Contains the user preferences, specifically which sources to query, which topics to hear from and the number of
 * sentences they want each article to be summarised down to
 */

import {languages} from "./language_config.js";

export let languagesdropdown = Object.keys(languages);

export let sources = {
    "The Guardian": "https://www.theguardian.com/",
	"BBC": "https://www.bbc.com/news/"
};

export let topics = {
	"sport": {
		"The Guardian": 'https://www.theguardian.com/sport/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/sport/'
		},
    "politics": {
		"The Guardian": 'https://www.theguardian.com/politics/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/politics/'
		},
    "uk": {
		"The Guardian": 'https://www.theguardian.com/uk-news/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/uk/'
		},
    "science": {
		"The Guardian": 'https://www.theguardian.com/science/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/science_and_environment/'
		},
    "technology": {
		"The Guardian": 'https://www.theguardian.com/technology/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/technology/'
		},
    "environment": {
		"The Guardian": 'https://www.theguardian.com/environment/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/science_and_environment/'
		},
    "society": {
		"The Guardian": 'https://www.theguardian.com/society/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/education/'
		},
    "business": {
		"The Guardian": 'https://www.theguardian.com/business/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/business/'
		},
    "world": {
		"The Guardian": 'https://www.theguardian.com/world/3019/dec/31/', 
		"BBC": 'https://www.bbc.com/news/world/'
		}
};

/**
 * User preferences for speech and article size
 */
export let sentences = 4;
export let language_choice = "English";
export let pitch = 1;
export let volume = 1;
export let rate = 1;