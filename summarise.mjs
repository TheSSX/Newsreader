import {apikey, smmryurl} from "./smmry.js";

/**
 Class to summarise articles. Communicates with the SMMRY API or, failing that, attempts to
 summarise the article itself.
 */
export class Summarise
{
    /**
     * Receives a URL to an article and the number of sentences to summarise down to
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {Promise<void>} - the JSON response from SMMRY
     */
    static async summarise(articleurl, sentences)
    {
        const url = this.constructsmmryurl(articleurl, sentences);

        try
        {
            return await this.contactsmmry(url);
        }
        catch
        {
            return undefined;
        }
    }

    /**
     * Inserts given parameters into a URL through which to query SMMRY over HTTP
     * @param articleurl - the article URL
     * @param sentences - the number of sentences to summarise down to
     * @returns {string} - the exact HTTP URL to send
     */
    static constructsmmryurl(articleurl, sentences)
    {
        return `${smmryurl}&SM_API_KEY=${apikey}&SM_LENGTH=${sentences}&SM_QUESTION_AVOID&SM_EXCLAMATION_AVOID&SM_URL=${articleurl}`;
    }

    /**
     * Queries SMMRY and returns JSON data
     * @param url - the GET request to SMMRY
     * @returns {*} - actually returns the JSON response from SMMRY
     */
    static contactsmmry(url)
    {
        return $.ajax({ url: url}).done(function(data){}).fail(function(ajaxError){});      //same here
    }

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
		
		/**data = data.replace(/<figcaption [^|]+<\/figcaption>/g, '');    //removes caption under article image
        data = data.replace(/<figure [^|]+<\/figure>/g, '');
        data = data.replace(/<twitter-widget [^|]+<\/twitter-widget>/g, '');
        data = data.replace(/<em>[^|]+<\/em>/g, '');    //removes italicised text not directly related to article*/
		
		let copy = false;
		let articletext = "";
		let counter = 2;

		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';
			//const startoflink = data[counter] === '<' && data[counter+1] === 'a';
			//const endoflink = data[counter] === '>' && data[counter-1] === 'a' && data[counter-2] === '/' && data[counter-3] === '<';

			if (startoftext) // || endoflink
			{
				articletext += " ";
				counter += 1;
				copy = true;
			}
			else if (endoftext) // || startoflink
			{
				copy = false;
			}
			
			if (copy)
			{
				articletext += data[counter];
			}
			
			counter += 1;
		}
		articletext = articletext.replace(/(<([^>]+)>)/ig,"");

		/*articletext = articletext.replace(/<\/a>/g, '');
		//articletext = articletext.replace(/<a href=".+">/g, '');	This line here is really fucking me up. It behaves differently every time.
		//Sometimes, it deletes all text up to another later link. Sometimes it just replaces the following text with a space. Who fucking knows.
		articletext = articletext.replace(/<span.*>/g, '');
		articletext = articletext.replace(/<\/span>/g, '');		*/
		
		
		
		
		
		
        /**if (data.includes('<p><strong>') || data.includes('<h2><strong>'))
        {
            return undefined;
        }

        /** Remove unneccesary things from article page 
        data = data.replace(/<figcaption [^|]+<\/figcaption>/g, '');    //removes caption under article image
        data = data.replace(/<figure [^|]+<\/figure>/g, '');
        data = data.replace(/<twitter-widget [^|]+<\/twitter-widget>/g, '');
        data = data.replace(/<em>[^|]+<\/em>/g, '');    //removes italicised text not directly related to article

        /**
         This has been the bane of my life. Most other HTML elements can seemingly be removed
         but <aside> can't. I have tried all I can to remove this and its containing text
         from the data and the result is below. THIS NEEDS IMPROVING
         */
        //data = data.replace(/<aside [^|]+<\/aside>/g, '');
        //data = data.replace('<aside .*?</aside>', '');
/**
        for (let i=0; i<3; i++)
        {
            data = data.split('<aside ')[0] + data.split('</aside>')[1];
        }

        let articletext = $("<p>").html(data).text();
        articletext = articletext.split('Share via Email')[1];
        articletext = articletext.replace(/\r?\n|\r/g, "");
        articletext = articletext.split('undefined')[0];
        articletext = articletext.split('Topics')[0];
		
        articletext = articletext.split(/[\.\!]+(?!\d)\s*|\n+\s).join('. ');  //split by '.' but ignoring decimal numbers
        //articletext = articletext.slice(0, -1);     //removes a final quote that sometimes appears. Doesn't affect text without the quote.
		*/

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

		/**
		This still needs to deal with links leftover in the text. They take the following form:
		while union bosses <a href="https://www.google.com" class="example_class">are unhappy with the outcome</a> they still need to address
		*/
		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';
			//const startoflink = data[counter] === '<' && data[counter+1] === 'a';
			//const endoflink = data[counter] === '>' && data[counter-1] === 'a' && data[counter-2] === '/' && data[counter-3] === '<';

			if (startoftext) // || endoflink
			{
				articletext += " ";
				counter += 1;
				copy = true;
			}
			else if (endoftext) // || startoflink
			{
				copy = false;
			}
			
			if (copy)
			{
				articletext += data[counter];
			}
			
			counter += 1;
		}

		articletext = articletext.replace(/(<([^>]+)>)/ig,"");

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

		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';

			if (startoftext)
			{
				counter += 1;
				copy = true;
			}
			else if (endoftext)
			{
				copy = false;
			}

			if (copy)
			{
				articletext += data[counter];
			}

			counter += 1;
		}

		articletext = articletext.replace(/\&rsquo\;/g, "'");
		articletext = articletext.replace(/\&lsquo\;/g, "'");
		articletext = articletext.replace(/\&ldquo\;/g, '"');
		articletext = articletext.replace(/\&rdquo\;/g, '"');
		articletext = articletext.replace(/<footer.+\/footer>/g, '');
		articletext = articletext.replace(/(<([^>]+)>)/ig,"");
		articletext = articletext.split(' - ')[1];
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
		let counter = 2;

		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';

			if (startoftext)
			{
				counter += 1;
				copy = true;
			}
			else if (endoftext)
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

		/*articletext = articletext.replace(/<strong>/g, '');
		articletext = articletext.replace(/<\/strong>/g, '');
		articletext = articletext.replace(/<a.+>/g, '');
		articletext = articletext.replace(/<\/a>/g, '');*/
		articletext = articletext.replace(/(<([^>]+)>)/ig,"");
		articletext = articletext.replace('&#163;', '£');
		articletext = articletext.replace('&#8364;', '€');
		while (articletext.startsWith(" "))
		{
			articletext = articletext.substr(1);
		}

		return articletext;
	}

	static extractAPHeadline(data)
	{
		data = data.split('<div class="CardHeadline">')[1];
		data = data.split('<div class="Component-signature-')[0];
		return data.replace(/(<([^>]+)>)/ig,"");
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

		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '<' && data[counter+1] === 'p';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';

			if (startoftext)
			{
				copy = true;
			}
			else if (endoftext)
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

		articletext = articletext.replace(/(<([^>]+)>)/ig,"");

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
		}
		else if (data.split('<div class="body-content">')[1])
		{
			data = data.split('<div class="body-content">')[1];
		}
		else
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
		}
		else if (data.split('<div class="share-bar-syndication">')[0])
		{
			data = data.split('<div class="share-bar-syndication">')[0];
		}
		else
		{
			return undefined;
		}

		//data = data.replace(/<figure.+>.+<\/figure>/ig, '');
		data = data.replace(/<span.+>.+<\/span>/ig, '');
		// data = data.replace('&nbsp;', ' ');
		// data = data.replace(/<figure .+>/g, '');
		// data = data.replace(/<\/figure>/g, '');
		// data = data.replace(/<figure[^.+]*>/g,"");
		// data = data.split(/<figure.+>.+<\/figure>/g).join('');
		// data = data.split(/<figure[^.+]*>/g).join('');
		// data = data.split(/<\/figure>/g).join('');

		//console.log(data);

		while (counter < data.length-3)
		{
			const startoftext = data[counter] === '<' && data[counter+1] === 'p';
			const endoftext = data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>';

			if (startoftext)
			{
				copy = true;
			}
			else if (endoftext)
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

		articletext = articletext.replace(/(<([^>]+)>)/ig,"");
		articletext = articletext.replace(/<figure .+>/g, '');
		articletext = articletext.replace(/<\/figure>/g, '');
		articletext = articletext.replace(/<figure[^.+]*>/g,"");
		articletext = articletext.replace(/<\/figure>/g,"");
		articletext = articletext.replace('&amp;', '&');
		articletext = articletext.replace('&nbsp;', ' ');
		articletext = articletext.split('&nbsp;').join(" ");
		articletext = articletext.split('&amp;').join("&");

		return articletext;
	}
}