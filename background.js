const script = document.createElement('script');
script.src = 'jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    callSport();
});




//Gets sport news
function callSport()
{
    // Send a message to the active tab
    $.ajax({ url: 'https://www.theguardian.com/sport/3019/dec/31/', success: function(data)
        {
            const all = data.split('<a href="https://www.theguardian.com/sport/');

            let linksarr = [];
            for (let i=1; i<all.length; i+=1)
            {
                linksarr.push(all[i].split('"')[0]);
            }

            const links = Array.from(new Set(linksarr));

            let randomlink = "https://www.theguardian.com/sport/" + links[Math.floor(Math.random()*links.length)];
            while (randomlink.startsWith("https://www.theguardian.com/sport/video/"))
            {
                randomlink = "https://www.theguardian.com/sport/" + links[Math.floor(Math.random()*links.length)];
            }

            const publication = new SpeechSynthesisUtterance("The Guardian");
            const topic = new SpeechSynthesisUtterance("Sport");
            window.speechSynthesis.speak(publication);
            window.speechSynthesis.speak(topic);
            extractArticle(randomlink);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}

function extractArticle(theurl)
{
    $.ajax({ url: theurl, success: function(data)
        {
            let headline = data.split('<title>')[1].split('|')[0];
            console.log(headline);
            const headlinemsg = new SpeechSynthesisUtterance(headline);
            window.speechSynthesis.speak(headlinemsg);

            data = data.replace(/<figcaption [^|]+<\/figcaption>/g, '');
            data = data.replace(/<figure [^|]+<\/figure>/g, '');
            data = data.replace(/<twitter-widget [^|]+<\/twitter-widget>/g, '');

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
            articletext = articletext.split('.').join('. ');        //has issues with decimal numnbers

            console.log(articletext);
            const msg = new SpeechSynthesisUtterance(articletext);
            window.speechSynthesis.speak(msg);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
}
