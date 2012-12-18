function Buttons() {}

Buttons.register = function() {
	$("#Buttons").children().bind("touchstart", Buttons.touch);
	$("#Hint").children("#UpDown").children().bind("touchstart", Buttons.touch);
	$("#PanoramaContent").children("#ClosePanorama").bind("touchstart", Buttons.touch);
}

Buttons.setup = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("pageID"), "Buttons.setup -- pageID undefined");
	var buttons = $("#Buttons");
	var hint = $("#Hint");
	buttons.children().removeClass().addClass("invisible");
	buttons.children("#Menu").removeClass("invisible");
	hint.addClass("invisible");
	switch(Parameters.pageID) {
		case "Page01":
			buttons.children("#Menu").toggleClass("brown");
		break;
		case "Page02":
			buttons.children("#Temple").removeClass("invisible");
		break;
		case "Page03":
			buttons.children("#Temple,#Eye,#Text").removeClass("invisible");
			Buttons.toggleEyeText();
		break;
		case "Page04":
//			buttons.children("#Temple,#Location,#Route").removeClass("invisible");
			buttons.children("#Temple,#Location").removeClass("invisible");
		break;
		case "Page05-1":
		case "Page05-2":
		case "Page05-3":
		case "Page05-4":
		case "Page05-5":
		case "Page05-6":
			hint.removeClass("invisible");
			buttons.children("#Temple,#Plan,#Audio,#Photo,#Panorama").removeClass("invisible");
		break;
	}
}

Buttons.touch = function(event) {
	event.stopPropagation();
	var target = event.currentTarget;
	var targetObj = $(target);
	var plan = null
		,currentScroller = pageScroller[mainScroller.currPageX];
	switch (mainScroller.currPageX) {
		case 4: //Page05-1
			plan = $("#Page05-1").children("#PlanContent");
		break;
	}

	switch (target.id) {
		case "Menu":
			targetObj.hasClass("invert") ? Menu.hide() : Menu.show();
		break;
		case "Location":
			Map.watchLocation();
		break;
		case "Route":
/*			if (!Map.isWatchingLocation()) {
				Map.watchLocation();
			}*/
			Map.getRoute();
		break;
		case "Temple":
			targetObj.hasClass("invert") ? Temples.hide() : Temples.show();
		break;
		case "Eye":
			currentScroller.scrollToPage(0, 0, 200);
		return;
		case "Text":
			currentScroller.scrollToPage(0, 1, 200);
		return;
		case "Up":
			currentScroller.scrollTo(0, -currentScroller.wrapperH + 40, 200, true);
		break;
		case "Down":
			currentScroller.scrollTo(0, currentScroller.wrapperH - 40, 200, true);
		break;
		case "Plan":
			if (targetObj.hasClass("invert")) {
				plan.addClass("invisible");
				$("#Hint").removeClass("invisible");
			} else {
				plan.removeClass("invisible");
				$("#Hint").addClass("invisible");
			}
		break;
		case "Panorama":
			$("#PanoramaContent").removeClass("invisible");
			var path = 'panoramas/page05-1/';
			var settings = {
				 swf: path+'virtualtour.swf'
				,xml: path+'virtualtour.xml'
				,target: 'PanoramaContent'
				,html5: 'prefer'
			}
			panoramaViewer = createPanoViewer(settings);
			panoramaViewer.embed();
		break;
		case "ClosePanorama":
			var krpano = document.getElementById("krpanoSWFObject");
			if (krpano && krpano.unload) {
				krpano.unload();
			}
			$("#PanoramaContent").addClass("invisible");
			targetObj = $("#Buttons").children("#Panorama");
		break;
	}
	targetObj.toggleClass("invert");
}

Buttons.showRoute = function() {
	$("#Buttons").children("#Route").removeClass("invisible");
}

Buttons.hideRoute = function() {
	$("#Buttons").children("#Route").addClass("invisible");
}

Buttons.toggleEyeText = function() {
	var buttons = $("#Buttons")
		,show = buttons.children("#Eye")
		,hide = buttons.children("#Text")
		,scrollerIndex = $("#Page03").index()
		,scroller = pageScroller[scrollerIndex];
		
	if (scroller !== undefined && scroller !== null && scroller.currPageY !== 0) {
		var t = show;
		show = hide;
		hide = t;
	}
	
	show.addClass("invert");
	hide.removeClass("invert");
}

Buttons.refreshScroll = function() {
	var scrollHint = $("#Hint").children("#UpDown");
	scrollHint.children().removeClass("invisible2");
	if (this.y === 0) { // remove up
		scrollHint.children("#Up").addClass("invisible2");
	} else if (this.y === this.maxScrollY) { // remove down
		scrollHint.children("#Down").addClass("invisible2");
	}
}