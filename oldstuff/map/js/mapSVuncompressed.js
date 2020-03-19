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
var zoom = 6;
var latlng = new google.maps.LatLng(60.99, 13.75);
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
center: latlng,
mapTypeControl: true,
mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DEFAULT,
mapTypeIds: [google.maps.MapTypeId.SATELLITE, 'usroadatlas'],
position: google.maps.ControlPosition.TOP_RIGHT},
scrollwheel: true,
navigationControl: true,
navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL,
position: google.maps.ControlPosition.TOP_RIGHT},
});
var styledMapOptions = {name: "Tidningskartan"};
var usRoadMapType = new google.maps.StyledMapType(roadAtlasStyles, styledMapOptions);
map.mapTypes.set('usroadatlas', usRoadMapType);
map.setMapTypeId('usroadatlas');
google.maps.event.addListener(map, 'center_changed', function() {
updateHash();
});
google.maps.event.addListener(map, 'zoom_changed', function() {
updateHash();
{
if (map.getZoom() < 2){
alert("Det går inte att zooma ut längre");
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
map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legendDiv);
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
'<img src="yellow-dot.png" width="16" height="16"/> <a href="http://newspapermap.com">Engelska/English</a><br />' +
'<img src="red-dot.png" width="16" height="16"/> <a href="http://newspapermap.com/ES.html">Spanska/Español</a><br />' +
'<img src="blue-dot.png" width="16" height="16"/> <a href="http://zeitungskarte.de">Tyska/Deutsch</a><br />' +
'<img src="purple-dot.png" width="16" height="16"/> Ryska<br />' + 
'<img src="pink-dot.png" width="16" height="16"/> <a href="http://newspapermap.com/JA.html">Japanska/日本</a><br />' +
'<img src="white-dot.png" width="16" height="16"/> Franska<br />' +
'<img src="ltblue-dot.png" width="16" height="16"/> Portugisiska<br />' +
'<img src="orange-dot.png" width="16" height="16"/> Arabiska<br />' +
'<img src="green-dot.png" width="16" height="16"/> Övriga<br />' +
'<small>● - e-papers</small>';
controlUI.appendChild(controlText);
}
function changeData(fname) {
var queryText = encodeURIComponent("SELECT Name, Lat, Long FROM " + tableid + " WHERE Name = '" + fname + "'");
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
url: "http://maps-api-ssl.google.com/maps/suggest?hl=sv&gl=sv&v=3&json=b&auth=ABQIAAAAALakLdjjlTHt7ZswQah3VRQhzk0B9PQtvkZRIRmh2TMWxDe2yRSKq5BP3oJYSnI5FTbfuS_Rdg8dEQ&src=1,2&num=5&numps=5&callback=handleResponse&q=" + $('#search').val() + "&cp=" + $('#search').val().length,
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
var centerlat = map.getCenter().lat();
var centerlong = map.getCenter().lng();
var mapzoom = map.getZoom();
window.location.hash = "centerlat=" + centerlat + "&centerlong=" + centerlong + "&zoom=" + mapzoom;
}
function getParams() {
var url = window.location.hash;
if(url != "") {
params = url.split("&");
centerlat = params[0].split("=")[1];
centerlong = params[1].split("=")[1];
latlng = new google.maps.LatLng(centerlat, centerlong);
zoom = parseInt(params[2].split("=")[1]);
}
}
