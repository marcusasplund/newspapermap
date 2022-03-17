/* configuration */
var maxLength = 20;
/* writing HTML */
document.write(
  '<div data-role="page"data-theme="a"  id="list">' +
  '  <div data-role="header" data-position="fixed">' +
'    <a href="index.html?" data-role="button" data-icon="arrow-l"' +
    '      rel="external">hem</a>' +
  '    <h1>tidningsappen</h1>' +
  '  </div>' +
    '  <div data-role="content">' +
	  '  </div>' +
  '  <div data-role="content">' +
  '    <ul data-role="listview" id="articleList" data-dividertheme="a" data-theme="a"  data-inset="true" >' +
  '	<li data-role="list-divider"><h3>Senaste nytt</h3><p>ALPHA (testversion)</p></li> ' +
    '    </ul>' 
);
for(var i=1; i<=maxLength; i++){
  document.write(
    '<h3 id="list' + i + '"><a href="#article' + i + '" id="link' + i + '">&nbsp;</a></h3>'
  );
}
document.write(
  '    </ul>' +
  '  </div>' +
  '</div>'
);
for(i=1; i<=maxLength; i++){
  document.write(
    '<div data-role="page" data-theme="a" id="article' + i + '">' +
    '  <div data-role="header" data-theme="a" data-position="inline" data-nobackbtn="true">' +
	  '    <h1>tidningsappen</h1>' +
 /*   '    <a href="#" id="openButton' + i + '" data-role="button" data-icon="plus"' +
    '      class="ui-btn-right" rel="external">Läs hela</a>' */ 
    '  </div>' +
    '  <div data-role="content" data-theme="a">' +
		    '    <h2 id="item-info' + i + '">&nbsp;</h2>' +
		    '    <h2 id="articleHeader' + i + '">&nbsp;</h2>' +
    '    <div id="articleContent' + i + '" class="articleContent"></div>' +

    '    </div>' +
			    '    <div data-role="footer"  data-position="fixed" data-theme="a" >' +
	
		    '    <div data-role="navbar">' +
	'		<ul> ' +
    '      <li><a href="#article' + String(i-1) + '" data-role="button" class="prevButton" data-icon="arrow-l" ' +
    '        >&nbsp;</a></li>' +
	    '   <li> <a href="#" id="openButton' + i + '" data-role="button" data-icon="plus"' +
    '      class="button" rel="external">läs</a></li>' +
		    '   <li> <a href="index.html?" rel="external" data-role="button" data-icon="grid" >hem</a></li>' +
			'   <li> <a href="#list" data-role="button" data-icon="arrow-u">meny</a></li>' + 
    '      <li><a href="#article' + String(i+1) + '" data-role="button" data-icon="arrow-r"' +
    '          class="nextButton" data-iconpos="right">&nbsp;</a></li>' +
	   ' </ul>' +
	   '  </div>' +
    '  </div>' +
    '</div>'
  );
}
/* JSONP */
$(function(){

	

		
 getOnlineFeed('http://rss.bt.se/bt-nyheter');
 
			




/*
			 getOnlineFeed('http://rss.bt.se/bt-nyheter');
			   getOnlineFeed('http://feeds.feedburner.com/kenzas/RDTX');
			 	getOnlineFeed('http://www.clarin.com/rss/');
			 	 getOnlineFeed('http://www.svd.se/?service=rss&type=latest');
 getOnlineFeed('http://feeds.feedburner.com/clarin/ymhR');
  getOnlineFeed('http://news.google.se/news?pz=1&cf=all&ned=sv_se&hl=sv&topic=po&output=rss');
 getOnlineFeed('http://news.google.com/news?hl=se&ned=us&ie=UTF-8&oe=UTF-8&output=atom&topic=h');
getOnlineFeed('http://feeds.feedburner.com/Dvis');
 getOnlineFeed('http://hodgers.com/spotify/index.xml');
		 getOnlineFeed('http://friendfeed.com/pr-of-sweden?format=atom');
   	 getOnlineFeed('http://rss.news.yahoo.com/rss/topstories');
	 getOnlineFeed('http://siftlinks.com/feed/4d2b77e55cd85a1b03000000');
   	 getOnlineFeed('http://feeds.mbl.is/mm/rss/forsida.xml');
  getOnlineFeed('http://www.nytimes.com/services/xml/rss/nyt/GlobalHome.xml');
  getOnlineFeed('http://www.google.com/reader/public/atom/user/05369236094764351956/bundle/Svenska%20dagstidningar');
    	
  	   	 getOnlineFeed('http://news.google.se/news?q=senaste+nytt&output=rss');
  			   getOnlineFeed('http://japanese.engadget.com/rss.xml');
  		 getOnlineFeed('http://news.google.se/news?q=zlatan&output=rss');
		 		 getOnlineFeed('http://news.google.se/news?q=senaste+nytt&output=rss');
  		    getOnlineFeed('http://www.nytimes.com/services/xml/rss/nyt/GlobalHome.xml');
  		     getOnlineFeed('http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=atom&topic=h');
  getOnlineFeed('http://news.google.se/news?q=zlatan&output=rss');
  		     getOnlineFeed('http://www.google.com/reader/public/atom/user/05369236094764351956/bundle/Dagstidningar%20A-E');
  getOnlineFeed('http://www.google.com/reader/public/atom/user/05369236094764351956/bundle/Dagstidningar%20A-E');
  getOnlineFeed('http://news.google.com/news?hl=ja&ned=us&ie=UTF-8&oe=UTF-8&output=atom&topic=h');
  	getOnlineFeed('http://www.google.com/reader/public/atom/user/05369236094764351956/bundle/Dagstidningar%20A-E');
  getOnlineFeed('http://www.appbank.net/feed');
  getOnlineFeed('http://japanese.engadget.com/rss.xml');
  getOnlineFeed('http://www.bebit.co.jp/index.xml');  
  getOnlineFeed('http://www.ntt.com/rss/release.rdf?link_id=ostop_service_rss');
  getOnlineFeed('http://feeds.feedburner.com/gapsis');
  getOnlineFeed('http://octoba.net/feed');
  getOfflineFeed('google_news_jsonp.js');
    getOnlineFeed('http://news.google.se/news?q=oscarsson&output=rss');
*/
});
/* functions */
var listEntries = function(json) {
  if (!json.responseData.feed.entries) return false;
  $('#widgetTitle').text(json.responseData.feed.title);
  var articleLength =json.responseData.feed.entries.length;
  articleLength = (articleLength > maxLength) ? maxLength : articleLength;
  for (var i = 1; i <= articleLength ; i++) {
    var entry = json.responseData.feed.entries[i-1];
    $('#link' + i).text(entry.title);
    $('#articleHeader' + i).text(entry.title);
    $('#openButton' + i).attr('href', entry.link);
    $('#articleContent' + i).append(entry.content);
  }
 $('#article1 .prevButton').remove(); 
  $('#article' + articleLength + ' .nextButton').remove();
  if (articleLength < maxLength) {
    for (i = articleLength + 1; i <= maxLength; i++) {
      $('#list' + i).remove();
      $('#article' + i).remove();
    }
  }
};
var getOnlineFeed = function(url) {
  var script = document.createElement('script');
  script.setAttribute('src', 'http://ajax.googleapis.com/ajax/services/feed/load?callback=listEntries&hl=ja&output=json-in-script&q='
                      + encodeURIComponent(url)
                      + '&v=1.0&num=' + maxLength);
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);
};
var getOfflineFeed = function(url) {
  var script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('type', 'text/javascript');
  document.documentElement.firstChild.appendChild(script);
};