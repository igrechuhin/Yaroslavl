$(document).bind("mobileinit", function() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	$.mobile.defaultPageTransition = 'pop';
	$.mobile.touchOverflowEnabled = true;
//	$.mobile.linkBindingEnabled = false;
	$.mobile.page.prototype.options.domCache = false;
	
	$.event.special.swipe.horizontalDistanceThreshold = 120;
//	$.event.special.swipe.verticalDistanceThreshold = 50;
});


$(document).ready(function() {
	var skip_swipe = false;
	$('.page').live('swipeleft swiperight', function(event) {
		if (skip_swipe) {
			skip_swipe = false;
			return;
		}
        var next = null;
		var swipeOpts = null;
        if (event.type == "swipeleft") {
			next = $("#NextPage", $.mobile.activePage);
			swipeOpts = {transition: "slidefade", reverse: false};
		} else if (event.type == "swiperight") {
			next = $("#PrevPage", $.mobile.activePage);
			swipeOpts = {transition: "slidefade", reverse: true};
		}
		if (next && next.length) {
			var nexturl = $(next).attr("href");
			$.mobile.changePage(nexturl, swipeOpts);
			event.preventDefault();
		}
    });
	$('.skip_swipe').live('swipeleft swiperight', function() {
		skip_swipe = true;
	});
	$('.menu_link').click(menu.restore_init_state);
	$('.normal_icon').live('click', normalButtonClick);
	$('.invert_icon').live('click', function(event) {
		$(event.target).removeClass('invert_icon').addClass('normal_icon');
	});	
});

$(document).on("pageinit", ".page", function(event) {
	menu.restore_init_state();
	var pageObj = $(event.target);
	var pageID = pageObj.attr('id');
	switch (pageID) {
		case 'Page04':
			setTimeout(map.initialize, 500);
			break;
		case 'Page05-1':
			var bottomHint = pageObj.children('.bottom_hint');
			var audioPlayer = bottomHint.children('#AudioPlayer');
			var playPause = audioPlayer.children('#PlayPauseIcon');
			var position = audioPlayer.children('#Position');
			var label = audioPlayer.children('#Label');
	
			var path = 'panoramas/spaso-preobrajenskii/';
			embedpano({swf: path+'spaso-preob.swf', xml: path+'spaso-preob.xml', target: 'PanoramaContent', html5: 'prefer'});
			
			audio.initialize({  'playPause': playPause,
                                'position': position,
                                'label': label});
			audio.setSource({   'url': 'audio/dave_stewart_i_candy_dulfer_-_lily_was_here_(zaycev.net).mp3',
                                'label': 'Lily was here'});
			break;
		case 'Page06':
			gallery.init('#Gallery');
			break;
	}
});

$(document).on("click", ".disabled", function(event) {
		event.stopImmediatePropagation();
		event.preventDefault();
});

function normalButtonClick(event) {
	var targetObj = $(event.target);
	if (targetObj.is('.plan_icon,.panorama_icon')) {
		$('.plan_icon,.panorama_icon').removeClass('invert_icon').addClass('normal_icon');
	}
	targetObj.removeClass('normal_icon').addClass('invert_icon');
}

function pageScroll(eventObj) {
	if ($(eventObj).hasClass('disabled')) return;
	var targetObj = $(eventObj.parentNode);
	var bottomHint = targetObj.children('.bottom_hint');
	if (bottomHint.children('.audio').hasClass('invisible')) {
		if (eventObj.scrollTop + eventObj.clientHeight > eventObj.scrollHeight - 20) {
			bottomHint.children('.arrow').addClass('invisible');
		}
		else {
			bottomHint.children('.arrow').removeClass('invisible');
		}
	}
}

function showContent(eventObj, targetContent) {
	if ($(eventObj).hasClass('disabled')) return;
	var pageObj = $(eventObj).parents('.page');
	var iconObj = pageObj.children('#'+targetContent+'Icon.icon');
	var targetObj = pageObj.children('#'+targetContent+'Content.page_content');
	pageObj.children('.page_content').addClass('invisible');
	if (iconObj.hasClass('normal_icon')) {
		if (!($(eventObj)[0] === iconObj[0])) {
			normalButtonClick({target:iconObj});
		}
		targetObj.removeClass('invisible');
		pageObj.children('.bottom_hint').children('.arrow').addClass('invisible');
	} else {
		pageObj.children('#MainContent.page_content').removeClass('invisible');
		pageObj.children('.bottom_hint').children('.arrow').removeClass('invisible');
	}
}

function showAudio(eventObj) {
	if ($(eventObj).hasClass('disabled')) return;
	$('.bottom_hint > *').addClass('invisible');
	var jObj = $('#'+eventObj.id);
	if (jObj.hasClass('normal_icon')) {
		$('.bottom_hint > .audio').removeClass('invisible');
	} else {
		$('.bottom_hint > .arrow').removeClass('invisible');
	}
}

function showTemples(eventObj) {
	if ($(eventObj).hasClass('disabled')) return;
	var thisObj = $(eventObj);
	var pageObj = $(eventObj.parentNode);
	var temples = pageObj.children('.temples_select');
	temples.children('.temples_icon').removeClass('invert_icon').addClass('normal_icon');
	if (thisObj.hasClass('normal_icon')) {
		temples.removeClass('invisible');
		pageObj.children('.page_content').addClass('page_content_temples');
		var pageID = pageObj.attr('id');
		if (pageID.substr(0, 7) == 'Page05-') {
			var templeNumber = pageID.substr(7, 1);
			temples.children('#TempleIcon' + templeNumber).removeClass('normal_icon').addClass('invert_icon');
		}
	} else {
		temples.addClass('invisible');
		pageObj.children('.page_content').removeClass('page_content_temples');
	}
}

function gotoPage(eventObj, url) {
	if ($(eventObj).hasClass('disabled')) return;
	var temples = $(eventObj.parentNode);
	var pageObj = temples.parent();
	temples.addClass('invisible');
	pageObj.children('.page_content').removeClass('page_content_temples');
	$('.temples_icon').removeClass('invert_icon').addClass('normal_icon');
	$.mobile.changePage(url);
}