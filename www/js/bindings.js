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
	$('.menu_link').click(function() {
        menu.restore_init_state();
    });
	$("#Page04").live("pageinit", function() {
  		setTimeout(map.initialize, 500);
	});
	$("#Page06").live("pageinit", function() {
		gallery.init('#Gallery');
	});
	$('#PageContent').scroll(function(eventObj) {
		var div = eventObj.target;
		console.log(div.scrollTop + div.clientHeight + '==' + div.scrollHeight);
	});
});
