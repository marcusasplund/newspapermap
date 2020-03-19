// JavaScript Document
	var map, sliderTimer, layer, slider;
    var iw = null;
	function initialize() {
  	var sweden = new google.maps.LatLng(59.338145,13.371334);
   	map = new google.maps.Map(document.getElementById('map_canvas'), {
    center: sweden,
    zoom: 6,
    mapTypeControl: true,
	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    scrollwheel: false,
	navigationControl: true,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.ANDROID},
    mapTypeId: google.maps.MapTypeId.ROADMAP
	
  	});
  	google.maps.event.addListener(map, 'zoom_changed', function()
	{
    if (map.getZoom() < 2){
       alert("Du kan inte zooma ut längre");
       map.setZoom(2);
    }
});
 
  layer = new google.maps.FusionTablesLayer(226105, {
    suppressInfoWindows: false
    });
    layer.setMap(map);
    
    google.maps.event.addListener(layer, 'mouseover', displayBeach);
  }
 
  // When a user clicks on a feature on the map, intercept the
  // click event and display the data in a modal dialog box.
  function displayBeach(mouseEvent) {
    if (iw != null) {
      iw.close();
 
    }
    
    var content = '<h3>' + mouseEvent.row['name'].value + '</h3>';        
    
    iw = new google.maps.InfoWindow({
      content: content,
      position: mouseEvent.position
    });
 
}
