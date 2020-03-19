var roadAtlasStyles = [
{featureType: "landscape",
elementType: "all",
stylers: [
{ saturation: 49 },
{ lightness: 60 }
]
},{featureType: "landscape.natural",
elementType: "all",
stylers: [
{ saturation: -30 },
{ lightness: -5 }
]
},{featureType: "landscape.natural",
elementType: "labels",
stylers: [     
{ hue: "94" }, 
{ saturation: -30 },
{ lightness: -20 }
]
},{featureType: "road",
elementType: "geometry",
stylers: [
{ hue: "342" }, 
{ saturation: -69 }
]
},{featureType: "road",
elementType: "labels",
stylers: [
{ hue: "332" }, 
{ saturation: 10 },
{ lightness: 10 }
]
},{featureType: "poi",
elementType: "geometry",
stylers: [
{ hue: "25" } 
]
},{featureType: "poi.business",
elementType: "all",
stylers: [
{ hue: "314" }, 
{ lightness: -17 },
{ saturation: 9 }
]
},{featureType: "poi.school",
elementType: "all",
stylers: [
{ hue: "314" }, 
]
},{featureType: "poi.park",
elementType: "geometry",
stylers: [
{ hue: "16" }, 
{ saturation: 0 },
{ lightness: 30 }
]
},{featureType: "transit.line",
elementType: "geometry",
stylers: [
{ hue: "34" }, 
{ saturation: 80 }
]
},{featureType: "water",
elementType: "all",
stylers: [
{ hue: "355" }, 
{ saturation: 55 },  
{ lightness: 15 } 
]
},{featureType: "administrative",
elementType: "all",
stylers: [
{ hue: "314" }, 
{ lightness: -17 },
{ saturation: 9 }
]
}
]; 
var layer;
var tableid = 552892;
var zoom = 7;
var latlng = new google.maps.LatLng(40.45, -3.6);
var suggestion;
var ne; var sw;
var tabkey;
var regex1;
var query = "";
$('#search').live('keydown', function(e) { 
var keyCode = e.keyCode || e.which; 
if (keyCode == 9) { 
e.preventDefault(); 
if (suggestion) {
regex1 = new RegExp( "^" + $('#search').val() + "(.*?)( |$)", "ig");
tabkey = suggestion.match(regex1);
$("#search").val(tabkey);
}
}
});
function initialize() {
getParams();
map = new google.maps.Map(document.getElementById('map_canvas'), {
center: latlng,
zoom: zoom,
mapTypeControl: true,
mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT,
mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'usroadatlas'],
position: google.maps.ControlPosition.TOP_RIGHT},
scrollwheel: true,
navigationControl: true,
navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL,
position: google.maps.ControlPosition.TOP_RIGHT}
});
var styledMapOptions = {
name: "Mapa de Diarios"
};
var usRoadMapType = new google.maps.StyledMapType(
roadAtlasStyles, styledMapOptions);
map.mapTypes.set('usroadatlas', usRoadMapType);
map.setMapTypeId('usroadatlas');
google.maps.event.addListener(map, 'center_changed', function() {
updateHash();
});
google.maps.event.addListener(map, 'zoom_changed', function() {
updateHash();
{
if (map.getZoom() < 2){
alert("No se puede alejar más lejos");
map.setZoom(2);
}
}
});
geocoder = new google.maps.Geocoder();
layer = new google.maps.FusionTablesLayer(tableid);
if(query) {
layer.setQuery(query);
}
layer.setMap(map);
suppressInfoWindows: false;
$('#search').keyup(primaryFunction);
$('#search').submit(primaryFunction);
var legendDiv = document.createElement('DIV');
var legend = new Legend(legendDiv, map);
legendDiv.index = 1;
map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(legendDiv);
}
function Legend(controlDiv, map) {
controlDiv.style.padding = '5px';
var controlUI = document.createElement('DIV');
controlUI.style.backgroundColor = '#FFF';
controlUI.style.borderStyle = 'solid';
controlUI.style.borderColor = '#666';
controlUI.style.borderWidth = '1px';
controlUI.title = 'Languages';
controlDiv.appendChild(controlUI);
var controlText = document.createElement('DIV');
controlText.style.fontFamily = 'Arial,sans-serif';
controlText.style.fontSize = '10px';
controlText.style.paddingLeft = '3px';
controlText.style.paddingRight = '3px';
controlText.innerHTML = '<br />' +
'<img src="yellow-dot.png" width="16" height="16"/> <a href="http://newspapermap.com">Inglés - US</a><br />' +
'<img src="red-dot.png" width="16" height="16"/> Español<br />' +
'<img src="white-dot.png" width="16" height="16"/> Francés<br />' +
'<img src="ltblue-dot.png" width="16" height="16"/> Portugués<br />' +
'<img src="blue-dot.png" width="16" height="16"/> <a href="http://zeitungskarte.de">Alemán/Deutsch</a><br />' +
'<img src="purple-dot.png" width="16" height="16"/> Rusia<br />' + 
'<img src="pink-dot.png" width="16" height="16"/> <a href="http://newspapermap.com/JA.html">Japonés/日本</a><br />' +
'<img src="orange-dot.png" width="16" height="16"/> Árabe<br />' +
'<img src="green-dot.png" width="16" height="16"/> Otros<br />' +
'<small>● - e-papers</small>';
controlUI.appendChild(controlText);
}
function changeData(fname) {
var queryText = encodeURIComponent("SELECT Name, Lat, Long FROM " + tableid + " WHERE Name CONTAINS IGNORING CASE '" + fname + "'");
var query = new google.visualization.Query('http://www.google.com/fusiontables/gvizdata?tq='  + queryText);
query.send(getData); 
}
function getData(response) {
fname = response.getDataTable().getValue(0, 0);
lat = response.getDataTable().getValue(0, 1);
lon = response.getDataTable().getValue(0, 2);
map.setZoom(10);
map.setCenter(new google.maps.LatLng(lat, lon));
layer.setQuery("SELECT lat_long FROM " + tableid + " WHERE Name CONTAINS '" + fname + "'");
suppressInfoWindows: false;
}
function changeMap0() {
lang = document.getElementById("lang").value;
layer.setQuery("SELECT lat_long FROM " + tableid + " WHERE language CONTAINS '" + lang + "'");
}
function changeMap10() {
filter = document.getElementById("filter").value;
layer.setQuery("SELECT lat_long FROM " + tableid + " WHERE '" + filter + "' = '" + filter + "'");
}
function changeMap6() {
layer.setQuery("SELECT lat_long FROM  " + tableid + "");
}
function changeMap7() {
layer.setQuery("SELECT lat_long FROM " + tableid + " WHERE large = 'large'");
}
function primaryFunction() {
var searchtext=$('#search').val();
$.ajax({
type: "GET",
url: "http://maps-api-ssl.google.com/maps/suggest?hl=es&gl=es&v=3&json=b&auth=ABQIAAAAALakLdjjlTHt7ZswQah3VRQhzk0B9PQtvkZRIRmh2TMWxDe2yRSKq5BP3oJYSnI5FTbfuS_Rdg8dEQ&src=1,2&num=5&numps=5&callback=handleResponse&q=" + $('#search').val() + "&cp=" + $('#search').val().length,
dataType: "script",
queue: "SUG1",
cancelExisting: true
});
}
handleResponse = {};
handleResponse = function(sugdat) {
DIR1b4 = suggestion;
suggestion = parse(sugdat);
DIR1now = suggestion;
if (DIR1b4 != DIR1now) {
updateHTML('suggestion', suggestion); 
codeAddress(suggestion);
}
};
function updateHTML(elmId, value) {
document.getElementById(elmId).innerHTML = value;
}
function parse(_sugdat) {
if (_sugdat["suggestion"][0]["query"]) {
return _sugdat["suggestion"][0]["query"];
} else { 
return null;
}
}
function codeAddress(_sug) {
var address = _sug;
geocoder.geocode( { 'address': address}, function(results, status) {
if (status == google.maps.GeocoderStatus.OK) {
var ne = results[0].geometry.viewport.getNorthEast();
var sw = results[0].geometry.viewport.getSouthWest();
map.fitBounds(results[0].geometry.viewport); 
layer.setQuery("SELECT lat_long FROM  " + tableid + "");
var boundingBoxPoints = [
ne, new google.maps.LatLng(ne.lat(), sw.lng()),
sw, new google.maps.LatLng(sw.lat(), ne.lng()), ne
];
}      
});
}
function updateHash() {
var slat = map.getCenter().lat();
var slong = map.getCenter().lng();
var mapzoom = map.getZoom();
window.location.hash = "slat=" + slat + "&slong=" + slong + "&zoom=" + mapzoom;
}
function getParams() {
var url = window.location.hash;
if(url != "") {
params = url.split("&");
slat = params[0].split("=")[1];
slong = params[1].split("=")[1];
latlng = new google.maps.LatLng(slat, slong);
zoom = parseInt(params[2].split("=")[1]);
}
}
eval(function(p,a,c,k,e,r){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};if(!''.replace(/^/,String)){while(c--)r[e(c)]=k[c]||e(c);k=[function(e){return r[e]}];e=function(){return'\\w+'};c=1};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('D.22=3(o){5 a=o.J;o.J=3(){4(a)a.1D(y,T);D.4p(D.22,"1l")};D([D.22]).4d("1l",3(){D.1l(o)})};D.1h=3(o){5 a=D.1h.1o,7=D.1h.7,L=a.w;a[L]={U:o.U,R:o.R,J:o.J,2d:B};7[L]={U:[],R:[],J:[]};o.U=3(){7[L].U=T};o.R=3(){7[L].R=T};o.J=3(){7[L].J=T;a[L].2d=E;4(L==0||!a[L-1])16(5 i=L;i<a.w&&a[i].2d;i++){4(a[i].U)a[i].U.1D(D,7[i].U);4(a[i].R)a[i].R.1D(D,7[i].R);4(a[i].J)a[i].J.1D(D,7[i].J);a[i]=O;7[i]=O}};6 D.1l(o)};D.1h.1o=[];D.1h.7=[];(3($){$.1o.1N({1f:3(b,c){5 d=12 b=="1Q";c=$.1N({},$.Q.2e,{15:d?b:O,7:d?O:b,1J:d?$.Q.2e.1J:10,18:c&&!c.1O?10:3N},c);c.1R=c.1R||3(a){6 a};c.1B=c.1B||c.2g;6 y.K(3(){2k $.Q(y,c)})},P:3(a){6 y.19("P",a)},1v:3(a){6 y.17("1v",[a])},2l:3(){6 y.17("2l")},2n:3(a){6 y.17("2n",[a])},2p:3(){6 y.17("2p")}});$.Q=3(h,j){5 k={3q:38,3n:40,39:46,32:9,2V:13,2S:27,2H:47,2A:33,2t:34,3p:8};5 l=$(h).4j("1f","4k").W(j.3e);5 m;5 n="";5 o=$.Q.3d(j);5 p=0;5 r;5 s={1z:B};5 t=$.Q.3a(j,h,21,s);5 u;$.20.2U&&$(h.2F).19("4o.1f",3(){4(u){u=B;6 B}});l.19(($.20.2U?"4q":"4s")+".1f",3(a){p=1;r=a.2s;4v(a.2s){X k.3q:a.1q();4(t.S()){t.2Z()}z{14(0,E)}V;X k.3n:a.1q();4(t.S()){t.2R()}z{14(0,E)}V;X k.2A:a.1q();4(t.S()){t.3j()}z{14(0,E)}V;X k.2t:a.1q();4(t.S()){t.2r()}z{14(0,E)}V;X j.1d&&$.1w(j.Y)==","&&k.2H:X k.32:X k.2V:4(21()){a.1q();u=E;6 B}V;X k.2S:t.11();V;4u:1V(m);m=1W(14,j.1J);V}}).35(3(){p++}).4t(3(){p=0;4(!s.1z){3m()}}).2q(3(){4(p++>1&&!t.S()){14(0,E)}}).19("1v",3(){5 c=(T.w>1)?T[1]:O;3 1Y(q,a){5 b;4(a&&a.w){16(5 i=0;i<a.w;i++){4(a[i].P.N()==q.N()){b=a[i];V}}}4(12 c=="3")c(b);z l.17("P",b&&[b.7,b.I])}$.K(1c(l.M()),3(i,a){1Z(a,1Y,1Y)})}).19("2l",3(){o.1j()}).19("2n",3(){$.1N(j,T[1]);4("7"2W T[1])o.1i()}).19("2p",3(){t.1C();l.1C();$(h.2F).1C(".1f")});3 21(){5 b=t.37();4(!b)6 B;5 v=b.P;n=v;4(j.1d){5 c=1c(l.M());4(c.w>1){5 d=j.Y.w;5 e=$(h).1e().1I;5 f,1L=0;$.K(c,3(i,a){1L+=a.w;4(e<=1L){f=i;6 B}1L+=d});c[f]=v;v=c.3o(j.Y)}v+=j.Y}l.M(v);1k();l.17("P",[b.7,b.I]);6 E}3 14(a,b){4(r==k.39){t.11();6}5 c=l.M();4(!b&&c==n)6;n=c;c=1m(c);4(c.w>=j.26){l.W(j.28);4(!j.1G)c=c.N();1Z(c,2u,1k)}z{1F();t.11()}};3 1c(b){4(!b)6[""];4(!j.1d)6[$.1w(b)];6 $.4f(b.29(j.Y),3(a){6 $.1w(b).w?$.1w(a):O})}3 1m(a){4(!j.1d)6 a;5 b=1c(a);4(b.w==1)6 b[0];5 c=$(h).1e().1I;4(c==a.w){b=1c(a)}z{b=1c(a.2a(a.2z(c),""))}6 b[b.w-1]}3 1E(q,a){4(j.1E&&(1m(l.M()).N()==q.N())&&r!=k.3p){l.M(l.M()+a.2z(1m(n).w));$(h).1e(n.w,n.w+a.w)}};3 3m(){1V(m);m=1W(1k,48)};3 1k(){5 c=t.S();t.11();1V(m);1F();4(j.2C){l.1v(3(a){4(!a){4(j.1d){5 b=1c(l.M()).1n(0,-1);l.M(b.3o(j.Y)+(b.w?j.Y:""))}z{l.M("");l.17("P",O)}}})}};3 2u(q,a){4(a&&a.w&&p){1F();t.2E(a,q);1E(q,a[0].I);t.2c()}z{1k()}};3 1Z(c,d,e){4(!j.1G)c=c.N();5 f=o.2G(c);4(f&&f.w){d(c,f)}z 4((12 j.15=="1Q")&&(j.15.w>0)){5 g={45:+2k 43()};$.K(j.2K,3(a,b){g[a]=12 b=="3"?b():b});$.1l({3Z:"3X",3U:"1f"+h.3T,2P:j.2P,15:j.15,7:$.1N({q:1m(c),3S:j.18},g),R:3(a){5 b=j.1A&&j.1A(a)||1A(a);o.1g(c,b);d(c,b)}})}z{t.2T();e(c)}};3 1A(a){5 b=[];5 c=a.29("\\n");16(5 i=0;i<c.w;i++){5 d=$.1w(c[i]);4(d){d=d.29("|");b[b.w]={7:d,I:d[0],P:j.1S&&j.1S(d,d[0])||d[0]}}}6 b};3 1F(){l.1p(j.28)}};$.Q.2e={3e:"3P",2X:"3O",28:"3G",26:1,1J:3F,1G:B,1r:E,1P:B,1s:10,18:3B,2C:B,2K:{},2h:E,2g:3(a){6 a[0]},1B:O,1E:B,H:0,1d:B,Y:", ",1R:3(a,b){6 a.2a(2k 3A("(?![^&;]+;)(?!<[^<>]*)("+b.2a(/([\\^\\$\\(\\)\\[\\]\\{\\}\\*\\.\\+\\?\\|\\\\])/3b,"\\\\$1")+")(?![^<>]*>)(?![^&;]+;)","3b"),"<3c>$1</3c>")},1O:E,1M:3x};$.Q.3d=3(g){5 h={};5 j=0;3 1r(s,a){4(!g.1G)s=s.N();5 i=s.3f(a);4(g.1P=="3v"){i=s.N().1v("\\\\b"+a.N())}4(i==-1)6 B;6 i==0||g.1P};3 1g(q,a){4(j>g.1s){1j()}4(!h[q]){j++}h[q]=a}3 1i(){4(!g.7)6 B;5 b={},3h=0;4(!g.15)g.1s=1;b[""]=[];16(5 i=0,3i=g.7.w;i<3i;i++){5 c=g.7[i];c=(12 c=="1Q")?[c]:c;5 d=g.1B(c,i+1,g.7.w);4(d===B)1U;5 e=d.3u(0).N();4(!b[e])b[e]=[];5 f={I:d,7:c,P:g.1S&&g.1S(c)||d};b[e].2m(f);4(3h++<g.18){b[""].2m(f)}};$.K(b,3(i,a){g.1s++;1g(i,a)})}1W(1i,25);3 1j(){h={};j=0}6{1j:1j,1g:1g,1i:1i,2G:3(q){4(!g.1s||!j)6 O;4(!g.15&&g.1P){5 a=[];16(5 k 2W h){4(k.w>0){5 c=h[k];$.K(c,3(i,x){4(1r(x.I,q)){a.2m(x)}})}}6 a}z 4(h[q]){6 h[q]}z 4(g.1r){16(5 i=q.w-1;i>=g.26;i--){5 c=h[q.3t(0,i)];4(c){5 a=[];$.K(c,3(i,x){4(1r(x.I,q)){a[a.w]=x}});6 a}}}6 O}}};$.Q.3a=3(e,f,g,h){5 j={F:"3s"};5 k,A=-1,7,1y="",2o=E,G,C;3 3g(){4(!2o)6;G=$("<3w/>").11().W(e.2X).1a("3y","3z").2j(2i.36);C=$("<3C/>").2j(G).3D(3(a){4(1b(a).31&&1b(a).31.3E()==\'30\'){A=$("2f",C).1p(j.F).3H(1b(a));$(1b(a)).W(j.F)}}).2q(3(a){$(1b(a)).W(j.F);g();f.35();6 B}).3I(3(){h.1z=E}).3J(3(){h.1z=B});4(e.H>0)G.1a("H",e.H);2o=B}3 1b(a){5 b=a.1b;3K(b&&b.3L!="30")b=b.3M;4(!b)6[];6 b}3 Z(a){k.1n(A,A+1).1p(j.F);2Y(a);5 b=k.1n(A,A+1).W(j.F);4(e.1O){5 c=0;k.1n(0,A).K(3(){c+=y.1x});4((c+b[0].1x-C.1u())>C[0].3Q){C.1u(c+b[0].1x-C.3R())}z 4(c<C.1u()){C.1u(c)}}};3 2Y(a){A+=a;4(A<0){A=k.1t()-1}z 4(A>=k.1t()){A=0}}3 2Q(a){6 e.18&&e.18<a?e.18:a}3 2O(){C.2N();5 a=2Q(7.w);16(5 i=0;i<a;i++){4(!7[i])1U;5 b=e.2g(7[i].7,i+1,a,7[i].I,1y);4(b===B)1U;5 c=$("<2f/>").3V(e.1R(b,1y)).W(i%2==0?"4w":"3W").2j(C)[0];$.7(c,"2M",7[i])}k=C.3Y("2f");4(e.2h){k.1n(0,1).W(j.F);A=0}4($.1o.2L)C.2L()}6{2E:3(d,q){3g();7=d;1y=q;2O()},2R:3(){Z(1)},2Z:3(){Z(-1)},3j:3(){4(A!=0&&A-8<0){Z(-A)}z{Z(-8)}},2r:3(){4(A!=k.1t()-1&&A+8>k.1t()){Z(k.1t()-1-A)}z{Z(8)}},11:3(){G&&G.11();k&&k.1p(j.F);A=-1},S:3(){6 G&&G.41(":S")},42:3(){6 y.S()&&(k.2J("."+j.F)[0]||e.2h&&k[0])},2c:3(){5 a=$(f).44();G.1a({H:12 e.H=="1Q"||e.H>0?e.H:$(f).H(),2I:a.2I+f.1x,1T:a.1T}).2c();4(e.1O){C.1u(0);C.1a({2B:e.1M,49:\'4a\'});4($.20.4b&&12 2i.36.4c.2B==="1K"){5 b=0;k.K(3(){b+=y.1x});5 c=b>e.1M;C.1a(\'4e\',c?e.1M:b);4(!c){k.H(C.H()-2w(k.1a("2v-1T"))-2w(k.1a("2v-4g")))}}}},37:3(){5 a=k&&k.2J("."+j.F).1p(j.F);6 a&&a.w&&$.7(a[0],"2M")},2T:3(){C&&C.2N()},1C:3(){G&&G.4h()}}};$.1o.1e=3(b,c){4(b!==1K){6 y.K(3(){4(y.24){5 a=y.24();4(c===1K||b==c){a.4i("23",b);a.3l()}z{a.4l(E);a.4m("23",b);a.4n("23",c);a.3l()}}z 4(y.2D){y.2D(b,c)}z 4(y.1H){y.1H=b;y.2y=c}})}5 d=y[0];4(d.24){5 e=2i.1e.4r(),2x=d.I,1X="<->",2b=e.3k.w;e.3k=1X;5 f=d.I.3f(1X);d.I=2x;y.1e(f,f+2b);6{1I:f,3r:f+2b}}z 4(d.1H!==1K){6{1I:d.1H,3r:d.2y}}}})(D);',62,281,'|||function|if|var|return|data|||||||||||||||||||||||||length||this|else|active|false|list|jQuery|true|ACTIVE|element|width|value|complete|each|pos|val|toLowerCase|null|result|Autocompleter|success|visible|arguments|error|break|addClass|case|multipleSeparator|moveSelect||hide|typeof||onChange|url|for|trigger|max|bind|css|target|trimWords|multiple|selection|autocomplete|add|ajaxSync|populate|flush|hideResultsNow|ajax|lastWord|slice|fn|removeClass|preventDefault|matchSubset|cacheLength|size|scrollTop|search|trim|offsetHeight|term|mouseDownOnSelect|parse|formatMatch|unbind|apply|autoFill|stopLoading|matchCase|selectionStart|start|delay|undefined|progress|scrollHeight|extend|scroll|matchContains|string|highlight|formatResult|left|continue|clearTimeout|setTimeout|teststring|findValueCallback|request|browser|selectCurrent|ajaxQueue|character|createTextRange||minChars||loadingClass|split|replace|textLength|show|done|defaults|li|formatItem|selectFirst|document|appendTo|new|flushCache|push|setOptions|needsInit|unautocomplete|click|pageDown|keyCode|PAGEDOWN|receiveData|padding|parseInt|orig|selectionEnd|substring|PAGEUP|maxHeight|mustMatch|setSelectionRange|display|form|load|COMMA|top|filter|extraParams|bgiframe|ac_data|empty|fillList|dataType|limitNumberOfItems|next|ESC|emptyList|opera|RETURN|in|resultsClass|movePosition|prev|LI|nodeName|TAB|||focus|body|selected||DEL|Select|gi|strong|Cache|inputClass|indexOf|init|nullData|ol|pageUp|text|select|hideResults|DOWN|join|BACKSPACE|UP|end|ac_over|substr|charAt|word|div|180|position|absolute|RegExp|100|ul|mouseover|toUpperCase|400|ac_loading|index|mousedown|mouseup|while|tagName|parentNode|150|ac_results|ac_input|clientHeight|innerHeight|limit|name|port|html|ac_odd|abort|find|mode||is|current|Date|offset|timestamp||188|200|overflow|auto|msie|style|queue|height|map|right|remove|move|attr|off|collapse|moveStart|moveEnd|submit|dequeue|keypress|createRange|keydown|blur|default|switch|ac_even'.split('|'),0,{}))
