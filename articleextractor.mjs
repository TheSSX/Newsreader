/**
 Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 summarise the article itself.
 */
export class ArticleExtractor
{
    /**
     * Backup function to extract Guardian article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractGuardianText(data)
    {
        if (data.includes('<p><strong>') || data.includes('<h2>'))
        {
            return undefined;
        }

        data = data.split('<div class="content__article-body from-content-api js-article__body" itemprop="articleBody" data-test-id="article-review-body">')[1];
        if (data === undefined)
        {
            return undefined;
        }

        let copy = false;
        let articletext = "";
        let counter = 2;

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                // articletext += " ";
                // counter += 1;
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        //articletext = articletext.replace(/(<([^>]+)>)/ig, "");

        return articletext;
    }

    /**
     * Backup function to extract BBC article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractBBCText(data)
    {
        data = data.split('<p class="story-body__introduction">')[1];
        if (data === undefined)
        {
            return undefined;
        }

        let copy = true;
        let articletext = "";
        let counter = 0;

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                // articletext += " ";
                // counter += 1;
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        //articletext = articletext.replace(/(<([^>]+)>)/ig, "");

        return articletext;
    }

    /**
     * Backup function to extract Reuters article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractReutersText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 2;

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                // counter += 1;
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/\&rsquo\;/g, "'");
        // articletext = articletext.replace(/\&lsquo\;/g, "'");
        // articletext = articletext.replace(/\&ldquo\;/g, '"');
        // articletext = articletext.replace(/\&rdquo\;/g, '"');
        // articletext = articletext.replace(/<footer.+\/footer>/g, '');
        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.split(' - ')[1];
        if (articletext.split('All quotes delayed a minimum of ')[0])
        {
            articletext = articletext.split('All quotes delayed a minimum of ')[0];
        }

        return articletext;
    }

    /**
     * Backup function to extract Sky News article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractSkyText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 3;

        while (counter < data.length - 1)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                // counter += 1;
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.replace('&#163;', '£');
        // articletext = articletext.replace('&#8364;', '€');
        // while (articletext.startsWith(" "))
        // {
        //     articletext = articletext.substr(1);
        // }

        return articletext;
    }

    //TODO the second line returned an error at one point
    //Uncaught (in promise) TypeError: Cannot read property 'split' of undefined
    //     at Function.extractAPHeadline (articleextractor.mjs:306)
    //     at Function.extractAP (pageparser.mjs:733)
    static extractAPHeadline(data)
    {
        data = data.split('<div class="CardHeadline">')[1];
        data = data.split('<div class="Component-signature-')[0];
        return data.replace(/(<([^>]+)>)/ig, "");
    }

    /**
     * Backup function to extract Associated Press article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractAPText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 0;

        data = data.split('<div class="Article" data-key="article">')[1];
        data = data.split('<div class="bellow-article">')[0];

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter, counter + 2) === '<p';
            const endoftext = data.substring(counter, counter + 4) === '</p>';

            if (startoftext)
            {
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        //articletext = articletext.replace(/(<([^>]+)>)/ig, "");

        if (articletext.split('(AP) — ')[1])
        {
            articletext = articletext.split('(AP) — ')[1];
        }

        return articletext;
    }

    /**
     * Backup function to extract Evening Standard article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractEveningStandardText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 0;

        if (data.split('Update newsletter preferences')[1])
        {
            data = data.split('Update newsletter preferences')[1];
        } else if (data.split('<div class="body-content">')[1])
        {
            data = data.split('<div class="body-content">')[1];
        } else
        {
            return undefined;
        }

        if (data === undefined)
        {
            return undefined;
        }

        if (data.split('<aside class="tags">')[0])
        {
            data = data.split('<aside class="tags">')[0];
        } else if (data.split('<div class="share-bar-syndication">')[0])
        {
            data = data.split('<div class="share-bar-syndication">')[0];
        } else
        {
            return undefined;
        }

        data = ArticleExtractor.cleanSurrounding(data);
        // data = data.replace(/<span.+>.+<\/span>/ig, '');

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.replace(/<figure .+>/g, '');
        // articletext = articletext.replace(/<\/figure>/g, '');
        // articletext = articletext.replace(/<figure[^.+]*>/g, "");
        // articletext = articletext.replace(/<\/figure>/g, "");
        // articletext = articletext.replace('&amp;', '&');
        // articletext = articletext.replace('&nbsp;', ' ');
        // articletext = articletext.split('&nbsp;').join(" ");
        // articletext = articletext.split('&amp;').join("&");

        return articletext;
    }

    /**
     * Backup function to extract Independent article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractIndependentText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 0;

        if (data.split('<div class="body-content">')[1])
        {
            data = data.split('<div class="body-content">')[1];
        } else
        {
            return undefined;
        }

        if (data === undefined)
        {
            return undefined;
        }

        if (data.split('<div class="article-bottom">')[0])
        {
            data = data.split('<div class="article-bottom">')[0];
        } else if (data.split('<div class="partners" id="partners">')[0])
        {
            data = data.split('<div class="partners" id="partners">')[0];
        } else
        {
            return undefined;
        }

        data = ArticleExtractor.cleanSurrounding(data);

        // data = data.replace(/<figure.+>.+<\/figure>/ig, '');
        // data = data.replace('&nbsp;', ' ');
        // data = data.replace(/<figure .+>/g, '');
        // data = data.replace(/<\/figure>/g, '');
        // data = data.replace(/<figure[^.+]*>/g, "");
        // data = data.split(/<figure.+>.+<\/figure>/g).join('');
        // data = data.split(/<p><em>.+<\/em><\/p>/g).join('');
        // data = data.split(/<figure[^.+]*>/g).join('');
        // data = data.split(/<\/figure>/g).join('');

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';
            let startofspecialtext = false;
            if (counter >= 12)
            {
                startofspecialtext = data.substring(counter - 13, counter) === '<p dir="ltr">';
            }

            if (startoftext || startofspecialtext)
            {
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.replace(/<figure .+>/g, '');
        // articletext = articletext.replace(/<\/figure>/g, '');
        // articletext = articletext.replace(/<figure[^.+]*>/g, "");
        // articletext = articletext.replace(/<\/figure>/g, "");
        // articletext = articletext.replace('&amp;', '&');
        // articletext = articletext.replace('&nbsp;', ' ');
        // articletext = articletext.split('&nbsp;').join(" ");
        // articletext = articletext.split('&amp;').join("&");
        // articletext.replace("Sharing the full story, not just the headlines", " ");

        return articletext;
    }

    /**
     * Backup function to extract ITV News article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractITVText(data)
    {
        let copy = false;
        let articletext = "";
        let counter = 0;

        if (data.split('<article class="update">')[1])
        {
            data = data.split('<article class="update">')[1];
        } else
        {
            return undefined;
        }

        if (data === undefined)
        {
            return undefined;
        }

        if (data.split('<div className="update__share">')[0])
        {
            data = data.split('<div className="update__share">')[0];
        } else
        {
            return undefined;
        }

        data = ArticleExtractor.cleanSurrounding(data);

        // data = data.replace(/<figure.+>.+<\/figure>/ig, '');
        // data = data.replace(/<span.+>.+<\/span>/ig, '');
        // data = data.replace('&nbsp;', ' ');
        // data = data.replace(/<figure .+>/g, '');
        // data = data.replace(/<\/figure>/g, '');
        // data = data.replace(/<figure[^.+]*>/g, "");
        // data = data.split(/<figure.+>.+<\/figure>/g).join('');
        // data = data.split(/<p><em>.+<\/em><\/p>/g).join('');
        // data = data.split(/<figure[^.+]*>/g).join('');
        // data = data.split(/<\/figure>/g).join('');

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>';
            const endoftext = data.substring(counter - 4, counter) === '</p>';

            if (startoftext)
            {
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.replace(/<figure .+>/g, '');
        // articletext = articletext.replace(/<\/figure>/g, '');
        // articletext = articletext.replace(/<figure[^.+]*>/g, "");
        // articletext = articletext.replace(/<\/figure>/g, "");
        // articletext = articletext.replace('&#39;', ("'"));					//not as convinced this is doing anything, honest to God
        // articletext = articletext.replace('&quot;', ('"'));
        // articletext = articletext.split('&#39;').join("'");
        // articletext = articletext.split('&quot;').join('"');

        return articletext;
    }

    /**
     * Backup function to extract News.com.au article text ourselves due to SMMRY not being available
     * @param data - the data from the article page
     * @returns {string|undefined} - the string of the article text, undefined if not available
     */
    static extractNewsAUText(data)
    {
        if (data === undefined)
        {
            return undefined;
        }

        return this.extractAUStart(data) + " " + this.extractAUEnd(data);
    }

    /**
     * Extracting the start of a News.au.com article (inside the <p class="description"> part)
     * @param data - the data from the article page
     * @returns {string} - the start of the article
     */
    static extractAUStart(data)
    {
        if (data.split('<p class="description">')[1].split('</p>')[0])
        {
            return data.split('<p class="description">')[1].split('</p>')[0];
        }

        return "";
    }

    /**
     * Extracting the rest of a News.com.au article (inside the <div class="story-content"> part)
     * @param data - the data from the article page
     * @returns {string} - the rest of the article
     */
    static extractAUEnd(data)
    {
        if (data.split('<div class="story-content">')[1])
        {
            data = data.split('<div class="story-content">')[1];
        } else
        {
            return "";
        }

        if (data.split('<div id="share-and-comment">')[0])
        {
            data = data.split('<div id="share-and-comment">')[0];
        } else
        {
            return "";
        }

        data = data.split(/<div[^.+]*>/g).join('');
        data = ArticleExtractor.cleanSurrounding(data);

        let counter = 0;
        let copy = false;
        let articletext = "";

        while (counter < data.length - 3)
        {
            const startoftext = data.substring(counter - 3, counter) === '<p>' && data[counter] !== '<';
            const endoftext = data.substring(counter - 4, counter) === '</p>';
            let startofspecialtext = false;
            if (counter >= 30)
            {
                startofspecialtext = data.substring(counter - 30, counter) === '<p class="standfirst-content">';
            }

            if (startoftext || startofspecialtext)
            {
                copy = true;
            } else if (endoftext)
            {
                articletext += " ";
                copy = false;
            }

            if (copy)
            {
                articletext += data[counter];
            }

            counter += 1;
        }

        articletext = ArticleExtractor.cleanText(articletext);

        // articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        // articletext = articletext.split('&#x2013;').join("-");
        // articletext = articletext.split('&#x201D;').join('"');
        // articletext = articletext.split('&#x2018;').join('"');
        // articletext = articletext.split('&#x2019;').join("'");
        // articletext = articletext.split('&#x201C;').join('"');
        // articletext = articletext.split('&amp;').join('&');
        // articletext = articletext.split('&#x2026;').join('...');
        // articletext = articletext.split('&#x2022;').join('•');
        // articletext = articletext.split('&#x200B;').join('');
        // articletext = articletext.split('&#x2014;').join('-');
        // articletext = articletext.split('&#xF3;').join('ó');

        return articletext;
    }

    static cleanSurrounding(articletext)
    {
        articletext = articletext.replace(/<figure .+>/g, '');
        articletext = articletext.replace(/<\/figure>/g, '');
        articletext = articletext.replace(/<figure[^.+]*>/g, "");
        articletext = articletext.replace(/<\/figure>/g, "");
        articletext = articletext.replace(/<footer .+\/footer>/g, '');
        articletext = articletext.replace(/<span .+>.+<\/span>/ig, '');
        articletext = articletext.replace(/<figure .+>.+<\/figure>/ig, '');
        articletext = articletext.replace(/<figure .+>.+<\/figure>/ig, '');
        articletext = articletext.split(/<figure .+>.+<\/figure>/g).join('');
        articletext = articletext.split(/<span .+>.+<\/span>/g).join('');
        articletext = articletext.split(/<p><em>.+<\/em><\/p>/g).join('');
        articletext = articletext.split(/<figure[^.+]*>/g).join('');
        articletext = articletext.split(/<\/figure>/g).join('');

        return articletext;
    }

    static cleanText(articletext)
    {
        articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        articletext = articletext.replace(/(<([^>]+)>)/ig, "");
        articletext = articletext.split(/<p><em>.+<\/em><\/p>/g).join('');
        articletext = articletext.split(/<p><strong>.+<\/strong><\/p>/g).join('');
        articletext = articletext.split(/<p><i>.+<\/i><\/p>/g).join('');
        articletext = articletext.split(/<p><b>.+<\/b><\/p>/g).join('');
        articletext = articletext.split(/<p><u>.+<\/u><\/p>/g).join('');
        articletext = articletext.split('&#x2013;').join("-");
        articletext = articletext.split('&#x201D;').join('"');
        articletext = articletext.split('&#x2018;').join('"');
        articletext = articletext.split('&#x2019;').join("'");
        articletext = articletext.split('&#x201C;').join('"');
        articletext = articletext.split('&amp;').join('&');
        articletext = articletext.split('&#x2026;').join('...');
        articletext = articletext.split('&#x2022;').join('•');
        articletext = articletext.split('&#x200B;').join('');
        articletext = articletext.split('&#x2014;').join('-');
        articletext = articletext.split('&#xF3;').join('ó');
        articletext = articletext.split('&#39;').join("'");
        articletext = articletext.split('&quot;').join('"');
        articletext = articletext.split('&nbsp;').join(" ");
        articletext = articletext.split(' span>').join("");
        articletext = articletext.split('&amp;').join('&');
        articletext = articletext.split('&#163;').join('£');
        articletext = articletext.split('&#8364;').join('€');
        articletext = articletext.split(/\&rsquo\;/g).join("'");
        articletext = articletext.split(/\&lsquo\;/g).join("'");
        articletext = articletext.split(/\&ldquo\;/g).join('"');
        articletext = articletext.split(/\&rdquo\;/g).join('"');
        articletext = articletext.split('Sharing the full story, not just the headlines').join(' ');

        articletext = articletext.trim();
        articletext = articletext.replace(/\s+/g, ' ');

        return articletext;
    }
}