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
var initialLocation;
var siberia = new google.maps.LatLng(60, 105);
var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
var browserSupportFlag =  new Boolean();
var map;
 
function initialize() {
  var myOptions = {
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  
  // Try W3C Geolocation method (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      contentString = "Location found using W3C standard";
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  } else if (google.gears) {
    // Try Google Gears Geolocation
    browserSupportFlag = true;
    var geo = google.gears.factory.create('beta.geolocation');
    geo.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
      contentString = "Location found using Google Gears";
      map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  } else {
    // Browser doesn't support Geolocation
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
}
 
function handleNoGeolocation(errorFlag) {
  if (errorFlag == true) {
    initialLocation = newyork;
    contentString = "Error: The Geolocation service failed.";
  } else {
    initialLocation = siberia;
    contentString = "Error: Your browser doesn't support geolocation. Are you in Siberia?";
  }
  map.setCenter(initialLocation);
}