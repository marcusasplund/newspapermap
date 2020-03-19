
var roadAtlasStyles,
  map,
  layer,
  tableid = "1j9UyXqpptoye5aBkQP7l5vMNql83kPrImLMhGgo",
  zoom    = 3,
  newLayer,
  latlng,
  updateHash,
  Legend,
  updateHash;
function initialize() {

  latlng  = new google.maps.LatLng(37, -5.6);
if ($("#newspapermap-com").hasClass("iem7")) {
  roadAtlasStyles = [];
} else {
  roadAtlasStyles = [
    {
      featureType: "water",
      stylers    : [
        {
          hue: "#ECE8E3"
        }, {
          saturation: -100
        }, {
          lightness: 100
        }
      ]
    }, {
      featureType: "landscape",
      stylers    : [
        {
          hue: "#000"
        }, {
          saturation: -80
        }, {
          lightness: -15
        }
      ]
    }, {
      featureType: "administrative",
      stylers    : [
        {
          visibility: "on"
        }
      ]
    }, {
      featureType: "administrative.country",
      stylers    : [
        {
          visibility: "on"
        }, {
          lightness: 50
        }
      ]
    }, {
      featureType: "poi",
      stylers    : [
        {
          visibility: "off"
        }
      ]
    }, {
      featureType: "road",
      stylers    : [
        {
          visibility: "on"
        }, {
          lightness: 40
        }
      ]
    }, {
      featureType: "transit",
      stylers    : [
        {
          visibility: "off"
        }
      ]
    }, {
      featureType: "landscape.natural",
      stylers    : [
        {
          visibility: "off"
        }
      ]
    }, {
      featureType: "landscape.man_made",
      stylers    : [
        {
          visibility: "off"
        }
      ]
    }
  ];
}
Legend = function() {
  a                     = document.createElement("DIV");
  a.index               = 1;
  a.className           = "hidden-phone";
  a.style.color         = "#fff";
  a.style.fontSize      = "10px";
  a.style.lineHeight    = "20px";
  a.style.paddingLeft   = "20px";
  a.style.paddingRight  = "4px";
  a.style.paddingTop    = "10px";
  a.style.paddingBottom = "4px";
  a.innerHTML           = 'English<br/><a title="newsapp.es" href="https://newspapermap.com/ES.html"> Spanish | Espa\u00f1ol</a><br/><a title="plan de journaux" href="https://newspapermap.com/FR.html"> French | Fran\u00e7aise</a><br/><a title="mapa do jornais" href="https://newspapermap.com/PT.html"> Portuguese | Portugu\u00eas</a><br/><a title="zeitungskarte.de" href="https://zeitungskarte.de"> German | Deutsch</a><br/><a  title="\u0413\u0430\u0437\u0435\u0442\u0430 \u043a\u0430\u0440\u0442\u0430" href="https://newspapermap.com/RU.html"> Russian | P\u0443\u0441\u0441\u043a\u0438\u0439</a><br/> <a  title="newsapp.jp" href="http://newspapermap.com/JA.html"> Japanese | \u65e5\u672c</a><br/><a  title="\u0635\u062d\u064a\u0641\u0629 \u0627\u0644\u062e\u0631\u064a\u0637\u0629" href="http://newspapermap.com/AR.html"> Arabic | \u0627\u0644\u0639\u0631\u0628\u064a\u0629</a><br/><a  title="\uc2e0\ubb38\uc9c0\ub3c4" href="https://newspapermap.com/KO.html"> Korean | \ud55c\uad6d\uc758</a><br/>Other<br/>';
  var b = document.createElement("DIV");
  b.style.background   = '#000 url("bg.png") 0 0 no-repeat';
  b.style.opacity      = "0.8";
  b.style.filter       = "alpha(opacity=80)";
  b.style.borderRadius = "3px";
  b.title              = "newspaper map in other languages";
  b.appendChild(a);
  return b;
};
updateHash = function() {
  var a = map.getCenter().lat().toPrecision(7),
    b = map.getCenter().lng().toPrecision(7),
    c = map.getZoom();
  window.location.hash = "@" + a + "," + b + "," + c + "z";
};
getParams = function () {
  var url = window.location.hash,
    params,
    lat,
    long;
  if (url !== "") {
    // Handle old type of url:s
    if (url.indexOf("slong") !== -1) {
      params = url.split("&");
      lat    = params[0].split("=")[1];
      long   = params[1].split("=")[1];
      latlng = new google.maps.LatLng(lat, long);
      zoom   = parseInt(params[2].split("=")[1], 10);
    } else {
      params = url.split("@")[1].split(",");
      lat    = params[0];
      long   = params[1];
      latlng = new google.maps.LatLng(lat, long);
      zoom   = params[2].replace("z", "") * 1;
    }
  }
};
newLayer = function(select, where) {
  layer = new google.maps.FusionTablesLayer({
    query  : {
      select: select,
      from  : tableid,
      where : where
    },
    options: {
      styleId   : 2,
      templateId: 3
    },
    map    : map
  });
};    
  getParams();
  map = new google.maps.Map(document.getElementById("map_canvas"), {
    center                  : latlng,
    zoom                    : zoom,
    minZoom                 : 2,
    mapTypeControl          : !0,
    backgroundColor         : "#c2c7cb",
    mapTypeControlOptions   : {
      style     : google.maps.MapTypeControlStyle.DEFAULT,
      mapTypeIds: [
        google.maps.MapTypeId.SATELLITE, "usroadatlas"
      ],
      position  : google.maps.ControlPosition.TOP_RIGHT
    },
    scrollwheel             : !0,
    navigationControl       : !0,
    navigationControlOptions: {
      style   : google.maps.NavigationControlStyle.SMALL,
      position: google.maps.ControlPosition.TOP_RIGHT
    }
  });
  var a = document.getElementById("searchTextField"),
    b = new google.maps.places.Autocomplete(a, {
      types: ["geocode"]
    });
  b.bindTo("bounds", map);
  google.maps.event.addListener(b, "place_changed", function() {
    var a = b.getPlace();
    a.geometry.viewport ? map.fitBounds(a.geometry.viewport) : map.setCenter(a.geometry.location);
    newLayer("Lat", "");
  });
  a = new google.maps.StyledMapType(roadAtlasStyles, {
    name: "Newspaper Map"
  });
  map.mapTypes.set("usroadatlas", a);
  map.setMapTypeId("usroadatlas");
  newLayer("Lat", "");
  google.maps.event.addListener(map, "dragend", function() {
    updateHash();
  });
  google.maps.event.addListener(map, "zoom_changed", function() {
    updateHash();
  });
  var geocoder = new google.maps.Geocoder();
  a = new Legend();
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(a);
}
function getData(a) {
  var fname = a.getDataTable().getValue(0, 0),
    lat   = a.getDataTable().getValue(0, 1),
    lon   = a.getDataTable().getValue(0, 2);
  map.setZoom(19);
  map.setCenter(new google.maps.LatLng(lat, lon));
  layer.setMap(null);
  newLayer("Lat", "Name CONTAINS '" + fname + "'");
  updateHash();
}
function changeData(a) {
  a = encodeURIComponent("SELECT Name, Lat, Long FROM " + tableid + " WHERE Name CONTAINS IGNORING CASE '" + a + "'");
  (new google.visualization.Query("https://www.google.com/fusiontables/gvizdata?tq=" + a)).send(getData);
}
function changeMap0() {
  layer.setMap(null);
  lang  = $("#lang").val();
  console.log("Lat", "language CONTAINS '" + lang + "'");
  newLayer("Lat", "language CONTAINS '" + lang + "'");
}
function changeMap6() {
  layer.setMap(null);
  newLayer("Lat", "");
}
function changeMap7() {
  layer.setMap(null);
  newLayer("Lat", "large = 'large'");
}
function changeMapHist() {
  layer.setMap(null);
  layer = new google.maps.FusionTablesLayer({
    query: {
      select: "lat_long",
      from  : 874780
    },
    map  : map
  });
}
function handleNoGeolocation(a) {
  a = a ? "<h1>Ouch!</h1> Geolocation failed miserably. So sorry." : "Oops: Your browser doesn\u00b4t support geolocation<p>Maybe it's<em> ancient!</em></p><p>Better upgrade to one of those modern, safe and free browsers that you find <a href='http://browsehappy.com/'>here <i class='icon-exclamation-sign icon'></i></a></p>";
  a = {
    map     : map,
    position: new google.maps.LatLng(57.267906, 12.415924),
    content : a
  };
  new google.maps.InfoWindow(a);
  map.setCenter(a.position);
}
function locategps() {
  navigator.geolocation ? navigator.geolocation.getCurrentPosition(function(a) {
    a = new google.maps.LatLng(a.coords.latitude, a.coords.longitude);
    map.setCenter(a);
    map.setZoom(11);
    layer.setMap(null);
    newLayer("Lat", "");
  }, function() {
    handleNoGeolocation(!0);
  }) : handleNoGeolocation(!1);
}
$(function() {
  var $paperInput = $("#paper");
  $paperInput.typeahead([
    {
      name    : 'papers',
      prefetch: 'papers.json',
      async   : true,
      limit   : 10
    }
  ]).on('typeahead:autocompleted', onAutocompleted).on('typeahead:selected', onAutocompleted);
  function onAutocompleted($e, datum) {
    changeData(datum.value);
    $(".tt-dropdown-menu").hide();
    $paperInput.blur();
  }
  $(".tooltip-test").tooltip();
  $(".tooltip_bottom").tooltip({
    placement: "bottom",
    delay    : {
      show: 500,
      hide: 100
    }
  });
});