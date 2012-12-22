function Map() {}

Map.months = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'];
Map.markers = {size: new google.maps.Size(32, 55),
		origin: new google.maps.Point(0,0),
		anchor: new google.maps.Point(16, 55),
		images: [{normal: null, invert: null}],
		objects: []};
Map.center = {latitude: 57.61944, longitude: 39.8743};
Map.target = null;
Map.google = null;
Map.infoWindow = null;
Map.checkDate = null;
Map.templeDef = null;
Map.displayDirection = null;
Map.watchID = null;
Map.registered = false;

Map.register = function(Parameters) {
  "use strict";
  console.assert(Parameters.hasOwnProperty('target'), 'Map.register -- target undefined');
  //Map.unregister();
  if (Map.registered) {
          return;
  }
  Map.target  = Parameters.target;
  
  var mapCenter = new google.maps.LatLng(Map.center.latitude, Map.center.longitude);
  var mapOptions = {
    zoom: 14,
    center: mapCenter,
    mapTypeId: google.maps.MapTypeId.ROADMAP};

  Map.google = new google.maps.Map(Map.target .get(0), mapOptions);
  
  var imagespath = Map.target.data('imagespath');
  
  var markers = Map.target.parent().children('#MapMarkers');
  var markersCount = markers.children().size();
  
  var imageTemplate = imagespath + markers.data('marker');
  var imageInvertTemplate = imagespath + markers.data('markerinvert');
  var imageExtension = markers.data('imageextension');

  for (var i = 0; i < markersCount; i++) {
    var zIndex = i+1;
    var markerSelector = ['li:nth-child(',')'].join(zIndex);
    var marker = markers.children(markerSelector);
    
    var latitude = marker.data('latitude');
    var longitude = marker.data('longitude');
    var name = marker.text();
    var imageNormal = [imageTemplate, imageExtension].join(zIndex);
    var imageInvert = [imageInvertTemplate, imageExtension].join(zIndex);

    var image = {
      normal: new google.maps.MarkerImage(imageNormal, Map.markers.size, Map.markers.origin, Map.markers.anchor, Map.markers.size),
      invert: new google.maps.MarkerImage(imageInvert, Map.markers.size, Map.markers.origin, Map.markers.anchor, Map.markers.size)};
    var object = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: Map.google,
      title: name,
      icon: image.normal,
      zIndex: zIndex,
      animation: google.maps.Animation.DROP});
    google.maps.event.addListener(object, 'click', Map.templeClickHandler);
    Map.markers.images[i] = image;
    Map.markers.objects[i] = object;
  }
  Map.displayDirection = new google.maps.DirectionsRenderer({map: Map.google});
  
  var myOptions = {
    content: '',
    disableAutoPan: false,
    maxWidth: 270,
    pixelOffset: new google.maps.Size(-135, 0),
    zIndex: null,
    boxStyle: {
      background: "#fff no-repeat",
      opacity: 1,
      width: "270px"},
    closeBoxMargin: "0px 0px 0px 0px",
    closeBoxURL: 'img/buttons/closed_small.png',
    infoBoxClearance: new google.maps.Size(40, 40),
    isHidden: false,
    pane: "overlayMouseTarget",
    enableEventPropagation: false,
    alignBottom: false};
  Map.infoWindow = new InfoBox(myOptions);
  //ib.open(theMap, marker);
  //Map.infoWindow = new google.maps.InfoWindow({maxWidth: 270});
  google.maps.event.addListener(Map.infoWindow, 'closeclick', Map.reInitMarkers);
  
  Map.target.bind('touchstart', function(event) {
    event.stopPropagation();
  });
  Map.registered = true;
};

Map.templeClickHandler = function() {
  "use strict";
  var templeIndex = this.zIndex - 1;
  Map.reInitMarkers();
  this.setIcon(Map.markers.images[templeIndex].invert);
  Map.checkDate = new Date();
  Map.makeInfoWindow(this);
};

Map.unregister = function() {
  "use strict";
  if (Map.google !== null) {
    Map.google.unbindAll();
    delete Map.google;
    Map.google = null;
    
    for(var index = 0; index < Map.markers.objects.length; index++) {
      Map.markers.objects[index].unbindAll();
      delete Map.markers.objects[index];
    }
    for(index = 0; index < Map.markers.objects.length; index++) {
      delete Map.markers.images[index].normal;
      delete Map.markers.images[index].invert;
      delete Map.markers.images[index];
    }
    Map.infoWindow.unbindAll();
    delete Map.infoWindow;
    
    Map.displayDirection.unbindAll();
    delete Map.displayDirection;
  }
};

Map.reInitMarkers = function() {
  "use strict";
  var markers = Map.markers.objects;
  var images = Map.markers.images;
  for (var i = 0; i < markers.length; i++) {
    markers[i].setIcon(images[i].normal);
  }
  Map.target.find('.day,.month,.year').removeClass('selected');
};

Map.makeInfoWindow = function(marker) {
  "use strict";
  var date = Map.checkDate;
  var dd = date.getDate();
  var mm = date.getMonth();
  var yyyy = date.getFullYear();

  var imagesPath = Map.target.data('imagespath');

  var markersDefs = Map.target.parent().children('#MapMarkers');
  Map.templeDef = markersDefs.children(['li:nth-child(',')'].join(marker.zIndex));

  var infoImage = imagesPath + markersDefs.data('infoimage') + marker.zIndex + markersDefs.data('imageextension');
  var name = Map.templeDef.text();
  var address = Map.templeDef.data('address');

  var curWorkState = Map.getWorkState();
  var contentString =
      '<div class="map_info">' +
      '<img src="'+infoImage+'" width="270" height="153">' +
        '<p id="Name">'+name+'</p>' +
        '<p>'+address+'</p>' +
        '<p><span class="map_info_day">'+dd+'</span> <span class="map_info_month">'+Map.months[mm]+'</span> <span class="map_info_year">'+yyyy+'</span></p>' +
        '<p id="MapInfoState" style="color: '+curWorkState.color+';">'+curWorkState.text+'</p>' +
        '<table>' +
                '<tr>' +
                        '<th class="day">число</th>' +
                        '<th class="month">месяц</th>' +
                        '<th class="year">год</th>' +
                '</tr>' +
                '<tr id="Up">' +
                        '<td class="day" onClick="Map.onDayChange(true)"></td>' +
                        '<td class="month" onClick="Map.onMonthChange(true)"></td>' +
                        '<td class="year" onClick="Map.onYearChange(true)"></td>' +
                '</tr>' +
                '<tr id="Info">' +
                        '<td class="day map_info_day">'+dd+'</td>' +
                        '<td class="month map_info_month">'+Map.months[mm]+'</td>' +
                        '<td class="year map_info_year">'+yyyy+'</td>' +
                '</tr>' +
                '<tr id="Down">' +
                        '<td class="day" onClick="Map.onDayChange(false)"></td>' +
                        '<td class="month" onClick="Map.onMonthChange(false)"></td>' +
                        '<td class="year" onClick="Map.onYearChange(false)"></td>' +
                '</tr>' +
        '</table>' +
      '</div>';
  Map.infoWindow.setContent(contentString);
  Map.infoWindow.open(Map.google, marker);
};

Map.getWorkState = function() {
  "use strict";
  var date = Map.checkDate;
  var dd = date.getDate();
  var mm = date.getMonth();
  
  var colorRed = "#b23917";

  var startMonth = Map.templeDef.data('startmonth');
  var endMonth = Map.templeDef.data('endmonth');
  if (mm < startMonth || mm > endMonth) {
    return {text: Map.templeDef.data('notworkmonth'), color: colorRed};
  }
  if (Map.templeDef.data('days').search(dd) !== -1) {
    return {text: Map.templeDef.data('notworkday'), color: colorRed};
  }
  return {text: Map.templeDef.data('worktext'), color: 'green'};
};

Map.onDayChange = function(isUp) {
  "use strict";
  Map.target.find('.month,.year').removeClass('selected');
  Map.target.find('.day').addClass('selected');
  if (isUp) {
    Map.checkDate.setDate(Map.checkDate.getDate() + 1);
  } else {
    Map.checkDate.setDate(Map.checkDate.getDate() - 1);
  }
  Map.setWorkStateText();
};

Map.onMonthChange = function(isUp) {
  "use strict";
  Map.target.find('.day,.year').removeClass('selected');
  Map.target.find('.month').addClass('selected');
  if (isUp) {
    Map.checkDate.setMonth(Map.checkDate.getMonth() + 1);
  } else {
    Map.checkDate.setMonth(Map.checkDate.getMonth() - 1);
  }
  Map.setWorkStateText();
};

Map.onYearChange = function(isUp) {
  "use strict";
  Map.target.find('.day,.month').removeClass('selected');
  Map.target.find('.year').addClass('selected');
  if (isUp) {
    Map.checkDate.setYear(Map.checkDate.getFullYear() + 1);
  } else {
    Map.checkDate.setYear(Map.checkDate.getFullYear() - 1);
  }
  Map.setWorkStateText();
};

Map.setWorkStateText = function() {
  "use strict";
  Map.target.find('.map_info_day').text(Map.checkDate.getDate());
  Map.target.find('.map_info_month').text(Map.months[Map.checkDate.getMonth()]);
  Map.target.find('.map_info_year').text(Map.checkDate.getFullYear());
  var state = Map.getWorkState();
  Map.target.find('#MapInfoState').html(state.text).css('color', state.color);
};

Map.location = null;
Map.locationMarker = null;
Map.watchLocation = function() {
  "use strict";
  if (Map.watchID === null && navigator.geolocation) {
    var imagesPath = Map.target.data('imagespath');
    var markersDefs = Map.target.parent().children('#MapMarkers');
    var locationImage = imagesPath + markersDefs.data('location') + markersDefs.data('imageextension');
    var locationIcon = new google.maps.MarkerImage(locationImage, Map.markers.size, Map.markers.origin, Map.markers.anchor, Map.markers.size);

    navigator.geolocation.getCurrentPosition(
      function(position) {
        Map.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        Map.google.setCenter(Map.location);
        Map.locationMarker = new google.maps.Marker({
          position: Map.location,
          map: Map.google,
          icon: locationIcon,
          zIndex: 100,
          animation: google.maps.Animation.DROP});
        Map.watchID = navigator.geolocation.watchPosition(
          Map.updateLocation,
          Map.onError,
          { enableHighAccuracy: true });
        Buttons.showRoute();
      },
      Map.onError);
  } else {
    Map.locationMarker.setMap(null);
    navigator.geolocation.clearWatch(Map.watchID);
    Map.watchID = null;
    Buttons.hideRoute();
  }
};

Map.isWatchingLocation = function() {
  "use strict";
  return Map.watchID !== null; 
};

Map.updateLocation = function(position) {
  "use strict";
  Map.location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  Map.locationMarker.setPosition(Map.location);
};

Map.onError = function() {
};

Map.haveRoute = false;
Map.getRoute = function() {
  "use strict";
  if (Map.haveRoute === false) {
    var markers = Map.target.parent().children('#MapMarkers');
    var markersCount = markers.children().size();

    var start = Map.location;
    var end = null;
    var waypts = [];
    for (var i = 0; i < markersCount; i++) {
      var zIndex = i+1;
      var markerSelector = ['li:nth-child(',')'].join(zIndex);
      var marker = markers.children(markerSelector);
      
      var latitude = marker.data('latitude');
      var longitude = marker.data('longitude');
      end = new google.maps.LatLng(latitude, longitude);
      waypts.push({
        location: end,
        stopover: false});
      }
    var directionsService = new google.maps.DirectionsService();
    var request = {
      origin: start,
      destination: end,
      waypoints: waypts,
      optimizeWaypoints: false,
      travelMode: google.maps.TravelMode.WALKING};
    directionsService.route(
      request,
      function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          Map.displayDirection.setDirections(response);
          Map.haveRoute = true;
        }
      }
    );
    } else {
      Map.displayDirection.setDirections({routes: []});
      Map.haveRoute = false;
    }
};