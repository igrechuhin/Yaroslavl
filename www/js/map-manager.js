/*global document, navigator, setTimeout, App, google, InfoBox, SpinningWheel */

App.MapManager = {
  Months: {1: 'январь', 2: 'февраль', 3: 'март', 4: 'апрель', 5: 'май', 6: 'июнь', 7: 'июль', 8: 'август', 9: 'сентябрь', 10: 'октябрь', 11: 'ноябрь', 12: 'декабрь'},
  Markers: {size: new google.maps.Size(32, 55),
      origin: new google.maps.Point(0,0),
      anchor: new google.maps.Point(16, 55),
      images: [{normal: null, invert: null}],
      objects: []},
  Center: {latitude: 57.61944, longitude: 39.8743},
  Target: null,
  MapInstance: null,
  InfoWindow: null,
  CheckDate: null,
  TempleDef: null,
  DisplayDirection: null,
  WatchID: null,
  Registered: false,
  Location: null,
  LocationMarker: null,
  HaveRoute: false,

  register: function(Parameters) {
    var mapMgr = App.MapManager;
    if (mapMgr.Registered) { return; }
    mapMgr.Target = Parameters.target;
    
    var i, zIndex, markerSelector, marker, latitude, longitude, name, imageNormal, imageInvert, image, object,
        mapCenter = new google.maps.LatLng(mapMgr.Center.latitude, mapMgr.Center.longitude),
        mapOptions = {
          zoom: 14,
          center: mapCenter,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        imagespath = mapMgr.Target.data('imagespath'),
        markers = mapMgr.Target.parent().children('#MapMarkers'),
        markersCount = markers.children().size(),
        imageTemplate = imagespath + markers.data('marker'),
        imageInvertTemplate = imagespath + markers.data('markerinvert'),
        imageExtension = markers.data('imageextension');

    mapMgr.MapInstance = new google.maps.Map(mapMgr.Target .get(0), mapOptions);
    
    for (i = 0; i < markersCount; i++) {
      zIndex = i+1;
      markerSelector = ['li:nth-child(',')'].join(zIndex);
      marker = markers.children(markerSelector);
      
      latitude = marker.data('latitude');
      longitude = marker.data('longitude');
      name = marker.text();
      imageNormal = [imageTemplate, imageExtension].join(zIndex);
      imageInvert = [imageInvertTemplate, imageExtension].join(zIndex);

      image = {
        normal: new google.maps.MarkerImage(imageNormal, mapMgr.Markers.size, mapMgr.Markers.origin, mapMgr.Markers.anchor, mapMgr.Markers.size),
        invert: new google.maps.MarkerImage(imageInvert, mapMgr.Markers.size, mapMgr.Markers.origin, mapMgr.Markers.anchor, mapMgr.Markers.size)};
      object = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: mapMgr.MapInstance,
        title: name,
        icon: image.normal,
        zIndex: zIndex,
        animation: google.maps.Animation.DROP,
      optimized: true});
      google.maps.event.addListener(object, 'click', mapMgr.templeClickHandler);
      mapMgr.Markers.images[i] = image;
      mapMgr.Markers.objects[i] = object;
    }
    mapMgr.DisplayDirection = new google.maps.DirectionsRenderer({map: mapMgr.MapInstance});
    
    mapMgr.InfoWindow = new InfoBox({
      content: '',
      disableAutoPan: false,
      maxWidth: 270,
      pixelOffset: new google.maps.Size(-135, 0),
      zIndex: null,
      boxStyle: {
        background: "#fff no-repeat",
        opacity: 1,
        width: "270px"
      },
      closeBoxMargin: "0px 0px 0px 0px",
      closeBoxURL: 'img/buttons/closed_small.png',
      infoBoxClearance: new google.maps.Size(40, 40),
      isHidden: false,
      pane: "overlayMouseTarget",
      enableEventPropagation: false,
      alignBottom: false
    });
    //ib.open(theMap, marker);
    //mapMgr.InfoWindow = new google.maps.InfoWindow({maxWidth: 270});
    google.maps.event.addListener(mapMgr.InfoWindow, 'closeclick', mapMgr.reInitMarkers);
    
    mapMgr.Target.bind('touchstart', function(event) {
      event.stopPropagation();
    });
    mapMgr.Registered = true;
  },

  templeClickHandler: function () {
    var mapMgr = App.MapManager,
        templeIndex = this.zIndex - 1;
    mapMgr.reInitMarkers();
    this.setIcon(mapMgr.Markers.images[templeIndex].invert);
    mapMgr.CheckDate = new Date();
    mapMgr.makeInfoWindow(this);
  },

  unregister: function () {
    var mapMgr = App.MapManager;
    if (mapMgr.MapInstance !== null) {
      mapMgr.MapInstance.unbindAll();
      delete mapMgr.MapInstance;
      mapMgr.MapInstance = null;
      
      for(var index = 0; index < mapMgr.Markers.objects.length; index++) {
        mapMgr.Markers.objects[index].unbindAll();
        delete mapMgr.Markers.objects[index];
      }
      for(index = 0; index < mapMgr.Markers.objects.length; index++) {
        delete mapMgr.Markers.images[index].normal;
        delete mapMgr.Markers.images[index].invert;
        delete mapMgr.Markers.images[index];
      }
      mapMgr.InfoWindow.unbindAll();
      delete mapMgr.InfoWindow;
      
      mapMgr.DisplayDirection.unbindAll();
      delete mapMgr.DisplayDirection;
    }
  },

  reInitMarkers: function () {
    var mapMgr = App.MapManager,
        markers = mapMgr.Markers.objects,
        images = mapMgr.Markers.images,
        i;
    for (i = 0; i < markers.length; i++) {
      markers[i].setIcon(images[i].normal);
    }
    mapMgr.Target.find('.day,.month,.year').removeClass('selected');
  },

  makeInfoWindow: function (marker) {
    var mapMgr = App.MapManager,
        date = mapMgr.CheckDate,
        dd = date.getDate(),
        mm = date.getMonth(),
        yyyy = date.getFullYear(),
        markersDefs = mapMgr.Target.parent().children('#MapMarkers');
    mapMgr.TempleDef = markersDefs.children(['li:nth-child(',')'].join(marker.zIndex));

    var imagesPath = mapMgr.Target.data('imagespath'),
        infoImage = imagesPath + markersDefs.data('infoimage') + marker.zIndex + markersDefs.data('imageextension'),
        name = mapMgr.TempleDef.text(),
        address = mapMgr.TempleDef.data('address'),
        curWorkState = mapMgr.getWorkState(),
        div = document.createElement('div');
    
    div.className = "map_info";
    div.innerHTML =
      '<img src="'+infoImage+'" width="270" height="153">' +
      '<p id="Name">'+name+'</p>' +
      '<p>'+address+'</p>' +
      '<p>В выбранный день:</p>' +
      //'<p><span class="map_info_day">'+dd+'</span> <span class="map_info_month">'+mapMgr.Months[mm]+'</span> <span class="map_info_year">'+yyyy+'</span></p>' +
      '<p id="MapInfoState" style="color: '+curWorkState.color+';">'+curWorkState.text+'</p>';

    var i, years = {},
        days = function (count) {
          var days = {};
          for( var i = 1; i <= count; i += 1 ) {
            days[i] = i;
          }
          return days;
        },
        daysInMonth = function (yyyy, mm) { 
          return new Date(yyyy, mm, 0).getDate();
        };

    for(i = date.getFullYear()-2; i < date.getFullYear()+10; i += 1 ) {
      years[i] = i;
    }

    SpinningWheel.addSlot(0, days(daysInMonth(yyyy, mm)), 'right', dd);
    SpinningWheel.addSlot(1, mapMgr.Months, 'right', mm+1);
    SpinningWheel.addSlot(2, years, 'right', yyyy);

    mapMgr.InfoWindow.setContent(div);
    mapMgr.InfoWindow.open(mapMgr.MapInstance, marker);
    setTimeout(function () {
      SpinningWheel.open({
        target: div,
        onScrollEnd: function (values, slotNum) {
          var day = values.keys[0],
              month = values.keys[1],
              year = values.keys[2];
          mapMgr.CheckDate = new Date(year, month - 1, day);
          mapMgr.setWorkStateText();
          if (slotNum > 0) {
            SpinningWheel.replaceSlot(0, days(daysInMonth(year, month)));
          }
        }
      });
    }, 500);
  },

  getWorkState: function () {
    var mapMgr = App.MapManager,
        date = mapMgr.CheckDate,
        dd = date.getDate(),
        mm = date.getMonth(),
        colorRed = "#b23917",
        startMonth = mapMgr.TempleDef.data('startmonth'),
        endMonth = mapMgr.TempleDef.data('endmonth');
    if (mm < startMonth || mm > endMonth) {
      return {text: mapMgr.TempleDef.data('notworkmonth'), color: colorRed};
    }
    if (mapMgr.TempleDef.data('days').search(dd) !== -1) {
      return {text: mapMgr.TempleDef.data('notworkday'), color: colorRed};
    }
    return {text: mapMgr.TempleDef.data('worktext'), color: 'green'};
  },

  setWorkStateText: function () {
    var mapMgr = App.MapManager,
        state = mapMgr.getWorkState();
    mapMgr.Target.find('.map_info_day').text(mapMgr.CheckDate.getDate());
    mapMgr.Target.find('.map_info_month').text(mapMgr.Months[mapMgr.CheckDate.getMonth() + 1]);
    mapMgr.Target.find('.map_info_year').text(mapMgr.CheckDate.getFullYear());
    mapMgr.Target.find('#MapInfoState').html(state.text).css('color', state.color);
  },

  watchLocation: function () {
    var mapMgr = App.MapManager;
    if (mapMgr.WatchID === null && navigator.geolocation) {
      var imagesPath = mapMgr.Target.data('imagespath'),
          markersDefs = mapMgr.Target.parent().children('#MapMarkers'),
          locationImage = imagesPath + markersDefs.data('location') + markersDefs.data('imageextension'),
          locationIcon = new google.maps.MarkerImage(locationImage, mapMgr.Markers.size, mapMgr.Markers.origin, mapMgr.Markers.anchor, mapMgr.Markers.size);

      navigator.geolocation.getCurrentPosition(
        function(position) {
          mapMgr.Location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          mapMgr.MapInstance.setCenter(mapMgr.Location);
          mapMgr.LocationMarker = new google.maps.Marker({
            position: mapMgr.Location,
            map: mapMgr.MapInstance,
            icon: locationIcon,
            zIndex: 100,
            animation: google.maps.Animation.DROP});
          mapMgr.WatchID = navigator.geolocation.watchPosition(
            mapMgr.updateLocation,
            mapMgr.onError,
            { enableHighAccuracy: true });
        },
        mapMgr.onError);
    } else {
      mapMgr.LocationMarker.setMap(null);
      navigator.geolocation.clearWatch(mapMgr.WatchID);
      mapMgr.WatchID = null;
    }
  },

  isWatchingLocation: function () {
    return App.MapManager.WatchID !== null; 
  },

  updateLocation: function (position) {
    var mapMgr = App.MapManager;
    mapMgr.Location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    mapMgr.LocationMarker.setPosition(mapMgr.Location);
    if (mapMgr.HaveRoute === false) {
      mapMgr.getRoute();
    }
  },

  onError: function () {
  },

  getRoute: function() {
    var mapMgr = App.MapManager;
    if (mapMgr.HaveRoute === false) {
      var markers = mapMgr.Target.parent().children('#MapMarkers'),
          markersCount = markers.children().size(),
          start = mapMgr.Location,
          end = null,
          waypts = [],
          directionsService = new google.maps.DirectionsService(),
          zIndex, markerSelector, marker;
      for (zIndex = 1; zIndex <= markersCount; zIndex += 1) {
        markerSelector = ['li:nth-child(',')'].join(zIndex);
        marker = markers.children(markerSelector);

        end = new google.maps.LatLng(marker.data('latitude'), marker.data('longitude'));
        waypts.push({
          location: end,
          stopover: false
        });
      }
      var request = {
        origin: start,
        destination: end,
        waypoints: waypts,
        optimizeWaypoints: false,
        travelMode: google.maps.TravelMode.WALKING
      };
      directionsService.route(
        request,
        function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            mapMgr.DisplayDirection.setDirections(response);
            mapMgr.HaveRoute = true;
          }
        }
      );
      } else {
        mapMgr.DisplayDirection.setDirections({routes: []});
        mapMgr.HaveRoute = false;
      }
  }
};
