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
    case "Page06":
      _Buttons.children("#Temple").removeClass("invisible");
      _Page06.find("td.images-button").unbind("touchend").bind("touchend", Buttons.touch);
    break;
  }
  _Buttons.removeClass("invisible");
  _Buttons.children("#Audio").popover("destroy");
};

Buttons.skipTouchOnMainScroll = true;
Buttons.scrollDuration = 200,
Buttons.touch = function(event) {
  if (Buttons.skipTouchOnMainScroll) {
    return;
  }
  event.stopImmediatePropagation();
  var target = event.currentTarget,
      targetObj = $(event.currentTarget),
      currentPage = Menu.currentPage,
      currentScroller = pageScroller[currentPage.index()];
  if (targetObj.hasClass("images-button")) {
    Buttons.showImages(targetObj);
    return;
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
      currentScroller.scrollToPage(0, 0, Buttons.scrollDuration);
    return;
    case "Text":
      currentScroller.scrollToPage(0, 1, Buttons.scrollDuration);
    return;
    case "Up":
    case "Down":
      Buttons.scrollY(currentScroller, target.id);
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
      var plan = currentPage.children("#PlanContent");
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

Buttons.scrollY = function(currentScroller, direction) {
  if (currentScroller === undefined || currentScroller === null) {
    return;
  }
  var currentPageIndex = Menu.currentPage.index(),
      dir = (direction === "Up") ? -1 : 1
      scrollHeight = 0;
  if (mainScroller.currPageX >= 4 && mainScroller.currPageX <= 9) {
    var linesCount = 3,
        lineHeight = Menu.currentPage.find("#MainContent > .scroller > .screen > article").css("line-height").replace(/[^\-\d\.]/g, ""),
        hintHeight = _Hint.css("height").replace(/[^\-\d\.]/g, "");
    scrollHeight = currentScroller.wrapperH - hintHeight - lineHeight*linesCount;
  }
  if (scrollHeight !== 0) {
    currentScroller.scrollTo(0, dir * scrollHeight, Buttons.scrollDuration, true);
  } else if (currentScroller.pagesY.length !== 0) {
    currentScroller.scrollToPage(0, currentScroller.currPageY + dir, Buttons.scrollDuration);
  }
  else {
    if (currentPageIndex === _Page06.index()) {
      var $li = _Page06.find(".image-gallery:not(.invisible)").children();
      for (var i =  0; i < $li.length; i++) {
        var $eq = $li.eq(i),
            top = $eq.offset().top,
            height = $eq.height(),
            windowHeight = $(window).height();
        if (top <= dir*windowHeight && (top+height >= dir*windowHeight)) {
          currentScroller.scrollToElement($eq.get(0), Buttons.scrollDuration);
          return;
        }
      }
      if (dir === -1) {
        currentScroller.scrollToElement($li.eq(0).get(0), Buttons.scrollDuration);
      }
    }
  }
}

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

Buttons.skipImageShow = false;
Buttons.psInstance = null;
Buttons.showImages = function(target) {
  var $header = _Page06.find("h1 > span"),
      $table = _Page06.children("table"),
      $wrapper = _Page06.children("div#MainContent"),
      $list = $wrapper.find("ul#"+target.attr("id")),
      templeName = target.parent().next().children().eq(target.index()).text(),
      galleryOptions = {
        autoStartSlideshow: false,
        zIndex: 20000,
        slideshowDelay: 3000,
        cacheMode: Code.PhotoSwipe.Cache.Mode.normal,
        slideTimingFunction: "ease-in-out",
        loop: true,
        enableMouseWheel: false,
        enableKeyboard: false,
        maxUserZoom: 3.0,
        minUserZoom: 1.0,
        captionAndToolbarAutoHideDelay: 0,
        checkCanShow: function() {
          var skip = Buttons.skipImageShow;
          Buttons.skipImageShow = false;
          return !skip;
        }},
      scrollerOptions = {
          snap: false,
          momentum: true,
          hScroll: false,
          vScroll: true,
          hScrollbar: false,
          vScrollbar: false,
          lockDirection: true,
          handleClick: false,
          onScrollEnd: Buttons.refreshScroll,
          onScrollMove: function() { 
            Buttons.skipImageShow = true;
          }
      };

  Buttons.psInstance = $list.find("img").photoSwipe(galleryOptions);

  $header.data("original", $header.data("original") || $header.text()).text($header.data("original") + " — " + templeName);
  $header.bind("touchstart", Buttons.hideImages);

  $table.addClass("invisible");
  _Hint.removeClass("invisible");
  $wrapper.removeClass("invisible");
  $list.removeClass("invisible");
  
  Menu.createScroller(_Page06, scrollerOptions);
}

Buttons.hideImages = function() {
  if (Buttons.psInstance !== null) {
    var $header = _Page06.find("h1 > span"),
        $table = _Page06.children("table"),
        $wrapper = _Page06.children("div#MainContent"),
        $list = $wrapper.find("ul");

    $header.text($header.data("original"));
    $header.unbind("touchstart");

    Code.PhotoSwipe.detatch(Buttons.psInstance);
    Buttons.psInstance = null;

    Buttons.skipImageShow = false;

    $table.removeClass("invisible");
    _Hint.addClass("invisible");
    $wrapper.addClass("invisible");
    $list.addClass("invisible");
  }
}