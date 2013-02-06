function Buttons() {}

Buttons.register = function () {
  setTimeout(function () {
    _Buttons.children()
      .add(_MenuButton)
      .add(_Hint.children("#UpDown").children())
      .add(_Menu.children("#Dim"))
      .unbind("touchstart").bind("touchstart", Buttons.touch);
  }, 0);
};

Buttons.setup = function (Parameters) {
  console.assert(Parameters.hasOwnProperty("pageID"), "Buttons.setup -- pageID undefined");
  _Buttons.children().removeClass().add(_Hint).addClass("invisible");
  _MenuButton.removeClass();
  switch (Parameters.pageID) {
  case "Page01":
    _MenuButton.addClass("brown");
    break;
  case "Page02":
  case "Page10":
  case "Page13":
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
    $("#" + Parameters.pageID).children("#MainContent").find("#Plan,#Photo").unbind("touchstart").bind("touchstart", Buttons.touch);
    break;
  case "Page06":
    _Buttons.children("#Temple").removeClass("invisible");
    _Page06.find("div.images-button").unbind("touchend").bind("touchend", Buttons.touch);
    break;
  case "Page07":
    _Buttons.children("#Temple").add(_Hint).removeClass("invisible");
    _Page07.find("div.panorama-button").unbind("touchend").bind("touchend", Buttons.touch);
    break;
  case "Page08":
    _Buttons.children("#Temple").removeClass("invisible");
    _Page08.find("td.audio-button").unbind("touchend").bind("touchend", Buttons.touch);
    break;
  case "Page09":
  case "Page12":
    _Buttons.children("#Temple").add(_Hint).removeClass("invisible");
    break;
  case "Page11":
    _Buttons.children("#Temple").removeClass("invisible");
    _Page11.find("img.social-button").unbind("touchend").bind("touchend", Buttons.touch);
    break;
  }
  _Buttons.removeClass("invisible");
  _Buttons.children("#Audio").popover("destroy");
};

Buttons.skipTouchOnScroll = false;
Buttons.scrollDuration = 200,
Buttons.touch = function (event) {
  if (Buttons.skipTouchOnScroll) {
    return;
  }
  event.stopImmediatePropagation();
  var target = event.currentTarget,
      targetObj = $(event.currentTarget),
      currentPage = Menu.currentPage,
      currentScroller = pageScroller[currentPage.index()];
  if (targetObj.hasClass("images-button")) {
    Menu.backPage = Menu.currentPage;
    Buttons.showImages($(event.target));
  } else if (targetObj.hasClass("panorama-button")) {
    targetObj = $(event.target);
    window.location.href = "panorama.html?backpage=Page07" + "&temple=" + targetObj.data("temple") + "&panorama=" + targetObj.data("panorama");
  } else if (targetObj.hasClass("audio-button")) {
    Guide.register(targetObj.children("ul"));
  } else if (targetObj.hasClass("social-button")) {
    window.open(targetObj.data("url"), "_blank");
  } else {
    switch (target.id) {
    case "Dim":
      targetObj = _MenuButton;
      if (targetObj.hasClass("invert")) {
        Menu.hide();
      } else {
        Menu.show();
      }
      break;
    case "MenuButton":
      if (targetObj.hasClass("invert")) {
        Menu.hide();
      } else {
        Menu.show();
      }
      break;
    case "Route":
      Map.watchLocation();
      break;
    case "Temple":
      if (targetObj.hasClass("invert")) {
        Temples.hide();
      } else {
        Temples.show();
      }
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
      Guide.register(currentPage.children("ul#" + target.id));
      _Buttons.find("#External,#Internal").unbind("touchstart");
      targetObj = _Buttons.children("#Audio");
      targetObj.popover("destroy");
      break;
    case "Photo":
      targetObj = _Buttons.children("#" + target.id);
      Menu.backPage = Menu.currentPage;
      Menu.gotoPage(_Page06);
      Menu.needGoBack = true;
      setTimeout(function () {
        Buttons.showImages(_Page06.find("div.images-button > div#Temple" + currentPage.attr("id").substr("Page05-".length)));
      }, 100);
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
      targetObj = _Buttons.children("#" + target.id);
      break;
    case "Panorama":
      window.location.href = "panorama.html?backpage=" + currentPage.attr("id") + "&temple=" + currentPage.attr("id");
      break;
    }
    targetObj.toggleClass("invert");
  }
};

Buttons.scrollY = function (scroll, direction) {
  if (scroll === undefined || scroll === null) {
    return;
  }
  var currentPageIndex = Menu.currentPage.index(),
      dir = (direction === "Up") ? -1 : 1,
      scrollHeight = 0;
  if ((currentPageIndex >= _Page051.index() && currentPageIndex <= _Page056.index()) || 
      currentPageIndex === _Page09.index() || 
      currentPageIndex === _Page12.index()) {
    var linesCount = 3,
        lineHeight = Menu.currentPage.find("#MainContent > .scroller > .screen > article").css("line-height").replace(/[^\-\d\.]/g, ""),
        hintHeight = _Hint.css("height").replace(/[^\-\d\.]/g, ""),
        header = Menu.currentPage.children("h1"),
        headerHeight = header.height() + header.css("padding-top").replace(/[^\-\d\.]/g, "")*1 + header.css("padding-bottom").replace(/[^\-\d\.]/g, "")*1;
    scrollHeight = scroll.wrapperH - headerHeight - hintHeight - lineHeight * linesCount;
  }
  if (scrollHeight !== 0) {
    scroll.scrollTo(0, dir * scrollHeight, Buttons.scrollDuration, true);
  } else if (scroll.pagesY.length !== 0) {
    scroll.scrollToPage(0, scroll.currPageY + dir, Buttons.scrollDuration);
  }
  else {
    if (currentPageIndex === _Page06.index()) {
      var $li = _Page06.find(".image-gallery:not(.invisible)").children();
      for (var i =  0; i < $li.length; i++) {
        var $eq = $li.eq(i),
            top = $eq.offset().top,
            height = $eq.height(),
            windowHeight = $(window).height();
        if (top <= dir * windowHeight && (top + height >= dir * windowHeight)) {
          scroll.scrollToElement($eq.get(0), Buttons.scrollDuration);
          return;
        }
      }
      if (dir === -1) {
        scroll.scrollToElement($li.eq(0).get(0), Buttons.scrollDuration);
      }
    }
  }
};

Buttons.showRoute = function () {
  _Buttons.children("#Route").removeClass("invisible");
};

Buttons.hideRoute = function () {
  _Buttons.children("#Route").addClass("invisible");
};

Buttons.toggleEyeText = function () {
  var show = _Buttons.children("#Eye"),
      hide = _Buttons.children("#Text"),
      scrollerIndex = _Page03.index(),
      scroller = pageScroller[scrollerIndex],
      header = _Page03.find("h1 > span");
  header.addClass("invisible").filter("#" + scroller.currPageY).removeClass("invisible");
  if (scroller !== undefined && scroller !== null && scroller.currPageY !== 0) {
    var t = show;
    show = hide;
    hide = t;
  }
  show.addClass("invert");
  hide.removeClass("invert");
};

Buttons.refreshScroll = function () {
  var scrollHint = _Hint.children("#UpDown"),
      scroll = pageScroller[Menu.currentPage.index()];
   if (scroll === undefined || scroll === null) {
    return;
  }
  scrollHint.children().removeClass("invisible2");
  if (scroll.pagesY.length !== 0) {
    if (scroll.currPageY === 0) { // remove up
      scrollHint.children("#Up").addClass("invisible2");
    } else if (scroll.currPageY === scroll.pagesY.length - 1) { // remove down
      scrollHint.children("#Down").addClass("invisible2");
    }
  } else {
    if (scroll.y === 0) { // remove up
      scrollHint.children("#Up").addClass("invisible2");
    } else if (scroll.y === scroll.maxScrollY) { // remove down
      scrollHint.children("#Down").addClass("invisible2");
    }
  }
};

Buttons.psInstance = null;
//Buttons.hackTimer = null;
Buttons.showImages = function (target) {
  var $header = _Page06.find("h1 > span"),
      $table = _Page06.children("div.images-button"),
      $list = _Page06.children("div#" + target.attr("id")),
      $div = $list.children("div"),
      $img = $div.children("img"),
      templeName = target.children().text(),
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
          return !Buttons.skipTouchOnScroll;
        }
      };

  $header.data("original", $header.data("original") || $header.text()).text($header.data("original") + " — " + templeName);
  $header.bind("touchstart", Buttons.hideImages);

  $table.addClass("invisible2");

  setTimeout(function () {
    Buttons.psInstance = $img.photoSwipe(galleryOptions);
    setTimeout(function () {
      $list.removeClass("invisible2");
      $div.unbind("touchend").bind("touchend", function (event) {
        event.currentTarget = event.currentTarget.firstChild;
        window.Code.PhotoSwipe.onTriggerElementClick.call(Buttons.psInstance, event);
      });
      console.assert(Buttons.psInstance, "Buttons.showImages -- photoSwipe instance is null");
    }, 50);
  }, 0);
  //Buttons.hackTimer = setInterval(function() {
    //console.log();
  //}, 100);
};

Buttons.hideImages = function () {
  if (Buttons.psInstance !== null) {
    var $header = _Page06.find("h1 > span"),
        $table = _Page06.children("div.images-button"),
        $list = _Page06.children("div"),
        $div = $list.children("div");

    $header.text($header.data("original"));
    $header.unbind("touchstart");

    $list.addClass("invisible2");

    setTimeout(function () {
      Code.PhotoSwipe.detatch(Buttons.psInstance);
      Buttons.psInstance = null;
      
      if (Menu.needGoBack && Menu.isSamePage(Menu.currentPage, _Page06)) {
        Menu.gotoPage(Menu.backPage);
      }
    }, 50);
    
    $div.unbind("touchend");
    $table.removeClass("invisible2");
    //clearInterval(Buttons.hackTimer);
  }
};

Buttons.infoTouch = function () {
  if (event.currentTarget.id === "GetInfo") {
    _Page01.children("div#Info").addClass("active");
  } else if (event.currentTarget.id === "Close") {
    _Page01.children("div#Info").removeClass("active");
  } else {
    _Page01.find("p#Definition").html($(event.currentTarget).data("definition"));
    _Page01.children("div#Info").children("div").removeClass("invert");
    $(event.currentTarget).addClass("invert");
  }
}
