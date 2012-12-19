function Loader() {}

Loader.getContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("target"), "Loader.getContent -- target undefined");

	if (Parameters.target.data("url") !== undefined) {
		$.ajax({
			 url: Parameters.target.data("url")
			,success: function(data) {
					Parameters.data = data;
					Loader.setContent(Parameters);
				}
			,error: function(xhr, type) {
					alert("Ajax error!");
				}
			});
	}
}

Loader.setContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("target"), "Loader.setContent -- target undefined");

	var target = Parameters.target;

	var targetData = target.html();
	//var needDataUpdate = ((targetData.length != Parameters.data.length) || (targetData != Parameters.data));
	var needDataUpdate = (targetData.length === 0);
	if (needDataUpdate) {
		target.html(Parameters.data);
		setTimeout(function () {
			mainScroller.refresh();
		}, 0);
	}
	var pageID = target.attr("id");
	switch (pageID) {
		case "Buttons":
		case "PanoramaContent":
			Buttons.register();
		break;
		case "Menu":
			Menu.register();
		break;
		case "Temples":
			Temples.register();
		break;
		default:
			if (Parameters.hasOwnProperty("loadNext") && Parameters.loadNext === true && target.hasClass("page")) {
				setTimeout(function () {
					Loader.getContent({
						 target: target.prev()
						,loadNext: false
					});
					Loader.getContent({
						 target: target.next()
						,loadNext: false
					});
				}, 300);

				$(".plan").addClass("invisible");
				var scrollerOptions = {
					 snap: true
					,momentum: false
					,hScroll: false
					,vScroll: true
					,hScrollbar: false
					,vScrollbar: false
					,lockDirection: true
					};
				switch (pageID) {
					case "Page03":
						if (pageScroller[target.index()] === undefined || pageScroller[target.index()] === null) {
							scrollerOptions.onScrollEnd = Buttons.toggleEyeText;
							setTimeout(function () {
								pageScroller[target.index()] = new iScroll(target.children("#MainContent").get(0), scrollerOptions);
								Buttons.toggleEyeText();
							}, 0);
						}
						var screens = target.find(".screen");
						screens.css("height", wrapperHeight);
						target.find(".scroller").css("height", wrapperHeight * screens.length);
					break;
					case "Page04":
						setTimeout(function () {
							Map.register({target: target.children("#Map")});
						}, 400);
					break;
					case "Page05-1":
						if (pageScroller[target.index()] === undefined || pageScroller[target.index()] === null) {
							setTimeout(function () {
								scrollerOptions.snap = false;
								scrollerOptions.onScrollEnd = Buttons.refreshScroll;
								pageScroller[target.index()] = new iScroll(target.children("#MainContent").get(0), scrollerOptions);
								Buttons.refreshScroll.call(pageScroller[target.index()], pageID);
							}, 0);
						}
					break;
				}
				setTimeout(function() {
					var setupObj = {pageID: pageID};
					Menu.setup(setupObj);
					Temples.setup(setupObj);
					Buttons.setup(setupObj);
				}, 0);
				
				// Cleanup
				setTimeout(function() {
					for (index in pageScroller) {
						if (index == target.index()) continue;
						if (pageScroller[index] !== undefined && pageScroller[index] !== null) {
							pageScroller[index].destroy();
							pageScroller[index] = null;
						}
					}
					var toClear = target.prevAll(":gt(0)").add(target.nextAll(":gt(0)")).not("#Page04");
					toClear.children().remove();
					toClear.html("");
				}, 500);
			}
		break;
	}
}
