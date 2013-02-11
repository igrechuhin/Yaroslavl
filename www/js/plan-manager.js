/*global $, App, setTimeout, iScroll*/

App.PlanManager = {
	Zoom: null,

	register: function(target) {
		var planMgr = App.PlanManager,
			audioMgr = App.AudioManager,
			dom = App.DOM;
		target.children(".marker").unbind("touchstart").bind('touchstart', planMgr.touch);
		audioMgr.initialize({controls: dom.PlanImage.find("#AudioPlayer")});
	},

	touch: function(event) {
		var planMgr = App.PlanManager,
			audioMgr = App.AudioManager,
			dom = App.DOM,
			$planImg = dom.PlanImage,
			target = $(event.currentTarget),
			$image = $planImg.find("#Image"),
			$imageContent = $planImg.find("#ImageContent");

		$imageContent.addClass("hide");
		$image.attr("src", "img/" + target.data("image"));

		setTimeout(function() {
			$planImg.removeClass("invisible").find("#Close").unbind("touchstart").bind("touchstart", planMgr.hide);
			dom.Pages.addClass("invisible2");

			audioMgr.setSource({
				url: "audio/" + target.data("audio"),
				startPlay: true
			});

			planMgr.Zoom = new iScroll($imageContent.get(0), {
				snap: false,
				snapThreshold: 100,
				zoom: true,
				zoomMax: 3,
				momentum: false,
				hScrollbar: false,
				vScrollbar: false,
				lockDirection: false
			});
			planMgr.refresh();
			$planImg.find("#Label").text(target.data("label"));
			$planImg.find("#Speaker").text(target.data("speaker"));
		}, 100);

		event.stopPropagation();
	},

	hide: function() {
		var planMgr = App.PlanManager,
			audioMgr = App.AudioManager,
			dom = App.DOM;
		planMgr.Zoom.destroy();
		planMgr.Zoom = null;
		audioMgr.release();
		dom.PlanImage.find("#PlayPause").removeClass("invert");
		dom.PlanImage.find("#AudioPlayer").addClass("invisible2");
		dom.PlanImage.addClass("invisible");
		dom.Pages.removeClass("invisible2");
		App.MenuManager.refreshPage();
	},

	refresh: function () {
		setTimeout(function() {
			var planMgr = App.PlanManager,
				dom = App.DOM,
				$image = dom.PlanImage.find("#Image"),
				imageHeight = $image.css("height").replace(/[^\-\d\.]/g, ""),
				$imageContent = dom.PlanImage.find("#ImageContent"),
				areaHeight = $imageContent.css("height").replace(/[^\-\d\.]/g, ""),
				marginTop = (areaHeight - imageHeight) / 2;
			$image.css("margin-top", marginTop + "px");
			$imageContent.removeClass("hide");
			if (planMgr.Zoom) {
				planMgr.Zoom.refresh();
			}
		}, 100);
	}
};
