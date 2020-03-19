google.load("jquery", "1.4.2");
google.load('search', '1');

var oSearchLinkedin;
var oSearchFacebook;
var oSearchTwitter;

function addPaginationLinks(oSearch, sDivSearch) {
	// The cursor object has all things to do with pagination
	var cursor = oSearch.cursor;
	var curPage = cursor.currentPageIndex; // check what page the app is on
	var pagesDiv = document.createElement('div');
	for (var i = 0; i < cursor.pages.length; i++) {
		var page = cursor.pages[i];
		if (curPage == i) { // if we are on the curPage, then don't make a link
			var label = document.createTextNode(' ' + page.label + ' ');
			pagesDiv.appendChild(label);
		} else {
			// If we aren't on the current page, then we want a link to this page.
			// So we create a link that calls the gotoPage() method on the searcher.
			var link = document.createElement('a');
			link.href = 'javascript:oSearch.gotoPage('+i+');';
			link.innerHTML = page.label;
			link.style.marginRight = '2px';
			pagesDiv.appendChild(link);
		}
	}

	var contentDiv = document.getElementById(sDivSearch);
	contentDiv.appendChild(pagesDiv);
}

function searchComplete(oSearch, sDivSearch) {
	var contentDiv = document.getElementById(sDivSearch);
	contentDiv.innerHTML = '<img src="pics/logo-'+sDivSearch+'.png" class="logo" />';
	if (oSearch.results && oSearch.results.length > 0) {
		var resultList = document.createElement('ul');
		var results = oSearch.results;
		for (var i = 0; i < results.length; i++) {
			var result = results[i];
			var resultContainer = document.createElement('li');
			var sImg = '';
			var sTitle = result.titleNoFormatting;
			if ('resultsFacebook' == sDivSearch) {
				sImg = '<img class="profile-result-img" src="http://graph.facebook.com/' + result.url.substr(result.url.lastIndexOf('/') + 1, result.url.length - 1) + '/picture" />';
				sTitle = sTitle.replace(" | Facebook", "")
			}
			if ('resultsTwitter' == sDivSearch) {
				sImg = '<img class="profile-result-img" src="http://api.twitter.com/1/users/profile_image/' + result.url.substr(result.url.lastIndexOf('/') + 1, result.url.length - 1) + '" />';
				sTitle = sTitle.replace(" on Twitter", "")
			}
			if ('resultsLinkedin' == sDivSearch) {
				sTitle = sTitle.replace(" | LinkedIn", "")
				sTitle = sTitle.replace(" - LinkedIn", "")
				sTitle = sTitle.replace(" - Directory", "")
			}
			resultContainer.innerHTML = '<h1><a href="'+result.url+'">'+sImg+sTitle+'</a></h1><p class="profile-result-text-block">'+result.content+'</p>';
			resultList.appendChild(resultContainer);
		}
		contentDiv.appendChild(resultList);
		//addPaginationLinks(oSearch, sDivSearch);
	} else {
		if ('resultsFacebook' == sDivSearch) {
			contentDiv.innerHTML += '<p class="noresults">Your search did not match any people on Facebook.</p>';
		} else if ('resultsTwitter' == sDivSearch) {
			contentDiv.innerHTML += '<p class="noresults">Your search did not match any people on Twitter.</p>';
		} else if ('resultsLinkedin' == sDivSearch) {
			contentDiv.innerHTML += '<p class="noresults">Your search did not match any people on LinkedIn.</p>';
		}
	}
}

function searchPeople(sKeywords) {
	oSearchLinkedin = new google.search.WebSearch();
	oSearchLinkedin.setSiteRestriction('linkedin.com');
	oSearchLinkedin.setSearchCompleteCallback(this, searchComplete, [oSearchLinkedin, 'resultsLinkedin']);
	oSearchLinkedin.setResultSetSize(google.search.Search.LARGE_RESULTSET);
	oSearchLinkedin.execute(sKeywords);
	
	oSearchFacebook = new google.search.WebSearch();
	oSearchFacebook.setSiteRestriction('facebook.com/people');
	oSearchFacebook.setSearchCompleteCallback(this, searchComplete, [oSearchFacebook, 'resultsFacebook']);
	oSearchFacebook.setResultSetSize(google.search.Search.LARGE_RESULTSET);
	oSearchFacebook.execute(sKeywords);

	oSearchTwitter = new google.search.WebSearch();
	oSearchTwitter.setSiteRestriction('twitter.com');
	oSearchTwitter.setSearchCompleteCallback(this, searchComplete, [oSearchTwitter, 'resultsTwitter']);
	oSearchTwitter.setResultSetSize(google.search.Search.LARGE_RESULTSET);
	oSearchTwitter.execute('"on Twitter" '+sKeywords);
	
	$.get('http://gregorio.hernandezcaso.com/labs/instant-people-search/search.php?type=googleprofiles&q='+escape(sKeywords), function(data) {
	  $('#resultsGoogleProfiles').html(data);
		doneWorking();
	});
}

function doSearch(sKeywords) {
	searchPeople(sKeywords);
	return false;
}

function updateSuggestedKeyword(keyword) {
	$('#suggested-keyword').html(keyword);
}

function OnLoad() {
	// Initialize stuff
	currentSearch = '';
	currentSuggestion = '';
	xhrWorking = false; // is an XHR request currently being processed?
	searchPending = false; // do we need to do another search after we're finished processing the current one?
	
	var searchBox = $('#searchBox input');
	searchBox.keyup(doInstantSearch);
	searchBox.submit(doInstantSearch);
	searchBox.focus();
	
	$('a').live('click', function(){
		$(this).attr('target', '_blank');
	});
}

gg = {};
gg.www = {};
gg.www.suggest = {};
gg.www.suggest.handleResponse = function(suggestions) {
    // get top suggestion
        
    var searchTerm = parseSuggestionsString(suggestions);

    // if no suggestions are available, then search for the exact keyword
    if (!searchTerm) {
        searchTerm = keyword;
        updateSuggestedKeyword(searchTerm+' (Exact search)');
    } else {
        updateSuggestedKeyword('Suggested Search: '+searchTerm); // try not printing out "Suggestion:"
        if (searchTerm == currentSuggestion) {
            doneWorking();
            return; // don't update the video
        }    
    }
		doSearch(searchTerm);
    currentSuggestion = searchTerm;
}

function doInstantSearch() {
    if (xhrWorking) {
        searchPending = true;
        return;
    }
    var searchBox = $('#searchBox input');
    // Don't repeat search if nothing changed on keyUp, or the search box is blank
    if (searchBox.val() == currentSearch) {
        return;
    }
    currentSearch = searchBox.val();
    
    // When search box is cleared, hide moreVideos, clear the video, and reset the saved suggestion
    if (searchBox.val() == '') {
        currentSuggestion = '';
        updateSuggestedKeyword('Search People Instantly');
        
        return; // don't search for anything
    }
    
    // Do the search
    keyword = searchBox.val();
    
    // Scrape YouTube top search suggestions
    var the_url = 'http://suggestqueries.google.com/complete/search?hl=en&hjson=t&jsonp=window.gg.www.suggest.handleResponse&q='+encodeURIComponent(searchBox.val())+'&cp=1';
    
    $.ajax({
       type: "GET",
       url: the_url,
       dataType: "script"
     });
     
    xhrWorking = true;
}

function doneWorking() {
    xhrWorking = false;

    if (searchPending) {
        // another search happened while we were processing this one, so we need to take care of it.
        searchPending = false;
        doInstantSearch();
    }
}

function parseSuggestionsString(suggestions) {
    if (suggestions[1][0]) {
        return suggestions[1][0][0]; // traverse YouTube JSON object for top suggestion
    } else {
        return null;
    }
}

google.setOnLoadCallback(OnLoad);