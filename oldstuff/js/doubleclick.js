function setupDoubleClick(websiteUrl, dictionary, areaId, maxAllowedWords, target) {
	//warning message for developers
	if (!websiteUrl ) {
		alert("Please specify required parameters (websiteurl) to setupDoubleClick()")
			return;
	}

	//shows the definition layer
	var showLayer = function(e) {
        // don't do anything on A href elements
        // and when this is right button of mouse.
		if (e.target.nodeName.toLowerCase()=="a" || e.button==2) {
			jQuery("#definition_layer").remove();
			return;
		}
		e.preventDefault();
		var lookup = getSelectedText();
		lookup = lookup.replace(/[\.\*\?;!()\+,\[:\]<>^_`\[\]{}~\\\/\"\'=]/g, " ");
		lookup = lookup.replace(/\s+/g, " ");
		if (lookup != null && lookup.replace("/\s/g", "").length > 0) {
			
			//disable the double-click feature if the lookup string
			//exceeds the maximum number of allowable words
			if (maxAllowedWords && lookup.split(/[ -]/).length > maxAllowedWords)
				return;

			//append the layer to the DOM only once
			if (jQuery("#definition_layer").length == 0) {
				var imageUrl = "http://newspapermap.com/js/definition-layer.gif";
				jQuery("body").append("<div id='definition_layer' style='position:absolute; cursor:pointer;'><img src='" + imageUrl + "' alt='' title=''/></div>");
			}

			//move the layer at the cursor position
			jQuery("#definition_layer").map(function() {
					jQuery(this).css({'left' : e.pageX-30, 'top' : e.pageY-40});
					});

			//open the definition popup clicking on the layer
			jQuery("#definition_layer").mouseup(function(e) {
					e.stopPropagation();
					openPopup(lookup);
					});
		} else {
			jQuery("#definition_layer").remove();
		}
	};

	//opens the definition popup 
	var openPopup = function(lookup) {
		var searchUrl = websiteUrl;
		if (target) {
			var popup = window.open(searchUrl + "?q=" + lookup, target, "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=no,copyhistory=no,width=600,height=550,top=300,left=300");
			if (popup)
				popup.focus();
		} else {
			window.open(searchUrl + "?q=" + lookup);
		}
	};

	var area = areaId ? "#" + areaId : "body";
	jQuery(area).mouseup(showLayer);
}

/*
 * Cross-browser function to get selected text
 */

function getSelectedText(){
    if(window.getSelection)
        return window.getSelection().toString();
    else if(document.getSelection)
        return document.getSelection();
    else if(document.selection)
        return document.selection.createRange().text;
    return "";
}
