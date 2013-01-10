function Plan() {}

Plan.zoom = null;

Plan.register = function(target) {
	target.children(".marker").unbind("touchstart").bind('touchstart', Plan.touch);
	audio.initialize({controls: _PlanImage.find("#AudioPlayer")});
}

Plan.touch = function(event) {
	var target = $(event.currentTarget),
		_image = _PlanImage.find("#Image"),
		_label = _PlanImage.find("#Label"),
		_imageContent = _PlanImage.find("#ImageContent"),
		areaHeight = _imageContent.css("height").replace(/[^\-\d\.]/g, "");

	_imageContent.addClass("hide");
	_image.attr("src", "img/" + target.data("image"));

	setTimeout(function() {
		_PlanImage.removeClass("invisible").find("#Close").unbind("touchstart").bind("touchstart", Plan.hide);
		_Pages.addClass("invisible");

		audio.setSource({
			url: "audio/" + target.data("audio"),
			startPlay: true
		});

		Plan.zoom = new iScroll(_imageContent.get(0), {
			snap: false,
			snapThreshold: 100,
			zoom: true,
			zoomMax: 3,
			momentum: false,
			hScrollbar: false,
			vScrollbar: false,
			lockDirection: false
		});
		setTimeout(function() {
			var imageHeight = _image.css("height").replace(/[^\-\d\.]/g, ""),
				padingTop = (areaHeight - imageHeight) / 2;
			_image.css("padding-top", padingTop + "px");
			_label.text(target.data("label"));
			_imageContent.removeClass("hide");
		}, 100);
	}, 100);

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