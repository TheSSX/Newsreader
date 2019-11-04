// // const script = document.createElement('script');
// // script.src = 'jquery.js';
// // script.type = 'text/javascript';
// // document.getElementsByTagName('head')[0].appendChild(script);
//
// // Called when the user clicks on the browser action.
// // chrome.browserAction.onClicked.addListener(function(tab) {
// //     window.speechSynthesis.cancel();
// //     callSport();
// // });
//
// const start = document.createElement('script');
// start.src = "./start";
// start.type = "module";
// document.getElementsByTagName('head')[0].appendChild(start);
//
// const script = document.createElement('script');
// script.src = 'jquery.js';
// script.type = 'text/javascript';
// document.getElementsByTagName('head')[0].appendChild(script);
//
// //Gets sport news
// function callSport()
// {
//     $.ajax({ url: 'https://www.theguardian.com/sport/3019/dec/31/', success: async function(data)
//     {
//         const all = data.split('<a href="https://www.theguardian.com/sport/');
//
//         let linksarr = [];
//         for (let i=1; i<all.length; i+=1)
//         {
//             linksarr.push(all[i].split('"')[0]);
//         }
//
//         const links = Array.from(new Set(linksarr));
//
//         const publication = new SpeechSynthesisUtterance("The Guardian");
//         const topic = new SpeechSynthesisUtterance("Sport");
//         window.speechSynthesis.speak(publication);
//         window.speechSynthesis.speak(topic);
//
//         let randomlink;
//         let result = false;
//
//         do
//         {
//             do
//             {
//                 randomlink = "https://www.theguardian.com/sport/" + links[Math.floor(Math.random()*links.length)];
//             }
//             while (randomlink.startsWith("https://www.theguardian.com/sport/video/"));
//
//             try
//             {
//                 const data = await extractArticle(randomlink);
//                 result = extractText(data);
//             }
//             catch(ajaxError)
//             {
//
//             }
//         }
//         while (result === false);
//
//         return true;
//     },
//     error: function(error)
//     {
//         console.log(error);
//         return false;
//     }});
// }
//
//
//
// function extractArticle(theurl)
// {
//     return $.ajax({url: theurl}).done(function(data){}).fail(function(ajaxError){});    //not convinced this actually returns or throws an error
// }
