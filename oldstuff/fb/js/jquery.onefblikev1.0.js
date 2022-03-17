/*
	jQuery OneFBLike v1.0 - http://www.onerutter.com/onefblike
	Copyright (c) 2010 Jake Rutter
	This plugin available for use in all personal or commercial projects under both MIT and GPL licenses.
*/

(function($){  
    $.fn.extend({
        oneFBLike: function(options) {  
        
            //Set the default values, use comma to separate the settings 
            var defaults = {  
            	appID: '136294166472604',
				siteUrl: 'http://pap.as',
            	siteTitle: 'pap.as',
            	siteName: 'papas',
            	siteImage: 'http://pap.as/p114.png',
            	buttonWidth: 450,
            	buttonHeight: 80,
            	showfaces: true,
            	font: 'lucida grande',
            	layout: 'button_count',
            	action: 'like',
            	colorscheme: 'light'
            	
            }  
            
            var options =  $.extend(defaults, options);  
                        
            return this.each(function() {  
                var o = options;  
                var obj = $(this);
                
                // Add Meta Tags for additional data - options
                jQuery('head').append('<meta property="og:title" content="'+o.siteTitle+'"/>');
                jQuery('head').append('<meta property="og:site_name" content="'+o.siteName+'"/>');
                jQuery('head').append('<meta property="og:image" content="'+o.siteImage+'"/>');
                
                // Add #fb-root div - mandatory - do not remove
                jQuery('body').append('<div id="fb-root"></div>');
                
                // setup FB Developers App Link - do not touch
                window.fbAsyncInit = function() {
				FB.init({appId: o.appID, status: true, cookie: true, xfbml: true});
				};
				(function() {
				var e = document.createElement('script'); e.async = true;
				e.src = document.location.protocol +
				'//connect.facebook.net/en_US/all.js';
				document.getElementById('fb-root').appendChild(e);
				}());


                // Grab the URL and assign it to a variable
                var dynUrl = document.location;
                var fbDIV = obj;
                                
                              
                // Apply the like button to an element on the page and include all available options
                // If no options are passed in from the page, the defaults will be applied            
                jQuery(fbDIV).html('<fb:like href="'+dynUrl+'" width="'+o.buttonWidth+'" height="'+o.buttonHeight+'" show_faces="'+o.showfaces+'" font="'+o.font+'" layout="'+o.layout+'" action="'+o.action+'" colorscheme="'+o.colorscheme+'"/>')

                              
            });  
        } 
    }); 
})(jQuery);