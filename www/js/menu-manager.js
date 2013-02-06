function Menu() {}

Menu.register = function () {
  setTimeout(function () {
    _Menu.children(".button").bind(
      "touchstart",
      Menu.touch);
    _Menu.children("#Dim").bind(
      "touchstart touchmove touchend touchcancel",
      function (event) {
        event.stopPropagation();
      }
    );
  }, 0);
};

Menu.setup = function (Parameters) {
  console.assert(Parameters.hasOwnProperty("pageID"), "Menu.setup -- pageID undefined");
  var currentButtonID = ["#Page", "Button"].join(Parameters.pageID.substring(4, 6));
  _Menu.children().removeClass("invert").addClass("normal");
  _Menu.children(currentButtonID).toggleClass("normal invert");
  Menu.hide();
};

Menu.show = function () {
  $("video").hide();
  _Menu.removeClass("invisible");
  setTimeout(function () {
    _Menu.children().addClass("show");
    setTimeout(function () {
      _Menu.children(".hide").removeClass("show");
    }, 1000);
  }, 50);
};

Menu.hide = function () {
  _Menu.children().removeClass("show");
  $("video").show();
  setTimeout(function () {
    _Menu.addClass("invisible");
  }, 500);
};

Menu.touch = function (event) {
  Menu.gotoPage($("#" + $(event.currentTarget).data("page")));
  event.stopPropagation();
};

Menu.currentPage = $();
Menu.backPage = $();
Menu.needGoBack = false;
Menu.gotoPage = function (target) {
  if (typeof target === "number") {
    target = _PagesScroller.children().eq(target);
  } else if (target.attr("id") === undefined) {
    return;
  }
  Menu.needGoBack = false;
  if (Menu.isSamePage(Menu.currentPage, target)) {
    _Buttons.add(_MenuButton).removeClass("invisible");
    return;
  }
  Menu.currentPage = target;
  var loadOptions = {
    target: target,
    loadNext: true
  };
  Loader.getContent(loadOptions);
};

Menu.createScroller = function (page, options) {
  var pageIndex = page.index();
  if (pageScroller[pageIndex] === undefined || pageScroller[pageIndex] === null) {
    setTimeout(function () {
      pageScroller[pageIndex] = new iScroll(page.children("#MainContent").get(0), options);
      Buttons.refreshScroll.call(pageScroller[pageIndex]);
    }, 0);
  } else if (pageScroller[pageIndex] !== null) {
    pageScroller[pageIndex].refresh();
    pageScroller[pageIndex].scrollTo(0, 0, 0);
  }
};

Menu.refreshPage = function () {
  mainScroller.refresh();
  setTimeout(function () {
    mainScroller.scrollToPage(Menu.currentPage.index(), 0, 300);
  }, 50);
};

Menu.initPageAfterLoad = function (Parameters) {
  Menu.refreshPage();

  var that = this,
      pageID = that.attr("id"),
      pageIndex = that.index();
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
    if (Parameters.hasOwnProperty("loadNext") && Parameters.loadNext === true && that.hasClass("page")) {
      setTimeout(function () {
        Loader.getContent({
           target: that.prev(),
           loadNext: false
        });
        Loader.getContent({
           target: that.next(),
           loadNext: false
        });
      }, 300);
      $(".plan").addClass("invisible");
      var scrollEnd = function () {
          Buttons.refreshScroll();
          setTimeout(function () {
              Buttons.skipTouchOnScroll = false;
          }, 50);
      };
      var scrollerOptions = {
        snap: true,
        momentum: true,
        hScroll: false,
        vScroll: true,
        hScrollbar: false,
        vScrollbar: false,
        lockDirection: true,
        momentumDeceleration: 0.006,
        onScrollMove: function () {
          Buttons.skipTouchOnScroll = true;
        },
        onScrollEnd: scrollEnd
      };
      switch (pageID) {
      case "Page01":
        _Page01.find("div#Info > div,div#GetInfo").unbind("touchstart").bind("touchstart", Buttons.infoTouch);
        break;
      case "Page03":
        var screens = that.find(".screen");
        screens.css("height", window.innerHeight);
        that.find(".scroller").css("height", window.innerHeight * screens.length);
        scrollerOptions.onScrollEnd = function () {
          Buttons.toggleEyeText();
          scrollEnd();
        };
        scrollerOptions.momentumDeceleration = 0.6;
        Menu.createScroller(that, scrollerOptions);
        setTimeout(function () {
          Buttons.toggleEyeText();
        }, 50);
        break;
      case "Page04":
        setTimeout(function () {
          Map.register({target: that.children("#Map")});
        }, 1000);
        break;
      case "Page05-1":
      case "Page05-2":
      case "Page05-3":
      case "Page05-4":
      case "Page05-5":
      case "Page05-6":
      case "Page09":
//      case "Page10":
      case "Page12":
        scrollerOptions.snap = false;
        Menu.createScroller(that, scrollerOptions);
        break;
      case "Page07":
        var screens = that.find(".screen");
        screens.css("height", window.innerHeight);
        that.find(".scroller").css("height", window.innerHeight * screens.length);
        Menu.createScroller(that, scrollerOptions);
        break;
      case "Page08":
        break;
      case "Page11":
        break;
      }
      setTimeout(function () {
        var setupObj = { pageID: pageID };
        Menu.setup(setupObj);
        Temples.setup(setupObj);
        Buttons.setup(setupObj);
      }, 100);
      // Cleanup
      if (!Menu.isSamePage(Menu.currentPage, _Page06)) {
        Buttons.hideImages();
      }
      setTimeout(function () {
        for (var ind = 0; ind < pageScroller.length; ind++) {
          if (ind === pageIndex || pageScroller[ind] === undefined || pageScroller[ind] === null /*|| ind === _Page06.index()*/) {
            continue;
          }
          pageScroller[ind].destroy();
          pageScroller[ind] = null;
        }
        var toClear = that.prevAll(":gt(0)").add(that.nextAll(":gt(0)")).not(_Page04);//.not(_Page06);
        toClear.children().remove();
        toClear.html("");
      }, 500);
    }
    break;
  }
};

Menu.isSamePage = function (Page1, Page2) {
  return Page1.attr("id") === Page2.attr("id");
};
