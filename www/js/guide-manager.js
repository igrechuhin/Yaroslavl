/*global $, setTimeout, clearTimeout, App, iScroll */

App.GuideManager = {
	Zoom: null,

	setImage: function (source, text) {
		var dom = App.DOM,
			guideMgr = App.GuideManager,
			$image = dom.PlanImage.find("#Image"),
			$label = dom.PlanImage.find("#Label"),
			$imageContent = dom.PlanImage.find("#ImageContent"),
			areaHeight = $imageContent.css("height").replace(/[^\-\d\.]/g, "");

		$imageContent.addClass("hide");
		$image.attr("src", source);
		setTimeout(function () {
			guideMgr.zoomCreate($imageContent);
			setTimeout(function () {
				var imageHeight = $image.css("height").replace(/[^\-\d\.]/g, ""),
					marginTop = (areaHeight - imageHeight) / 2;
				$image.css("margin-top", marginTop + "px");
				$label.text(text);
				$imageContent.removeClass("hide");
			}, 100);
		}, 250);
	},

	register: function (target) {
		var dom = App.DOM,
			guideMgr = App.GuideManager,
			audioMgr = App.AudioManager,
			images = [],
			currentIndex = 0,
			positionUpdateTimeout;
		target.children().each(function (index, element) {
			var el = $(element);
			images.push({
				source: "img/" + el.data("image"),
				from: el.data("from"),
				to: el.data("to"),
				label: el.data("label")
			});
		});

		guideMgr.setImage(images[currentIndex].source, images[currentIndex].label);
		dom.PlanImage.find("#Speaker").text(target.data("speaker"));

		audioMgr.initialize({
			controls: dom.PlanImage.find("#AudioPlayer"),
			onPositionUpdate: function (position) {
				clearTimeout(positionUpdateTimeout);
				positionUpdateTimeout = setTimeout(function() {
					var pos = parseInt(position, 10),
						i = images.length - 1;
					if (pos >= images[currentIndex].from && pos <= images[currentIndex].to) { return; }
					do {
						if (pos >= images[i].from && pos <= images[i].to) {
							currentIndex = i;
							guideMgr.setImage(images[i].source, images[i].label);
							return;
						}
					} while (i--);

				}, 200);
			},
			onRelease: function () {
				dom.PlanImage.find("#Image").attr("src", "");
				dom.PlanImage.find("#Label").text("");
			}
		});
		setTimeout(function () {
			dom.PlanImage.removeClass("invisible").find("#Close").unbind("touchstart").bind("touchstart", guideMgr.hide);
			dom.Pages.addClass("invisible2");
			dom.Hint.addClass("invisible2");

			audioMgr.setSource({
				url: "audio/" + target.data("audio"),
				startPlay: true
			});
		}, 100);
	},

	hide: function () {
		var dom = App.DOM,
			guideMgr = App.GuideManager,
			audioMgr = App.AudioManager;
		guideMgr.zoomDestroy();
		audioMgr.release();
		dom.PlanImage.find("#PlayPause").removeClass("invert");
		dom.PlanImage.find("#AudioPlayer").addClass("invisible2");
		dom.PlanImage.addClass("invisible");
		dom.Pages.removeClass("invisible2");
		dom.Hint.removeClass("invisible2");
	},

	zoomDestroy: function () {
		var guideMgr = App.GuideManager;
		if (guideMgr.Zoom !== null) {
			guideMgr.Zoom.destroy();
			guideMgr.Zoom = null;
		}
	},

	zoomCreate: function (target) {
		var guideMgr = App.GuideManager;
		if (guideMgr.Zoom !== null) {
			guideMgr.Zoom.zoom(0, 0, 1, 0);
			guideMgr.Zoom.refresh();
		} else {
			guideMgr.Zoom = new iScroll(target.get(0), {
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
};
