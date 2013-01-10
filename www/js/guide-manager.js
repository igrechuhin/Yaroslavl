function Guide() {}

Guide.zoom = null;

Guide.register = function(target) {
	var images = [];
	target.children().each(function(index, element) {
		var el = $(element);
		images.push({
			source: "img/" + el.data("image"),
			from: el.data("from"),
			to: el.data("to"),
			label: el.data("label")
		});
	});

	var _image = _PlanImage.find("#Image"),
		_label = _PlanImage.find("#Label"),
		_imageContent = _PlanImage.find("#ImageContent"),
		areaHeight = _imageContent.css("height").replace(/[^\-\d\.]/g, "");

	var setImage = function(source, text) {
		_imageContent.addClass("hide");
		_image.attr("src", source);
		setTimeout(function() {
			Guide.zoomCreate(_imageContent);
			setTimeout(function() {
				var imageHeight = _image.css("height").replace(/[^\-\d\.]/g, ""),
					padingTop = (areaHeight - imageHeight) / 2;
				_image.css("padding-top", padingTop + "px");
				_label.text(text);
				_imageContent.removeClass("hide");
			}, 100);
		}, 250);
	};

	var currentIndex = 0;
	setImage(images[currentIndex].source, images[currentIndex].label);

	audio.initialize({
		controls: _PlanImage.find("#AudioPlayer"),
		onPositionUpdate: function(position) {
			var pos = parseInt(position);
			if (pos >= images[currentIndex].from && pos <= images[currentIndex].to) return;
			for (var i = 0; i < images.length; i++) {
				if (pos >= images[i].from && pos <= images[i].to) {
					currentIndex = i;
					setImage(images[currentIndex].source, images[currentIndex].label);
					return;
				};
			};
		},
		onRelease: function() {
			_image.attr("src", "");
			_label.text("");
		}
	});
	setTimeout(function() {
		_PlanImage.removeClass("invisible").find("#Close").unbind("touchstart").bind("touchstart", Guide.hide);
		_Pages.addClass("invisible");
		_Hint.addClass("invisible");

		audio.setSource({
			url: "audio/" + target.data("audio"),
			startPlay: true
		});
	}, 100);
	event.stopPropagation();
}

Guide.hide = function() {
	Guide.zoomDestroy();
	audio.release();
	_PlanImage.find("#PlayPause").removeClass("invert");
	_PlanImage.find("#AudioPlayer").addClass("invisible2");
	_PlanImage.addClass("invisible");
	_Pages.removeClass("invisible");
	_Hint.removeClass("invisible");
}

Guide.zoomDestroy = function() {
	if (Guide.zoom !== null) {
		Guide.zoom.destroy();
		Guide.zoom = null;
	};
}

Guide.zoomCreate = function(target) {
	if (Guide.zoom !== null) {
		Guide.zoom.zoom(0, 0, 1, 0);
		Guide.zoom.refresh();
	} else {
		Guide.zoom = new iScroll(target.get(0), {
			snap: false,
			snapThreshold: 100,
			zoom: true,
			zoomMax: 3,
			momentum: false,
			hScrollbar: false,
			vScrollbar: false,
			lockDirection: false
		});
	}
}
