# Newsreader

[![TheSSX](https://circleci.com/gh/thessx/newsreader.svg?style=shield&circle-token=38ac7c107864b63c9a55ed5216fb098854fae00a)](https://app.circleci.com/pipelines/github/TheSSX/Newsreader)

<img src="https://github.com/TheSSX/Newsreader/tree/master/icons/icon128.png" width="128">

Newsreader is a Google Chrome extension that reads a summarised version of the latest news articles through text-to-speech technology! Customise your 5-minute bulletin from a selection of 9 news topics from 9 news publications. Newsreader works in the background, so you can continue surfing the web while listening to the latest news. Make sure your speakers are switched on!

Newsreader was developed as a final-year Honours' Project by Sam Glendenning of the University of Dundee. 

------------

### Functionality
<img src="https://github.com/TheSSX/Newsreader/tree/master/screenshots/screen1.png" width="300">

1. Click the orange Newsreader icon in the top right of the Chrome browser, to the right of the address bar.
2. Customise the settings of Newsreader to your liking. This includes a range of spoken language, spoken sentences per article, news publications to hear from and news topics to hear about.
3. Press the big circular Play button to begin! Newsreader will take a few seconds to compile a news bulletin before articles are read aloud one after the other.
4. Play, pause and stop the bulletin using the circular buttons. Note that the Play button switches to a Pause button while a bulletin is playing and vice versa.

------------

### Installation

##### Main Method

1. Visit [Newsreader on the Chrome Web Store.](https://chrome.google.com/webstore/category/extensions)
2. Click ``Add to Chrome``
3. Once the confirmation window appears, click ``Add extension``

##### Alternative Method

1. Download the latest release of Newsreader [in the releases page.](https://github.com/TheSSX/Newsreader/releases)
2. Extract the directory from the downloaded ZIP file.
3. Type ``chrome://extensions`` in the address bar of Chrome.
4. Toggle ``Developer mode`` on in the top right of the page.
5. Click ``Load unpacked`` on the top left of the page.
6. Navigate to the extracted Newsreader directory and click ``Select folder``

------------

### Features

- Nine selectable news publications to hear from (see the full list below).
- Nine selectable news topics (see the full topic below).
- Ten different spoken languages (see the full list below).
- Summarised news articles between two and six sentences. Remove the waffle and piffle from stories!

#### Spoken Languages

- English
- French
- Spanish
- German
- Italian
- Dutch
- Chinese (simplified)
- Japanese
- Korean
- Russian

#### News Topics

- Business
- Politics
- UK
- World
- Sport
- Science
- Technology
- Society
- Environment

#### News Publications

- [The Guardian](https://www.theguardian.com/) (UK) (Left-wing)
- [BBC](https://www.bbc.com/news) (UK) (Left-wing)
- [The Independent](https://www.independent.co.uk/) (UK) (Left-wing)
- [Reuters](https://www.reuters.com/) (UK) (Neutral)
- [Associated Press](https://apnews.com/) (USA) (Neutral)
- [Sky News](https://news.sky.com/) (UK) (Neutral)
- [News.com.au](https://www.news.com.au/) (Australia) (Right-wing)
- [ITV News](https://www.itv.com/news/) (UK) (Right-wing)
- [London Evening Standard](https://www.standard.co.uk/) (UK) (Right-wing)

News publications were included based on their overall fact-check record and bias to give a balance to the stories and articles read by Newsreader. This is to help make the news bulletins as clean and factual as possible.

------------

### How it works

Newsreader was written in modular Javascript, transpiled to ES5 Javascript for tests. 
Every time the user presses Play, a new bulletin is started. For each topic selected, Newsreader uses AJAX to query a random selected news source and pick a random article dedicated to that news topic. The article is then summarised down to the selected number of sentences and read aloud through Chrome's built-in text-to-speech in the user's chosen language.

### Summarisation

Summarisation of news articles is achieved thanks to [the SMMRY API!](https://smmry.com/)
SMMRY uses a special algorithm that processes natural language to summarise large articles down to a selected number of sentences. This helps to remove the waffle of articles and extract the main points of the text. 

### Translation

Translation of news articles is achieved thanks to [the Yandex API!](https://translate.yandex.com/)
Yandex offers a selection of 97 languages to translate texts of any length. Ten of the most popular ones were selected for Newsreader.

### Building and testing

Building and testing of Newsreader can only be done by cloning this repository (see [alternative installation method](#alternative-method)). Builds and tests are executed in the command line using [Node.js.](https://nodejs.org/) Make sure that is installed globally first.

#### Building
Open a terminal and navigate to the project root directory. Type:
```
npm run-script build
```

#### Testing
Open a terminal and navigate to the project root directory. Type:
```
npm test
```