function Menu() {}

Menu.register = function() {
	setTimeout(function () {
		var menu = $("#Menu");
		menu.children(".button").bind("touchstart", Menu.touch);
		menu.children("#Dim").bind("touchstart touchmove touchend touchcancel", function(event) {
			event.stopPropagation();
		});
	}, 0);
}

Menu.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("pageID"), "Menu.setup -- pageID undefined");
	var	 currentButtonID = ["#Page", "Button"].join(Parameters.pageID.substring(4, 6))
			,menu = $("#Menu");
	menu.children().removeClass("invert").addClass("normal");
	menu.children(currentButtonID).toggleClass("normal invert");
	Menu.hide();
}

Menu.show = function() {
	//$("video").addClass("invisible2");
	var menu = $("#Menu");
	menu.removeClass("invisible");
	setTimeout(function() {
		menu.children().addClass("show");
		setTimeout(function() {
			menu.children(".hide").removeClass("show");
		}, 1000);
	}, 50);
}

Menu.hide = function() {
	var menu = $("#Menu");
	menu.children().removeClass("show");
	//$("video").removeClass("invisible2");
	setTimeout(function() {
		menu.addClass("invisible");
	}, 500);
}

Menu.touch = function(event) {
	Menu.gotoPage($("#"+$(event.currentTarget).data("page")));
	event.stopPropagation();
}

Menu.gotoPage = function(target) {
	Loader.getContent({
		 target: target
		,loadNext: true});
	mainScroller.scrollToPage(target.index(), 0, 200);
}