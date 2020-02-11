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
	"Sky News": "https://www.news.sky.com/",
	"Associated Press": "https://apnews.com/",
	"Evening Standard": "https://www.standard.co.uk/",
	"The Independent": "https://www.independent.co.uk/",
	"ITV News": "https://www.itv.com/"
};
//TODO these are now inconsistent, some have slashes at the end and some don't
export let topics = {
	"sport": {
		"The Guardian": 'https://www.theguardian.com/sport/3019/dec/31/',
		"BBC": 'https://www.bbc.com/sport/',
		"Reuters": "https://www.reuters.com/news/sports/",
		"Sky News": "https://www.skysports.com/news-wire",
		"Associated Press": "https://apnews.com/apf-sports",
		"Evening Standard": "https://www.standard.co.uk/sport",
		"The Independent": "https://www.independent.co.uk/sport",
		"ITV News": "https://www.itv.com/news/sport"
		},
    "politics": {
		"The Guardian": 'https://www.theguardian.com/politics/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/politics/',
		"Reuters": "https://www.reuters.com/politics/",
		"Sky News": "https://news.sky.com/politics",
		"Associated Press": "https://apnews.com/apf-politics",
		"Evening Standard": "https://www.standard.co.uk/news/politics",
		"The Independent": "https://www.independent.co.uk/politics",
		"ITV News": "https://www.itv.com/news/politics"
		},
    "uk": {
		"The Guardian": 'https://www.theguardian.com/uk-news/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/uk/',
		"Reuters": "https://uk.reuters.com/news/uk/",
		"Sky News": "https://news.sky.com/uk",
		"Associated Press": "https://apnews.com/UnitedKingdom",
		"Evening Standard": "https://www.standard.co.uk/news/uk",
		"The Independent": "https://www.independent.co.uk/news/uk",
		"ITV News": "https://www.itv.com/news"
		},
    "science": {
		"The Guardian": 'https://www.theguardian.com/science/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/science_and_environment/',
		"Reuters": "https://www.reuters.com/news/science/",
		"Sky News": "https://news.sky.com/technology",
		"Associated Press": "https://apnews.com/apf-science",
		"Evening Standard": "https://www.standard.co.uk/topic/science",
		"The Independent": "https://www.independent.co.uk/news/science",
		"ITV News": "https://www.itv.com/news/science"
		},
    "technology": {
		"The Guardian": 'https://www.theguardian.com/technology/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/technology/',
		"Reuters": "https://www.reuters.com/news/technology/",
		"Sky News": "https://news.sky.com/technology",
		"Associated Press": "https://apnews.com/apf-technology",
		"Evening Standard": "https://www.standard.co.uk/tech",
		"The Independent": "https://www.independent.co.uk/life-style/gadgets-and-tech",
		"ITV News": "https://www.itv.com/news/technology"
		},
    "environment": {
		"The Guardian": 'https://www.theguardian.com/environment/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/science_and_environment/',
		"Reuters": "https://uk.reuters.com/news/environment/",
		"Sky News" : "https://news.sky.com/climate",
		"Associated Press": "https://apnews.com/Environment",
		"Evening Standard": "https://www.standard.co.uk/topic/environment",
		"The Independent": "https://www.independent.co.uk/environment",
		"ITV News": "https://www.itv.com/news/environment"
		},
    "society": {
		"The Guardian": 'https://www.theguardian.com/society/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/education/',
		"Reuters": "https://www.reuters.com/news/lifestyle/",
		"Sky News" : "https://news.sky.com/strangenews",
		"Associated Press": "https://apnews.com/apf-lifestyle",
		"Evening Standard": "https://www.standard.co.uk/lifestyle",
		"The Independent": "https://www.independent.co.uk/life-style",
		"ITV News": "https://www.itv.com/news/consumer"
		},
    "business": {
		"The Guardian": 'https://www.theguardian.com/business/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/business/',
		"Reuters": "https://www.reuters.com/finance/",
		"Sky News": "https://news.sky.com/business",
		"Associated Press": "https://apnews.com/apf-business",
		"Evening Standard": "https://www.standard.co.uk/business",
		"The Independent": "https://www.independent.co.uk/business",
		"ITV News": "https://www.itv.com/news/business"
		},
    "world": {
		"The Guardian": 'https://www.theguardian.com/world/3019/dec/31/',
		"BBC": 'https://www.bbc.com/news/world/',
		"Reuters": "https://www.reuters.com/news/world/",
		"Sky News": "https://news.sky.com/world",
		"Associated Press": "https://apnews.com/apf-intlnews",
		"Evening Standard": "https://www.standard.co.uk/news/world",
		"The Independent": "https://www.independent.co.uk/news/world",
		"ITV News": "https://www.itv.com/news/world"
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