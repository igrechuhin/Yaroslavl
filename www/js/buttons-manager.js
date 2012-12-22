function Buttons() {}

Buttons.register = function() {
	"use strict";
	setTimeout(function () {
		_Buttons.children()
			.add(_MenuButton)
			.add(_Hint.children("#UpDown").children())
			.add(_PanoramaContent.children("#ClosePanorama,#Gyroscope"))
			.unbind("touchstart").bind("touchstart", Buttons.touch);
	}, 0);
};

Buttons.setup = function(Parameters) {
	"use strict";
	console.assert(Parameters.hasOwnProperty("pageID"), "Buttons.setup -- pageID undefined");
	_Buttons.children().removeClass().add(_Hint).addClass("invisible");
	_MenuButton.removeClass();
	switch(Parameters.pageID) {
		case "Page01":
			_MenuButton.addClass("brown");
		break;
		case "Page02":
			_Buttons.children("#Temple").removeClass("invisible");
		break;
		case "Page03":
			_Buttons.children("#Temple,#Eye,#Text").add(_Hint).removeClass("invisible");
			Buttons.toggleEyeText();
		break;
		case "Page04":
//			buttons.children("#Temple,#Location,#Route").removeClass("invisible");
			_Buttons.children("#Temple,#Location").removeClass("invisible");
		break;
		case "Page05-1":
		case "Page05-2":
		case "Page05-3":
		case "Page05-4":
		case "Page05-5":
		case "Page05-6":
			_Buttons.children("#Temple,#Plan,#Audio,#Photo,#Panorama").add(_Hint).removeClass("invisible");
		break;
	}
	_Buttons.removeClass("invisible");
};

Buttons.touch = function(event) {
  "use strict";
  event.stopPropagation();
  var target = event.currentTarget,
      targetObj = $(target),
      currentScroller = pageScroller[mainScroller.currPageX],
      scrollDuration = 200,
      currentPage = $();
  switch (mainScroller.currPageX) {
      case 4: currentPage = _Page051; break;
      case 5: currentPage = _Page052; break;
      case 6: currentPage = _Page053; break;
      case 7: currentPage = _Page054; break;
      case 8: currentPage = _Page055; break;
      case 9: currentPage = _Page056; break;
  }
  var plan = currentPage.children("#PlanContent");

  var scrollHeight = 0;
  if (currentScroller !== undefined && currentScroller.pagesY.length === 0) {
    var linesCount = 3,
        lineHeight = currentPage.find("#MainContent > .scroller > .screen > article").css("line-height").replace(/[^\-\d\.]/g, ""),
        hintHeight = _Hint.css("height").replace(/[^\-\d\.]/g, "");
    scrollHeight = currentScroller.wrapperH - hintHeight - lineHeight*linesCount;
  }
  switch (target.id) {
      case "MenuButton":
      	targetObj.hasClass("invert") ? Menu.hide() : Menu.show();
      break;
      case "Location":
      	Map.watchLocation();
      break;
      case "Route":
      	Map.getRoute();
      break;
      case "Temple":
      	targetObj.hasClass("invert") ? Temples.hide() : Temples.show();
      break;
      case "Eye":
      	currentScroller.scrollToPage(0, 0, scrollDuration);
      return;
      case "Text":
      	currentScroller.scrollToPage(0, 1, scrollDuration);
      return;
      case "Up":
      	if (scrollHeight !== 0) {
          currentScroller.scrollTo(0, -scrollHeight, scrollDuration, true);
        } else {
          currentScroller.scrollToPage(0, currentScroller.currPageY - 1, scrollDuration);
        }
      break;
      case "Down":
      	if (scrollHeight !== 0) {
          currentScroller.scrollTo(0, scrollHeight, scrollDuration, true);
        } else {
          currentScroller.scrollToPage(0, currentScroller.currPageY + 1, scrollDuration);
        }
      break;
      case "Plan":
      	if (targetObj.hasClass("invert")) {
          plan.addClass("invisible");
          _Hint.removeClass("invisible");
        } else {
          plan.removeClass("invisible");
          _Hint.addClass("invisible");
        }
      break;
      case "Panorama":
      	_PanoramaContent.removeClass("invisible");
      	var path = "panoramas/" + currentPage.data("url").replace(".html","/");
      	var settings = {
          swf: path+"virtualtour.swf",
          xml: path+"virtualtour.xml",
          target: "PanoramaContent",
          html5: "prefer"
        }
        var panoramaViewer = createPanoViewer(settings);
        panoramaViewer.embed();
      break;
      case "ClosePanorama":
      	var krpano = document.getElementById("krpanoSWFObject");
      	if (krpano && krpano.unload) {
          krpano.unload();
        }
      	_PanoramaContent.addClass("invisible");
      	targetObj = _Buttons.children("#Panorama");
      break;
      case "Gyroscope":
      	var krpano = document.getElementById("krpanoSWFObject");
      	krpano.set("plugin[gyro].enabled", !krpano.get("plugin[gyro].enabled"));
      break;   
  }
  targetObj.toggleClass("invert");
};

Buttons.showRoute = function() {
  "use strict";
  _Buttons.children("#Route").removeClass("invisible");
};

Buttons.hideRoute = function() {
  "use strict";
  _Buttons.children("#Route").addClass("invisible");
};

Buttons.toggleEyeText = function() {
  "use strict";
  var show = _Buttons.children("#Eye"),
      hide = _Buttons.children("#Text"),
      scrollerIndex = _Page03.index(),
      scroller = pageScroller[scrollerIndex],
      header = _Page03.find("h1 > span");
  
  header.addClass("invisible").filter("#"+scroller.currPageY).removeClass("invisible");
  if (scroller !== undefined && scroller !== null && scroller.currPageY !== 0) {
    var t = show;
    show = hide;
    hide = t;
  }
  show.addClass("invert");
  hide.removeClass("invert");
};

Buttons.refreshScroll = function() {
  "use strict";
  var scrollHint = _Hint.children("#UpDown");
  scrollHint.children().removeClass("invisible2");
  if (this.pagesY.length !== 0) {
    if (this.currPageY === 0) { // remove up
      scrollHint.children("#Up").addClass("invisible2");
    } else if (this.currPageY === this.pagesY.length-1) { // remove down
      scrollHint.children("#Down").addClass("invisible2");
    }
  } else {
    if (this.y === 0) { // remove up
      scrollHint.children("#Up").addClass("invisible2");
    } else if (this.y === this.maxScrollY) { // remove down
      scrollHint.children("#Down").addClass("invisible2");
    }
  }
};