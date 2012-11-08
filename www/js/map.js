var map = {
	Months: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
	Temples: [
						['Спасо-Преображенский собор', 57.620655, 39.887763, 6, 'img/map_marker_1.png', 'img/map_marker_invert_1.png', 'img/map_info_1.png', 'Богоявленская пл., д. 25'],
						['Церковь Ильи Пророка', 57.6269,	 39.89423, 5, 'img/map_marker_2.png', 'img/map_marker_invert_2.png', 'img/map_info_2.png', 'Советская пл., д. 7'],
						['Церковь Николы Надеина', 57.62887, 39.89582, 4, 'img/map_marker_3.png', 'img/map_marker_invert_3.png', 'img/map_info_3.png', 'Народный пер., д. 2а'],
						['Церковь Рождества Христова', 57.63058, 39.89422, 3, 'img/map_marker_4.png', 'img/map_marker_invert_4.png', 'img/map_info_4.png', 'Ул. Кедрова, д. 1'],
						['Церковь Богоявления', 57.62163, 39.88628, 1, 'img/map_marker_5.png', 'img/map_marker_invert_5.png', 'img/map_info_5.png', 'Богоявленская пл., д. 12'],
						['Церковь Иоанна Предтечи', 57.610931, 39.857109, 2, 'img/map_marker_6.png', 'img/map_marker_invert_6.png', 'img/map_info_6.png', '2-я Закоторосльная наб., д. 69']
				   ],
//					Start Month, End Month, Days of week, Working text, Not working months text, Not working days text
	WorkTime:[	[4, 8, [0,3,4,5,6], '10:00-17:00<br>В дождливые дни посещение храмов ограничено', 'Храм закрыт', 'Выходной'],
						[4, 8, [0,1,2,5,6], '10:00-17:00<br>В дождливые дни посещение храмов ограничено', 'Храм закрыт', 'Выходной'],
						[4, 8, [0,1,2,3,4,5,6], '8:30-19:30', 'Только по заявкам<br>В дождливые дни посещение храмов ограничено', ''],
						[4, 8, [0,1,4,5,6], '10:00-17:00<br>В дождливые дни посещение храмов ограничено', 'Только по заявкам', 'Выходной'],
						[4, 8, [0,3,4,5,6], '9:00-16:00<br>В дождливые дни посещение храмов ограничено', 'Храм закрыт', 'Выходной'],
						[4, 8, [0,3,4,5,6], '10:00-17:00<br>В дождливые дни посещение храмов ограничено', 'Храм закрыт', 'Выходной']
					],
	CheckDate: null,
	TempleIndex: 0,
	Center: [57.61944, 39.8743],
	MyLocationIcon: 'img/map_my_location.png',
	GetLocationImages: ['url(img/get_location_126x126.png)', 'url(img/get_location_invert_126x126.png)'],
	GetRouteImages: ['url(img/route_126x126.png)', 'url(img/route_invert_126x126.png)'],
	GoogleMap: null,
	WatchID: null,
	MyLocationMarker: null,
	MyLocation: null,
	DirectionDisplay: null,
	HaveRoute: false,
	MarkerImageSize: new google.maps.Size(32, 55),
	MarkerImageOrigin: new google.maps.Point(0,0),
	MarkerImageAnchor: new google.maps.Point(16, 55),
	MarkerImage: [],
	MarkerImageInvert: [],	
	Marker: [],
	InfoWindow: null,
	initialize: function() {
		var mapCenter = new google.maps.LatLng(map.Center[0], map.Center[1]);
		var myOptions = {	zoom: 14,
									center: mapCenter,
									mapTypeId: google.maps.MapTypeId.ROADMAP
									};
		map.GoogleMap = new google.maps.Map(document.getElementById("MapCanvas"), myOptions);
	
		var temples = map.Temples;
		for (var i = 0; i < temples.length; i++) {
			var temple = temples[i];
			var myLatLng = new google.maps.LatLng(temple[1], temple[2]);
			map.MarkerImage[i] = 
				new google.maps.MarkerImage(temple[4], map.MarkerImageSize, map.MarkerImageOrigin, map.MarkerImageAnchor, map.MarkerImageSize);
			map.MarkerImageInvert[i] = 
				new google.maps.MarkerImage(temple[5], map.MarkerImageSize, map.MarkerImageOrigin, map.MarkerImageAnchor, map.MarkerImageSize);
			map.Marker[i] = new google.maps.Marker({position: myLatLng,
																			map: map.GoogleMap,
																			title: temple[0],
																			icon: map.MarkerImage[i],
																			zIndex: temple[3]
																			});
		}
		map.DirectionDisplay = new google.maps.DirectionsRenderer();
		map.DirectionDisplay.setMap(map.GoogleMap);
		
		map.InfoWindow = new google.maps.InfoWindow({maxWidth: 270});
		google.maps.event.addListener(map.InfoWindow, 'closeclick', map.reInitMarkers);
		google.maps.event.addListener(map.Marker[0], 'click', function() { map.showInfoWindow(0); });
		google.maps.event.addListener(map.Marker[1], 'click', function() { map.showInfoWindow(1); });
		google.maps.event.addListener(map.Marker[2], 'click', function() { map.showInfoWindow(2); });
		google.maps.event.addListener(map.Marker[3], 'click', function() { map.showInfoWindow(3); });
		google.maps.event.addListener(map.Marker[4], 'click', function() { map.showInfoWindow(4); });
		google.maps.event.addListener(map.Marker[5], 'click', function() { map.showInfoWindow(5); });
	},
	watchMyLocation: function() {
		if (map.WatchID == null && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				function(position) {
					map.MyLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					map.GoogleMap.setCenter(map.MyLocation);
					var image = new google.maps.MarkerImage(map.MyLocationIcon, map.MarkerImageSize, map.MarkerImageOrigin, map.MarkerImageAnchor, map.MarkerImageSize);

					map.MyLocationMarker =  new google.maps.Marker({	position: map.MyLocation,
																									map: map.GoogleMap,
																									icon: image,
																									zIndex: 100
																									});
					map.WatchID = navigator.geolocation.watchPosition(map.updateLocation, map.onError, { enableHighAccuracy: true });
					$('#MapGetLocaction').css('background-image', map.GetLocationImages[1]);
					$('#MapGetRoute').css('display', 'block');
				}, map.onError
			);
		} else {
			map.MyLocationMarker.setMap(null);
			navigator.geolocation.clearWatch(map.WatchID);
			map.WatchID = null;
			$('#MapGetLocaction').css('background-image', map.GetLocationImages[0]);
			$('#MapGetRoute').css('display', 'none');
		}
	},
	updateLocation: function(position) {
		map.MyLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		map.MyLocationMarker.setPosition(map.MyLocation);
	},
	onError: function(error){
	},
	getRoute: function() {
		if (map.HaveRoute == false) {
			var temples = map.Temples;
			var lastTemple = temples[temples.length-1];
			var start = new google.maps.LatLng(57.62984, 39.87359);
			var end = new google.maps.LatLng(lastTemple[1], lastTemple[2]);
			var waypts = [];
			for (var i = 0; i < temples.length-1; i++) {
				var temple = temples[i];
				var myLatLng = new google.maps.LatLng(temple[1], temple[2]);
				waypts.push({location: myLatLng,
									stopover: false
									});
			}
			var directionsService = new google.maps.DirectionsService();
			var request = {	origin: start,
									destination: end,
									waypoints: waypts,
									optimizeWaypoints: false,
									travelMode: google.maps.TravelMode.WALKING
									};
			directionsService.route(request, function(response, status) {
				if (status == google.maps.DirectionsStatus.OK) {
					map.DirectionDisplay.setDirections(response);
					map.HaveRoute = true;
					$('#MapGetRoute').css('background-image', map.GetRouteImages[1]);
				}
			});
		} else {
			map.DirectionDisplay.setDirections({routes: []});
			map.HaveRoute = false;
			$('#MapGetRoute').css('background-image', map.GetRouteImages[0]);
		}
	},
	makeMapInfo: function() {
		var dd = map.CheckDate.getDate();
		var mm = map.CheckDate.getMonth();
		var yyyy = map.CheckDate.getFullYear();

		var temple = map.Temples[map.TempleIndex];
		var curWorkState = map.getWorkState();
		var contentString = 
			'<div class="map_info">' +
				'<img src="'+temple[6]+'" width="270" height="153">' +
				'<p class="map_info_name">'+temple[0]+'</p>' +
				'<p>'+temple[7]+'</p>' +
				'<p><span class="map_info_day">'+dd+'</span> <span class="map_info_month">'+map.Months[mm]+'</span> <span class="map_info_year">'+yyyy+'</span></p>' +
				'<p id="MapInfoState" style="color: '+curWorkState.color+';">'+curWorkState.text+'</p>' +
				'<table class="map_info_table">' +
					'<th class="map_info_yead_day_header">число</th>' +
					'<th class="map_info_month_header">месяц</th>' +
					'<th class="map_info_yead_day_header">год</th>' +
				'<tr class="map_info_selector map_info_selector_up">' +
					'<td><img src="img/map_info_up_triangle_grey.png" width="43" height="38" onClick="map.onDayChange(true)"></td>' +
					'<td><img src="img/map_info_up_triangle_blue.png" width="43" height="38" onClick="map.onMonthChange(true)"></td>' +
					'<td><img src="img/map_info_up_triangle_grey.png" width="43" height="38" onClick="map.onYearChange(true)"></td>' +
				'</tr>' +
				'<tr class="map_info_selector">' +
					'<td class="map_info_yead_day_selector map_info_day">'+dd+'</td>' +
					'<td class="map_info_month_selector map_info_month">'+map.Months[mm]+'</td>' +
					'<td class="map_info_yead_day_selector map_info_year">'+yyyy+'</td>' +
				'</tr>' +
				'<tr class="map_info_selector_down">' +
					'<td><img src="img/map_info_down_triangle_grey.png" width="43" height="38" onClick="map.onDayChange(false)"></td>' +
					'<td><img src="img/map_info_down_triangle_blue.png" width="43" height="38" onClick="map.onMonthChange(false)"></td>' +
					'<td><img src="img/map_info_down_triangle_grey.png" width="43" height="38" onClick="map.onYearChange(false)"></td>' +
				'</tr>' +
				'</table>' +
			'</div>';
		map.InfoWindow.setContent(contentString);
	},
	showInfoWindow: function(templeIndex) {
		map.TempleIndex = templeIndex;
		map.CheckDate = new Date();
		map.reInitMarkers();
		map.Marker[templeIndex].setIcon(map.MarkerImageInvert[templeIndex]);
		map.makeMapInfo();
		map.InfoWindow.open(map.GoogleMap, map.Marker[templeIndex]);	
	},
	reInitMarkers: function() {
		var markers = map.Marker;
		var images = map.MarkerImage;
		for (var i = 0; i < markers.length; i++) {
			markers[i].setIcon(images[i]);
		}
	},
	isWorkDay: function(dayOfWeek, days) {
		for(var i = 0; i < days.length; i++) {
			if (days[i] == dayOfWeek) {
				return true;
			}
		}
		return false;
	},
	getWorkState: function() {
		var workTime = map.WorkTime[map.TempleIndex];
		var startMonth = workTime[0];
		var endMonth = workTime[1];
		var mm = map.CheckDate.getMonth();
		if (mm < startMonth || mm > endMonth) {
			return {text: workTime[4], color: 'red'};
		}
		if (!map.isWorkDay(map.CheckDate.getDay(), workTime[2])) {
			return {text: workTime[5], color: 'red'};
		}
		return {text: workTime[3], color: 'green'};
	},
	onDayChange: function(isUp) {
		if (isUp) {
			map.CheckDate.setDate(map.CheckDate.getDate() + 1);
		} else {
			map.CheckDate.setDate(map.CheckDate.getDate() - 1);
		}
		map.setWorkStateText();
	},
	onMonthChange: function(isUp) {
		if (isUp) {
			map.CheckDate.setMonth(map.CheckDate.getMonth() + 1);
		} else {
			map.CheckDate.setMonth(map.CheckDate.getMonth() - 1);
		}
		map.setWorkStateText();
	},
	onYearChange: function(isUp) {
		if (isUp) {
			map.CheckDate.setYear(map.CheckDate.getFullYear() + 1);
		} else {
			map.CheckDate.setYear(map.CheckDate.getFullYear() - 1);
		}
		map.setWorkStateText();
	},
	setWorkStateText: function() {
		$('.map_info_day').text(map.CheckDate.getDate());
		$('.map_info_month').text(map.Months[map.CheckDate.getMonth()]);
		$('.map_info_year').text(map.CheckDate.getFullYear());
		var state = map.getWorkState();
		var stateBlock = $('#MapInfoState');
		stateBlock.html(state.text);
		stateBlock.css('color', state.color);
	}
}
