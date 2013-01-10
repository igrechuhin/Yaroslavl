function Buttons() {}

Buttons.register = function() {
  setTimeout(function () {
    _Buttons.children()
      .add(_MenuButton)
      .add(_Hint.children("#UpDown").children())
      .add(_Menu.children("#Dim"))
      .unbind("touchstart").bind("touchstart", Buttons.touch);
  }, 0);
};

Buttons.setup = function(Parameters) {
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
      _Buttons.children("#Temple,#Route").removeClass("invisible");
    break;
    case "Page05-1":
    case "Page05-2":
    case "Page05-3":
    case "Page05-4":
    case "Page05-5":
    case "Page05-6":
      _Buttons.children("#Temple,#Plan,#Audio,#Photo,#Panorama").add(_Hint).removeClass("invisible");
      $("#"+Parameters.pageID).children("#MainContent").find("#Plan,#Photo").unbind("touchstart").bind("touchstart", Buttons.touch);
    break;
  }
  _Buttons.removeClass("invisible");
  _Buttons.children("#Audio").popover("destroy");
};

Buttons.touch = function(event) {
  event.stopPropagation();
  var target = event.currentTarget,
      targetObj = $(event.currentTarget),
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
    case "Dim":
      targetObj = _MenuButton;
    case "MenuButton":
    	targetObj.hasClass("invert") ? Menu.hide() : Menu.show();
    break;
    case "Route":
      Map.watchLocation();
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
    case "Audio":
      if (targetObj.hasClass("invert")) {
        _Buttons.find("#External,#Internal").unbind("touchstart");
        targetObj.popover("destroy");
      }
      else {
        targetObj.popover("show");
        _Buttons.find("#External,#Internal").unbind("touchstart").bind("touchstart", Buttons.touch);
      }
    break;
    case "External":
    case "Internal":
      Guide.register(currentPage.children("ul#"+target.id));
      _Buttons.find("#External,#Internal").unbind("touchstart");
      targetObj = _Buttons.children("#Audio");
      targetObj.popover("destroy");
    break;
    case "Photo":
      targetObj = _Buttons.children("#"+target.id);
    break;
    case "Plan":
      if (targetObj.hasClass("invert")) {
        plan.addClass("invisible");
        _Hint.removeClass("invisible");
      } else {
        plan.removeClass("invisible");
        Plan.register(plan);
        _Hint.addClass("invisible");
      }
      targetObj = _Buttons.children("#"+target.id);
    break;
    case "Panorama":
      window.location.href = "panorama.html?" + currentPage.attr("id");
    break;
  }
  targetObj.toggleClass("invert");
};

Buttons.showRoute = function() {
  _Buttons.children("#Route").removeClass("invisible");
};

Buttons.hideRoute = function() {
  _Buttons.children("#Route").addClass("invisible");
};

Buttons.toggleEyeText = function() {
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
