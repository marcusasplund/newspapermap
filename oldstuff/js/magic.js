// I'd like to apologise in advance for this code, its going to be quite shit mainly because
// im a PHP dev and primarily stick to backend work, my JS isnt as good as my PHP.

$(document).ready(function(){
	// onload
	chg_iframe('/'+window.location.hash);
	

	// nav bar
	$('nav a').click(function () {
		var anchor = $(this).attr('href');
		chg_iframe(anchor);
	});
	
	// hover menu
	create_submenu('google');
	create_submenu('news');
	create_submenu('social');
	create_submenu('lookup');
	create_submenu('misc');
	
});

function create_submenu(id){
	$('nav #cat_'+id).hover(function(){
		$('nav .submenu').css('display', 'none');
		$('nav #'+id).css('display', 'block');
	});
}

function iframe(url){
	return '<iframe src="'+url+'"></iframe>';
}

function urldecode(str){
    return decodeURIComponent(str.replace(/\+/g, '%20'));
}

// this needs refactored...
function chg_iframe(anchor){
	switch(anchor){
		case '/#google':
			$('#main').html(iframe('http://www.google.com'));
			break;
		case '/#youtube':
			$('#main').html(iframe('http://feross.net/instant/'));
			break;
		case '/#maps':
			$('#main').html(iframe('http://hartlabs.net/instant_maps/'));
			break;
		case '/#images':
			$('#main').html(iframe('http://cdn.michaelhart.me/mh/instant_images/?5'));
			break;
		case '/#hackernews':
			$.get('/hackernews.php', function(data) {
				$('#main').html(data);
				$('#bigtextbox').focus();
				// instant search
				$('#bigtextbox').keyup(function(event){
					$('#results').empty();
					if(event.keyCode == '13'){
						event.preventDefault();
					}
					$.ajax({
						type: "GET",
						url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=ABQIAAAA8O8mSce9tKPqIPIhtnZ5zBQP52N5WdHoGVYOVSaw3sEK1dfrLhQ9X6O-mw0ySazoxjow4STXTWN08Q&q=site:news.ycombinator.com '+$('#bigtextbox').val(),
						dataType: "jsonp",
						success: function(data){
							$.each(data.responseData.results, function(i, result){
								$('#results').append('<p><a href="'+urldecode(result.url)+'">'+result.title+'</a><br>'+result.content+'</p>');
							});
						}                 
					});
				});
			});
			break;
		case '/#twitter':
			$.get('/twitter.php', function(data) {
				$('#main').html(data);
				$('#bigtextbox').focus();
				// instant search
				$('#bigtextbox').keyup(function(event){
					$('#results').empty();
					if(event.keyCode == '13'){
						event.preventDefault();
					}
					$.ajax({
						type: "GET",
						url: 'http://search.twitter.com/search.json?lang=en&q='+$('#bigtextbox').val(),
						dataType: "jsonp",
						success: function(data){
							$.each(data.results, function(i, result){
								$('#results').append('<p>'+result.text + '</p>');
							});
						}                 
					});
				});
			});
			break;
		case '/#php':
			// theres a number of ways to do this, this is the quickest, may refactor later
			$.get('/phpman.php', function(data) {
				$('#main').html(data);
				$('#bigtextbox').focus();
				// instant search
				$('#bigtextbox').keyup(function(event){
					$('#results').empty();
					if(event.keyCode == '13'){
						event.preventDefault();
					}
					$.ajax({
						type: "GET",
						url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=ABQIAAAA8O8mSce9tKPqIPIhtnZ5zBQP52N5WdHoGVYOVSaw3sEK1dfrLhQ9X6O-mw0ySazoxjow4STXTWN08Q&q=site:php.net '+$('#bigtextbox').val(),
						dataType: "jsonp",
						success: function(data){
							$.each(data.responseData.results, function(i, result){
								$('#results').append('<p><a href="'+result.url+'">'+result.title+'</a><br>'+result.content+'</p>');
							});
						}                 
					});
				});
			});
			break;
		case '/#techmeme':
			// theres a number of ways to do this, this is the quickest, may refactor later
			$.get('/techmeme.php', function(data) {
				$('#main').html(data);
				$('#bigtextbox').focus();
				// instant search
				$('#bigtextbox').keyup(function(event){
					$('#results').empty();
					if(event.keyCode == '13'){
						event.preventDefault();
					}
					$.ajax({
						type: "GET",
						url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=ABQIAAAA8O8mSce9tKPqIPIhtnZ5zBQP52N5WdHoGVYOVSaw3sEK1dfrLhQ9X6O-mw0ySazoxjow4STXTWN08Q&q=site:techmeme.com '+$('#bigtextbox').val(),
						dataType: "jsonp",
						success: function(data){
							$.each(data.responseData.results, function(i, result){
								$('#results').append('<p><a href="'+result.url+'">'+result.title+'</a><br>'+result.content+'</p>');
							});
						}                 
					});
				});
			});
			break;
		case '/#reddit':
			// theres a number of ways to do this, this is the quickest, may refactor later
			$.get('/reddit.php', function(data) {
				$('#main').html(data);
				$('#bigtextbox').focus();
				// instant search
				$('#bigtextbox').keyup(function(event){
					$('#results').empty();
					if(event.keyCode == '13'){
						event.preventDefault();
					}
					$.ajax({
						type: "GET",
						url: 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&key=ABQIAAAA8O8mSce9tKPqIPIhtnZ5zBQP52N5WdHoGVYOVSaw3sEK1dfrLhQ9X6O-mw0ySazoxjow4STXTWN08Q&q=site:reddit.com '+$('#bigtextbox').val(),
						dataType: "jsonp",
						success: function(data){
							$.each(data.responseData.results, function(i, result){
								$('#results').append('<p><a href="'+result.url+'">'+result.title+'</a><br>'+result.content+'</p>');
							});
						}                 
					});
				});
			});
			break;
		case '/#itunes':
			$('#main').html(iframe('http://labs.stephenou.com/itunes'));
			break;
		case '/#flickr':
			$('#main').html(iframe('http://obout.ru/pinstant/'));
			break;
		case '/#rss':
			$('#main').html(iframe('http://feediop.com/instant'));
			break;
		case '/#quickplay':
			$('#main').html(iframe('http://www.tikku.com/youtube-quickplay'));
			break;
		case '/#youtube2':
			$('#main').html(iframe('http://www.youtubeinstantsearch.com/'));
			break;
		case '/#babelplex':
			$('#main').html(iframe('http://www.babelplex.com/'));
			break;
		case '/#arledia':
			$('#main').html(iframe('http://www.arledia.be/'));
			break;
		case '/#weather':
			$('#main').html(iframe('http://www.instantweather.co.uk/'));
			break;
		case '/#people':
			$('#main').html(iframe('http://gregorio.hernandezcaso.com/labs/instant-people-search/'));
			break;
		case '/#amazon':
			$('#main').html(iframe('http://wasschenktman.at/instantsearch.php5'));
			break;
		case '/#wikipedia':
			$('#main').html(iframe('http://www.theinstantwiki.com/'));
			break;
		case '/#ebay':
			$('#main').html(iframe('http://storeslider.com'));
			break;
		case '/#dictionary':
			$('#main').html(iframe('http://instantionary.com/'));
			break;
		case '/#ebay2':
			$('#main').html(iframe('http://www.ebaytools.net/'));
			break;
		case '/#youtube3':
			$('#main').html(iframe('http://listandplay.com/'));
			break;
		case '/#awsmer':
			$('#main').html(iframe('http://www.awsmer.com/search.php'));
			break;/*
		case '/#':
			$('#main').html(iframe('http://www./'));
			break;
		case '/#':
			$('#main').html(iframe('http://www./'));
			break;
		case '/#':
			$('#main').html(iframe('http://www./'));
			break;
		case '/#':
			$('#main').html(iframe('http://www./'));
			break;
			*/
		default:
			$('#main').html(iframe('http://www.google.com'));
			break;
	}
}
