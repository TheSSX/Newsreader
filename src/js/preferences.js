// News sources and their respective homepage links
export const sourcelinks =
    {
        "The Guardian": "https://www.theguardian.com/",         // left wing
        "BBC": "https://www.bbc.com/",                          // left wing
        "The Independent": "https://www.independent.co.uk/",    // left wing
        "Reuters": "https://www.reuters.com/",                  // neutral
        "Sky News": "https://news.sky.com/",                    // neutral
        "Associated Press": "https://apnews.com/",              // neutral
        "Evening Standard": "https://www.standard.co.uk/",      // right wing
        "ITV News": "https://www.itv.com/",                     // right wing
        "News.com.au": "https://www.news.com.au/"               // right wing
    };

// News topics, with each source having a webpage for each topic.
// The only exception to this is News.com.au, which doesn't have a UK news page
export const topiclinks =
    {
        "sport":
            {
                "The Guardian": 'https://www.theguardian.com/sport/3019/dec/31/',
                "BBC": 'https://www.bbc.com/sport/',
                "The Independent": "https://www.independent.co.uk/sport/",
                "Reuters": "https://www.reuters.com/news/sports/",
                "Sky News": "https://www.skysports.com/news-wire/",
                "Associated Press": "https://apnews.com/apf-sports/",
                "Evening Standard": "https://www.standard.co.uk/sport/",
                "ITV News": "https://www.itv.com/news/sport/",
                "News.com.au": "https://www.news.com.au/sport/"
            },
        "politics":
            {
                "The Guardian": 'https://www.theguardian.com/politics/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/politics/',
                "The Independent": "https://www.independent.co.uk/politics/",
                "Reuters": "https://www.reuters.com/politics/",
                "Sky News": "https://news.sky.com/politics/",
                "Associated Press": "https://apnews.com/apf-politics/",
                "Evening Standard": "https://www.standard.co.uk/news/politics/",
                "ITV News": "https://www.itv.com/news/politics/",
                "News.com.au": "https://www.news.com.au/national/politics/"
            },
        "uk":
            {
                "The Guardian": 'https://www.theguardian.com/uk-news/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/uk/',
                "The Independent": "https://www.independent.co.uk/news/uk/",
                "Reuters": "https://uk.reuters.com/news/uk/",
                "Sky News": "https://news.sky.com/uk/",
                "Associated Press": "https://apnews.com/UnitedKingdom/",
                "Evening Standard": "https://www.standard.co.uk/news/uk/",
                "ITV News": "https://www.itv.com/news/"
            },
        "science":
            {
                "The Guardian": 'https://www.theguardian.com/science/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/science_and_environment/',
                "The Independent": "https://www.independent.co.uk/news/science/",
                "Reuters": "https://www.reuters.com/news/science/",
                "Sky News": "https://news.sky.com/technology/",
                "Associated Press": "https://apnews.com/apf-science/",
                "Evening Standard": "https://www.standard.co.uk/topic/science/",
                "ITV News": "https://www.itv.com/news/science/",
                "News.com.au": "https://www.news.com.au/technology/science/"
            },
        "technology":
            {
                "The Guardian": 'https://www.theguardian.com/technology/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/technology/',
                "The Independent": "https://www.independent.co.uk/life-style/gadgets-and-tech/",
                "Reuters": "https://www.reuters.com/news/technology/",
                "Sky News": "https://news.sky.com/technology/",
                "Associated Press": "https://apnews.com/apf-technology/",
                "Evening Standard": "https://www.standard.co.uk/tech/",
                "ITV News": "https://www.itv.com/news/technology/",
                "News.com.au": "https://www.news.com.au/technology/"
            },
        "environment":
            {
                "The Guardian": 'https://www.theguardian.com/environment/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/science_and_environment/',
                "The Independent": "https://www.independent.co.uk/environment/",
                "Reuters": "https://uk.reuters.com/news/environment/",
                "Sky News": "https://news.sky.com/climate/",
                "Associated Press": "https://apnews.com/Environment/",
                "Evening Standard": "https://www.standard.co.uk/topic/environment/",
                "ITV News": "https://www.itv.com/news/environment/",
                "News.com.au": "https://www.news.com.au/technology/environment/"
            },
        "society":
            {
                "The Guardian": 'https://www.theguardian.com/society/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/education/',
                "The Independent": "https://www.independent.co.uk/life-style/",
                "Reuters": "https://www.reuters.com/news/lifestyle/",
                "Sky News": "https://news.sky.com/strangenews/",
                "Associated Press": "https://apnews.com/apf-lifestyle/",
                "Evening Standard": "https://www.standard.co.uk/lifestyle/",
                "ITV News": "https://www.itv.com/news/consumer/",
                "News.com.au": "https://www.news.com.au/lifestyle/"
            },
        "business":
            {
                "The Guardian": 'https://www.theguardian.com/business/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/business/',
                "The Independent": "https://www.independent.co.uk/business/",
                "Reuters": "https://www.reuters.com/finance/",
                "Sky News": "https://news.sky.com/business/",
                "Associated Press": "https://apnews.com/apf-business/",
                "Evening Standard": "https://www.standard.co.uk/business/",
                "ITV News": "https://www.itv.com/news/business/",
                "News.com.au": "https://www.news.com.au/finance/"
            },
        "world":
            {
                "The Guardian": 'https://www.theguardian.com/world/3019/dec/31/',
                "BBC": 'https://www.bbc.com/news/world/',
                "The Independent": "https://www.independent.co.uk/news/world/",
                "Reuters": "https://www.reuters.com/news/world/",
                "Sky News": "https://news.sky.com/world/",
                "Associated Press": "https://apnews.com/apf-intlnews/",
                "Evening Standard": "https://www.standard.co.uk/news/world/",
                "ITV News": "https://www.itv.com/news/world/",
                "News.com.au": "https://www.news.com.au/world/"
            }
    };

/**
 * Non-customisable settings to tinker with the software. Only sentences are in use currently
 */
export const min_sentences = 2;
export const max_sentences = 8;
export let pitch = 1;
export let volume = 1;
export let rate = 1;