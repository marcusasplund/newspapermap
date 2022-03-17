[![GitHub issues](https://img.shields.io/github/issues/marcusasplund/newspapermap.svg)](https://github.com/marcusasplund/newspapermap/issues)
[![Build status](https://travis-ci.org/marcusasplund/newspapermap.svg?branch=master)](https://travis-ci.org/marcusasplund/newspapermap)


[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard) 

# newspapermap

## background
In 2010 we made [https://newspapermap.com](https://newspapermap.com) because we wanted a good way to find international local news.

In 2011 it got really popular and was featured in hundreds of newssites all over the world; from [The Atlantic](https://www.theatlantic.com/technology/archive/2011/05/reading-the-worlds-press-from-luxembourg-to-djibouti/238943/) to Yomiuri Shinbun and everything between.

It got a lot of love from libraries and [educational institutions](https://www.google.se/search?q=site:.edu+newspapermap.com)

We enabled access to our db for some researchers at John Hopkins and Penn Universities enabling them to get around the ban for gun violence research in making a [new corpus](http://www.cs.jhu.edu/~anni/papers/alnc_lrec14.pdf) and as a side product get [The Gun Violence Database](https://www.ldc.upenn.edu/sites/www.ldc.upenn.edu/files/callison-burch_0.pdf)

Over the years we have made some sporadic updates, both in UI and db, but more or less neglected it in later years.

We still think that it may have some relevance and have decided to try to do a little upgrade and by open sourcing the code we might get some nice feedback and input.

Feel free to [open a PR](https://github.com/marcusasplund/newspapermap/pulls) or tweet us your feedback/idea to [@newspapermap](https://twitter.com/newspapermap)

We also have a severely neglected [facebookpage](https://facebook.com/newspapermap)

The new version is (for a start) mostly written in javascript with a little help of [Hyperapp](https://github.com/jorgebucaran/hyperapp) and [milligram css](https://milligram.io/)


## FAQ

Q: -Can i have access to all your data for commercial purposes?

A: -Nope.

Q: -Can i have access to all or a subset of your data for scientific/educational purposes?

A: -Probably. Email details to newspapermap@gmail.com and we will get back to you.

## todo

- [ ] dynamic ui translation
- [ ] link for updating data
- [x] spiderfying close icons
- [x] nicer icons

## installation

````bash

$ git clone https://github.com/marcusasplund/newspapermap
$ cd newspapermap
$ yarn
$ yarn start

````
