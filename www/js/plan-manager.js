function Plan() {}

Plan.zoom = null;

Plan.register = function(target) {
	target.children(".marker").unbind("touchstart").bind('touchstart', Plan.touch);
}

Plan.touch = function(event) {
	var target = $(event.currentTarget);

	_PlanImage.find("#Image").attr("src", "img/" + target.data("image"));

	audio.initialize({controls: _PlanImage.find("#AudioPlayer")});
	audio.setSource({
		url: "audio/" + target.data("audio"),
		startPlay: true
	});

	setTimeout(function() {
		_PlanImage.find("#Label").text(target.data("label"));
		_PlanImage.removeClass("invisible").addClass("invisible2");
		_Pages.addClass("invisible");
		Plan.zoom = new iScroll(_PlanImage.find("#ImageContent").get(0), {
			snap: false,
			snapThreshold: 100,
			zoom: true,
			momentum: false,
			hScrollbar: false,
			vScrollbar: false,
			lockDirection: false
		});
		setTimeout(function() {
			var areaHeight = _PlanImage.find("#ImageContent").css("height").replace(/[^\-\d\.]/g, ""),
				imageHeight = _PlanImage.find("#Image").css("height").replace(/[^\-\d\.]/g, "");
			var padingTop = (areaHeight - imageHeight) / 2;
			_PlanImage.find("#Image").css("padding-top", padingTop + "px");
			_PlanImage.removeClass("invisible2");
		}, 50);
	}, 5);

	event.stopPropagation();
}

Plan.hide = function() {
	Plan.zoom.destroy();
	Plan.zoom = null;
	audio.release();
	_PlanImage.find("#PlayPause").removeClass("invert");
	_PlanImage.find("#AudioPlayer").addClass("invisible2");
	_PlanImage.addClass("invisible");
	_Pages.removeClass("invisible");
}