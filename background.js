const script = document.createElement('script');
script.src = 'jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    window.speechSynthesis.cancel();
    callSport();
});




//Gets sport news
function callSport()
{
    // Send a message to the active tab
    $.ajax({ url: 'https://www.theguardian.com/sport/3019/dec/31/', success: async function(data)
        {
            const all = data.split('<a href="https://www.theguardian.com/sport/');

            let linksarr = [];
            for (let i=1; i<all.length; i+=1)
            {
                linksarr.push(all[i].split('"')[0]);
            }

            const links = Array.from(new Set(linksarr));

            const publication = new SpeechSynthesisUtterance("The Guardian");
            const topic = new SpeechSynthesisUtterance("Sport");
            window.speechSynthesis.speak(publication);
            window.speechSynthesis.speak(topic);

            let randomlink;
            let result = false;

            do
            {
                do
                {
                    randomlink = "https://www.theguardian.com/sport/" + links[Math.floor(Math.random()*links.length)];
                }
                while (randomlink.startsWith("https://www.theguardian.com/sport/video/"));

                try
                {
                    const data = await extractArticle(randomlink);
                    result = extractText(data);
                }
                catch(ajaxError)
                {

                }
            }
            while (result === false);

            return true;
        },
        error: function(error)
        {
            console.log(error);
            return false;
        }
    });
}

function extractText(data)
{
    if (data.includes('<p><strong>'))
    {
        console.log(theurl + " has <strong>");
        return false;
    }

    let headline = data.split('<title>')[1].split('|')[0];
    console.log(headline);
    const headlinemsg = new SpeechSynthesisUtterance(headline);
    window.speechSynthesis.speak(headlinemsg);

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

    for (let i=0; i<3; i++)
    {
        data = data.split('<aside ')[0] + data.split('</aside>')[1];
    }

    let articletext = $("<p>").html(data).text();
    articletext = articletext.split('Share via Email')[1];
    articletext = articletext.replace(/\r?\n|\r/g, "");
    articletext = articletext.split('undefined')[0];
    articletext = articletext.split('Topics')[0];
    articletext = articletext.split(/[\.\!]+(?!\d)\s*|\n+\s*/).join('. ');  //split by '.' but ignoring decimal numbers
    articletext = articletext.slice(0, -1);     //removes a final quote that sometimes appears. Doesn't affect text without the quote.

    console.log(articletext);
    const sentences = articletext.split('. ');

    // Currently splitting into sentences for speech synthesis, as window.speechSynthesis cuts out with
    // sentences that are too long
    for (let i=0; i<sentences.length; i++)
    {
        const msg = new SpeechSynthesisUtterance(sentences[i]);
        window.speechSynthesis.speak(msg);
    }

    return true;
}

function extractArticle(theurl)
{
    return $.ajax({url: theurl}).done(function(data){}).fail(function(ajaxError){});    //not convinced this actually returns or throws an error
}
