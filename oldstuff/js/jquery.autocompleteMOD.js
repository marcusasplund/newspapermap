﻿(function(b){b.fn.extend({autocomplete:function(a,c){var e=typeof a=="string",c=b.extend({},b.Autocompleter.defaults,{url:e?a:null,data:e?null:a,delay:e?b.Autocompleter.defaults.delay:10,max:c&&!c.scroll?100:150},c);c.highlight=c.highlight||function(a){return a};c.formatMatch=c.formatMatch||c.formatItem;return this.each(function(){new b.Autocompleter(this,c)})},result:function(a){return this.bind("result",a)},search:function(a){return this.trigger("search",[a])},flushCache:function(){return this.trigger("flushCache")},setOptions:function(a){return this.trigger("setOptions",[a])},unautocomplete:function(){return this.trigger("unautocomplete")}});b.Autocompleter=function(a,c){var e,k;function n(){var s=o.selected();if(!s)return false;var g=s.result;l=g;if(c.multiple){var d=i(f.val());if(d.length>1){var p=c.multipleSeparator.length,k=b(a).selection().start,e,j=0;b.each(d,function(a,c){j+=c.length;if(k<=j)return e=a,false;j+=p});d[e]=g;g=d.join(c.multipleSeparator)}g+=c.multipleSeparator}f.val(g);h();f.trigger("result",[s.data,s.value]);return true}function m(a,b){if(t==e)o.hide();else{var g=f.val();if(b||g!=l)l=g,g=p(g),g.length>=c.minChars?(f.addClass(c.loadingClass),c.matchCase||(g=g.toLowerCase()),q(g,d,h)):(f.removeClass(c.loadingClass),o.hide())}}function i(a){return!a?[""]:!c.multiple?[b.trim(a)]:b.map(a.split(c.multipleSeparator),function(c){return b.trim(a).length?b.trim(c):null})}function p(g){if(!c.multiple)return g;var d=i(g);if(d.length==1)return d[0];d=b(a).selection().start;d=d==g.length?i(g):i(g.replace(g.substring(d),""));return d[d.length-1]}function h(){o.visible();o.hide();clearTimeout(r);f.removeClass(c.loadingClass);c.mustMatch&&f.search(function(a){a||(c.multiple?(a=i(f.val()).slice(0,-1),f.val(a.join(c.multipleSeparator)+(a.length?c.multipleSeparator:""))):(f.val(""),f.trigger("result",null)))})}function d(d,e){if(e&&e.length&&g){f.removeClass(c.loadingClass);o.display(e,d);var j=e[0].value;c.autoFill&&p(f.val()).toLowerCase()==d.toLowerCase()&&t!=k&&(f.val(f.val()+j.substring(p(l).length)),b(a).selection(l.length,l.length+j.length));o.show()}else h()}function q(g,d,h){c.matchCase||(g=g.toLowerCase());var e=j.load(g);if(e&&e.length)d(g,e);else if(typeof c.url=="string"&&c.url.length>0){var f={timestamp:+new Date};b.each(c.extraParams,function(a,c){f[a]=typeof c=="function"?c():c});b.ajax({mode:"abort",port:"autocomplete"+a.name,dataType:c.dataType,url:c.url,data:b.extend({q:p(g),limit:c.max},f),success:function(a){var e;if(!(e=c.parse&&c.parse(a))){e=[];for(var a=a.split("\n"),h=0;h<a.length;h++){var f=b.trim(a[h]);f&&(f=f.split("|"),e[e.length]={data:f,value:f[0],result:c.formatResult&&c.formatResult(f,f[0])||f[0]})}}j.add(g,e);d(g,e)}})}else o.emptyList(),h(g)}e=46;k=8;var f=b(a).attr("autocomplete","off").addClass(c.inputClass),r,l="",j=b.Autocompleter.Cache(c),g=0,t,v={mouseDownOnSelect:false},o=b.Autocompleter.Select(c,a,n,v),u;b.browser.opera&&b(a.form).bind("submit.autocomplete",function(){if(u)return u=false});f.bind((b.browser.opera?"keypress":"keydown")+".autocomplete",function(a){g=1;t=a.keyCode;switch(a.keyCode){case 38:a.preventDefault();o.visible()?o.prev():m(0,true);break;case 40:a.preventDefault();o.visible()?o.next():m(0,true);break;case 33:a.preventDefault();o.visible()?o.pageUp():m(0,true);break;case 34:a.preventDefault();o.visible()?o.pageDown():m(0,true);break;case c.multiple&&b.trim(c.multipleSeparator)==","&&188:case 9:case 13:if(n())return a.preventDefault(),u=true,false;break;case 27:o.hide();break;default:clearTimeout(r),r=setTimeout(m,c.delay)}}).focus(function(){g++}).blur(function(){g=0;v.mouseDownOnSelect||(clearTimeout(r),r=setTimeout(h,200))}).click(function(){g++>1&&!o.visible()&&m(0,true)}).bind("search",function(){function a(g,b){var d;if(b&&b.length)for(var e=0;e<b.length;e++)if(b[e].result.toLowerCase()==g.toLowerCase()){d=b[e];break}typeof c=="function"?c(d):f.trigger("result",d&&[d.data,d.value])}var c=arguments.length>1?arguments[1]:null;b.each(i(f.val()),function(c,g){q(g,a,a)})}).bind("flushCache",function(){j.flush()}).bind("setOptions",function(a,g){b.extend(c,g);"data"in g&&j.populate()}).bind("unautocomplete",function(){o.unbind();f.unbind();b(a.form).unbind(".autocomplete")})};b.Autocompleter.defaults={inputClass:"ac_input",resultsClass:"ac_results",loadingClass:"ac_loading",minChars:1,delay:400,matchCase:false,matchSubset:true,matchContains:false,cacheLength:10,max:100,mustMatch:false,extraParams:{},selectFirst:true,formatItem:function(a){return a[0]},formatMatch:null,autoFill:false,width:0,multiple:false,multipleSeparator:", ",highlight:function(a,c){return a.replace(RegExp("(?![^&;]+;)(?!<[^<>]*)("+c.replace(/([\^\$\(\)\[\]\{\}\*\.\+\?\|\\])/gi,"\\$1")+")(?![^<>]*>)(?![^&;]+;)","gi"),"<strong>$1</strong>")},scroll:true,scrollHeight:180};b.Autocompleter.Cache=function(a){function c(c,b){a.matchCase||(c=c.toLowerCase());var d=c.indexOf(b);a.matchContains=="word"&&(d=c.toLowerCase().search("\\b"+b.toLowerCase()));return d==-1?false:d==0||a.matchContains}function e(c,b){i>a.cacheLength&&n();m[c]||i++;m[c]=b}function k(){if(!a.data)return false;var c={},h=0;if(!a.url)a.cacheLength=1;c[""]=[];for(var d=0,k=a.data.length;d<k;d++){var f=a.data[d],f=typeof f=="string"?[f]:f,i=a.formatMatch(f,d+1,a.data.length);if(i!==false){var l=i.charAt(0).toLowerCase();c[l]||(c[l]=[]);f={value:i,data:f,result:a.formatResult&&a.formatResult(f)||i};c[l].push(f);h++<a.max&&c[""].push(f)}}b.each(c,function(c,g){a.cacheLength++;e(c,g)})}function n(){m={};i=0}var m={},i=0;setTimeout(k,25);return{flush:n,add:e,populate:k,load:function(e){if(!a.cacheLength||!i)return null;if(!a.url&&a.matchContains){var h=[],d;for(d in m)if(d.length>0){var k=m[d];b.each(k,function(a,b){c(b.value,e)&&h.push(b)})}return h}else if(m[e])return m[e];else if(a.matchSubset)for(d=e.length-1;d>=a.minChars;d--)if(k=m[e.substr(0,d)])return h=[],b.each(k,function(a,b){c(b.value,e)&&(h[h.length]=b)}),h;return null}}};b.Autocompleter.Select=function(a,c,e,k){var n;function m(){r&&(l=b("<div/>").hide().addClass(a.resultsClass).css("position","absolute").appendTo(document.body),j=b("<ul/>").appendTo(l).mouseover(function(a){i(a).nodeName&&i(a).nodeName.toUpperCase()=="LI"&&(d=b("li",j).removeClass(n).index(i(a)),b(i(a)).addClass(n))}).click(function(a){b(i(a)).addClass(n);e();c.focus();return false}).mousedown(function(){k.mouseDownOnSelect=true}).mouseup(function(){k.mouseDownOnSelect=false}),a.width>0&&l.css("width",a.width),r=false)}function i(a){for(a=a.target;a&&a.tagName!="LI";)a=a.parentNode;return!a?[]:a}function p(c){h.slice(d,d+1).removeClass(n);d+=c;d<0?d=h.size()-1:d>=h.size()&&(d=0);c=h.slice(d,d+1).addClass(n);if(a.scroll){var b=0;h.slice(0,d).each(function(){b+=this.offsetHeight});b+c[0].offsetHeight-j.scrollTop()>j[0].clientHeight?j.scrollTop(b+c[0].offsetHeight-j.innerHeight()):b<j.scrollTop()&&j.scrollTop(b)}}n="ac_over";var h,d=-1,q,f="",r=true,l,j;return{display:function(c,e){m();q=c;f=e;j.empty();for(var k=a.max&&a.max<q.length?a.max:q.length,i=0;i<k;i++)if(q[i]){var l=a.formatItem(q[i].data,i+1,k,q[i].value,f);l!==false&&(l=b("<li/>").html(a.highlight(l,f)).addClass(i%2==0?"ac_even":"ac_odd").appendTo(j)[0],b.data(l,"ac_data",q[i]))}h=j.find("li");a.selectFirst&&(h.slice(0,1).addClass(n),d=0);b.fn.bgiframe&&j.bgiframe()},next:function(){p(1)},prev:function(){p(-1)},pageUp:function(){d!=0&&d-8<0?p(-d):p(-8)},pageDown:function(){d!=h.size()-1&&d+8>h.size()?p(h.size()-1-d):p(8)},hide:function(){l&&l.hide();h&&h.removeClass(n);d=-1},visible:function(){return l&&l.is(":visible")},current:function(){return this.visible()&&(h.filter("."+n)[0]||a.selectFirst&&h[0])},show:function(){var d=b(c).offset();l.css({width:typeof a.width=="string"||a.width>0?a.width:b(c).width(),top:d.top+c.offsetHeight,left:d.left}).show();if(a.scroll&&(j.scrollTop(0),j.css({maxHeight:a.scrollHeight,overflow:"auto"}),b.browser.msie&&typeof document.body.style.maxHeight==="undefined")){var e=0;h.each(function(){e+=this.offsetHeight});d=e>a.scrollHeight;j.css("height",d?a.scrollHeight:e);d||h.width(j.width()-parseInt(h.css("padding-left"))-parseInt(h.css("padding-right")))}},selected:function(){var a=h&&h.filter("."+n).removeClass(n);return a&&a.length&&b.data(a[0],"ac_data")},emptyList:function(){j&&j.empty()},unbind:function(){l&&l.remove()}}};b.fn.selection=function(a,c){if(a!==void 0)return this.each(function(){if(this.createTextRange){var b=this.createTextRange();c===void 0||a==c?b.move("character",a):(b.collapse(true),b.moveStart("character",a),b.moveEnd("character",c));b.select()}else if(this.setSelectionRange)this.setSelectionRange(a,c);else if(this.selectionStart)this.selectionStart=a,this.selectionEnd=c});var b=this[0];if(b.createTextRange){var k=document.selection.createRange(),n=b.value,m=k.text.length;k.text="<->";k=b.value.indexOf("<->");b.value=n;this.selection(k,k+m);return{start:k,end:k+m}}else if(b.selectionStart!==void 0)return{start:b.selectionStart,end:b.selectionEnd}}})(jQuery);jQuery.ajaxQueue=function(b){var a=b.complete;b.complete=function(){a&&a.apply(this,arguments);jQuery.dequeue(jQuery.ajaxQueue,"ajax")};jQuery([jQuery.ajaxQueue]).queue("ajax",function(){jQuery.ajax(b)})};jQuery.ajaxSync=function(b){var a=jQuery.ajaxSync.fn,c=jQuery.ajaxSync.data,e=a.length;a[e]={error:b.error,success:b.success,complete:b.complete,done:false};c[e]={error:[],success:[],complete:[]};b.error=function(){c[e].error=arguments};b.success=function(){c[e].success=arguments};b.complete=function(){c[e].complete=arguments;a[e].done=true;if(e==0||!a[e-1])for(var b=e;b<a.length&&a[b].done;b++)a[b].error&&a[b].error.apply(jQuery,c[b].error),a[b].success&&a[b].success.apply(jQuery,c[b].success),a[b].complete&&a[b].complete.apply(jQuery,c[b].complete),a[b]=null,c[b]=null};return jQuery.ajax(b)};jQuery.ajaxSync.fn=[];jQuery.ajaxSync.data=[];