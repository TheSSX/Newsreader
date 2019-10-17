const script = document.createElement('script');
script.src = 'jquery.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(function(tab) {
    // Send a message to the active tab
    $.ajax({ url: 'https://www.theguardian.com/sport/3019/dec/31/', success: function(data)
        {
            const arr = data.split('<a href="https://www.theguardian.com/sport/');

            let newarr = [];
            for (let i=1; i<arr.length; i+=1)
            {
                newarr.push(arr[i].split('"')[0]);
            }

            const final = new Set(newarr);
            console.log(final);
        },
        error: function(error)
        {
            console.log(error);
        }
    });
});
