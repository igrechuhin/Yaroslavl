function Menu() {}

Menu.register = function() {
  setTimeout(function () {
    _Menu.children(".button").bind(
      "touchstart",
      Menu.touch);
    _Menu.children("#Dim").bind(
      "touchstart touchmove touchend touchcancel",
      function(event) {
        event.stopPropagation();
      }
    );
  }, 0);
};

Menu.setup = function(Parameters) {
  console.assert(Parameters.hasOwnProperty("pageID"), "Menu.setup -- pageID undefined");
  var currentButtonID = ["#Page", "Button"].join(Parameters.pageID.substring(4, 6));
  _Menu.children().removeClass("invert").addClass("normal");
  _Menu.children(currentButtonID).toggleClass("normal invert");
  Menu.hide();
};

Menu.show = function() {
  $("video").addClass("invisible2");
  _Menu.removeClass("invisible");
  setTimeout(function() {
    _Menu.children().addClass("show");
    setTimeout(function() {
      _Menu.children(".hide").removeClass("show");
    }, 1000);
  }, 50);
};

Menu.hide = function() {
  _Menu.children().removeClass("show");
  $("video").removeClass("invisible2");
  setTimeout(function() {
    _Menu.addClass("invisible");
  }, 500);
};

Menu.touch = function(event) {
  Menu.gotoPage($("#"+$(event.currentTarget).data("page")));
  event.stopPropagation();
};

Menu.currentPage = -1;
Menu.gotoPage = function(target) {
  var doLoad = true;
  if (typeof target === "number") {
    if (Menu.currentPage.index() !== target) {
      target = _PagesScroller.children().eq(target);
    } else {
      doLoad = false;
      _Buttons.add(_MenuButton).removeClass("invisible");
    }
  }
  if (doLoad) {
    Menu.currentPage = target;
    var loadOptions = {
      target: target,
      loadNext: true
    };

    Loader.getContent(loadOptions);
  }
};

Menu.createScroller = function(page, options) {
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
}

Menu.initPageAfterLoad = function(Parameters) {
  setTimeout(function() {
    mainScroller.refresh();
    mainScroller.scrollToPage(Menu.currentPage.index(), 0, 300);
  }, 0);

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
             target: that.prev()
            ,loadNext: false
          });
          Loader.getContent({
             target: that.next()
            ,loadNext: false
          });
        }, 300);
        $(".plan").addClass("invisible");
        var scrollerOptions = {
          snap: true,
          momentum: true,
          hScroll: false,
          vScroll: true,
          hScrollbar: false,
          vScrollbar: false,
          lockDirection: true
        };
        switch (pageID) {
          case "Page03":
            var screens = that.find(".screen");
            screens.css("height", wrapperHeight);
            that.find(".scroller").css("height", wrapperHeight * screens.length);
            scrollerOptions.onScrollEnd = function() {
              Buttons.toggleEyeText.call(pageScroller[pageIndex]);
              Buttons.refreshScroll.call(pageScroller[pageIndex]);
            }
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
            scrollerOptions.snap = false;
            scrollerOptions.onScrollEnd = Buttons.refreshScroll;
            Menu.createScroller(that, scrollerOptions);
          break;
        }
        setTimeout(function() {
          var setupObj = { pageID: pageID };
          Menu.setup(setupObj);
          Temples.setup(setupObj);
          Buttons.setup(setupObj);
        }, 100);
        // Cleanup
        setTimeout(function() {
          for (index in pageScroller) {
            var ind = parseInt(index);
            if (ind === pageIndex /*|| ind === _Page06.index()*/) continue;
            if (pageScroller[ind] !== undefined && pageScroller[ind] !== null) {
              pageScroller[ind].destroy();
              pageScroller[ind] = null;
            }
          }
          if (pageIndex !== _Page06.index()) {
            Buttons.hideImages();
          }
          var toClear = that.prevAll(":gt(0)").add(that.nextAll(":gt(0)")).not(_Page04);//.not(_Page06);
          toClear.children().remove();
          toClear.html("");
        }, 500);
      }
    break;
  }
};
