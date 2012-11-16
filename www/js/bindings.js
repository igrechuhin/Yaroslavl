$(document).bind("mobileinit", function() {
	$.support.cors = true;
	$.mobile.allowCrossDomainPages = true;
	$.mobile.defaultPageTransition = 'pop';
	$.mobile.touchOverflowEnabled = true;
//	$.mobile.linkBindingEnabled = false;
	$.mobile.page.prototype.options.domCache = true;
	
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
	$('.page').live('pageinit', menu.restore_init_state);
	$('.menu_link').click(menu.restore_init_state);
	$('#Page04').live('pageinit', function() {
  		setTimeout(map.initialize, 500);
	});
	$('#Page05-1').live('pageinit', function() {
		var path = 'panoramas/spaso-preobrajenskii/';
		embedpano({swf: path+'spaso-preob.swf', xml: path+'spaso-preob.xml', target: 'PanoramaContent', html5: 'prefer'});
		
		audio.initialize($('#AudioPlayer > #PlayPauseIcon'),
								$('#AudioPlayer > #Position'),
								$('#AudioPlayer > #Label'));
		audio.setSource('audio/dave_stewart_i_candy_dulfer_-_lily_was_here_(zaycev.net).mp3', 'Lily was here');
	});
	$('#Page06').live('pageinit', function() {
		gallery.init('#Gallery');
	});
});

function pageScroll(eventObj) {
	if ($('#'+eventObj.parentNode.id + ' > .bottom_hint > .audio').hasClass('invisible')) {
		if (eventObj.scrollTop + eventObj.clientHeight > eventObj.scrollHeight - 20) {
			$('#'+eventObj.parentNode.id + ' > .bottom_hint > .arrow').addClass('invisible');
		}
		else {
			$('#'+eventObj.parentNode.id + ' > .bottom_hint > .arrow').removeClass('invisible');
		}
	}
}

function showContent(targetContent) {
	var iconObj = $('#'+targetContent+'Icon.icon');
	var targetObj = $('#'+targetContent+'Content.page_content');
	$('.page_content').addClass('invisible');
	var directWay = iconObj.hasClass('normal_icon');
	$('.plan_icon,.panorama_icon').removeClass('invert_icon').addClass('normal_icon');
	if (directWay) {
		iconObj.removeClass('normal_icon').addClass('invert_icon');
		targetObj.removeClass('invisible');
		$('.bottom_hint > .arrow').addClass('invisible');
	} else {
		$('#MainContent.page_content').removeClass('invisible');
		$('.bottom_hint > .arrow').removeClass('invisible');
	}
}

function showAudio(eventObj) {
	$('.bottom_hint > *').addClass('invisible');
	var jObj = $('#'+eventObj.id);
	if (jObj.hasClass('normal_icon')) {
		jObj.removeClass('normal_icon').addClass('invert_icon');
		$('.bottom_hint > .audio').removeClass('invisible');
	} else {
		jObj.removeClass('invert_icon').addClass('normal_icon');
		$('.bottom_hint > .arrow').removeClass('invisible');
	}
}
