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
		
		/**data = data.replace(/<figcaption [^|]+<\/figcaption>/g, '');    //removes caption under article image
        data = data.replace(/<figure [^|]+<\/figure>/g, '');
        data = data.replace(/<twitter-widget [^|]+<\/twitter-widget>/g, '');
        data = data.replace(/<em>[^|]+<\/em>/g, '');    //removes italicised text not directly related to article*/
		
		let copy = false;
		let articletext = "";
		let counter = 2;

		while (counter < data.length-3)
		{		
			if (data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<')
			{
				articletext += " ";
				counter += 1;
				copy = true;
			}
			else if (data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>')
			{
				copy = false;
			}
			
			if (copy)
			{
				articletext += data[counter];
			}
			
			counter += 1;
		}

		articletext = articletext.replace(/<\/a>/g, '');
		//articletext = articletext.replace(/<a href=".+">/g, '');	This line here is really fucking me up. It behaves differently every time.
		//Sometimes, it deletes all text up to another later link. Sometimes it just replaces the following text with a space. Who fucking knows.
		articletext = articletext.replace(/<span.*>/g, '');
		articletext = articletext.replace(/<\/span>/g, '');				
		
		
		
		
		
		
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
		console.log("Text is " + articletext);
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
		
		let copy = true;
		let articletext = "";
		let counter = 0;

		/**
		This still needs to deal with links leftover in the text. They take the following form:
		while union bosses <a href="https://www.google.com" class="example_class">are unhappy with the outcome</a> they still need to address
		*/
		while (counter < data.length-3)
		{			
			if (data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p')
			{
				copy = false;
			}
			else if (data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<')
			{
				articletext += " ";
				counter += 1;
				copy = true;
			}
			
			if (copy)
			{
				articletext += data[counter];
			}
			
			counter += 1;
		}

        return articletext;
    }

    /**
     * Backup function to extract BBC article text ourselves due to SMMRY not being available
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
			if (data[counter] === '>' && data[counter-1] === 'p' && data[counter-2] === '<')
			{
				//articletext += " ";
				counter += 1;
				copy = true;
			}
			else if (data[counter] === '<' && data[counter+1] === '/' && data[counter+2] === 'p' && data[counter+3] === '>')
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
		articletext = articletext.replace(/<span.+>/g, '');
		articletext = articletext.replace(/<\/span>/g, '');		
		articletext = articletext.replace(/<a.+>/g, '');
		articletext = articletext.replace(/<\/a>/g, '');
		articletext = articletext.split(' - ')[1];

        return articletext;
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
}