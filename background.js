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
            let headline = data.split('<h1 class="content__headline " itemprop="headline">')[1].split('</h1>')[0];
            if (headline === undefined)
            {
                headline = data.split('<span class="content__headline--interview-wrapper">')[1].split('</span>')[0];
            }
            console.log(headline);

            data = data.replace(/<figcaption [^|]+<\/figcaption>/g, '');
            data = data.replace(/<aside [^|]+<\/aside>/g, '');
            data = data.replace(/<figure [^|]+<\/figure>/g, '');
            data = data.replace(/<div data-twitter-event[^|]+<\/div>/g, '');

            let articletext = $("<p>").html(data).text();
            articletext = articletext.split('Share via Email')[1];
            articletext = articletext.replace(/\r?\n|\r/g, "");
            articletext = articletext.split('.').join('. ');

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
