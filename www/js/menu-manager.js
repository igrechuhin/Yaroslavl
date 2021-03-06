/*global $, window, document, App, setTimeout, clearTimeout, iScroll */

App.MenuManager = {
  CurrentPage: $(),
  BackPage: $(),
  NeedGoBack: false,
  PageScroller: [],
  MainScroller: null,
  CleanupTimer: null,
  DefaultCleanupDelay: 3000,
  CleanupDelay: 3000,
  ShowMapAlert: true,

  register: function () {
    setTimeout(function () {
      var dom = App.DOM,
          menu = dom.Menu,
          menuMgr = App.MenuManager;
      menu.children(".button").bind("touchstart", menuMgr.touch);
      menu.children("#Dim").bind("touchstart touchmove touchend touchcancel", function (event) {
        event.stopPropagation();
      });
    }, 0);
  },

  setup: function (Parameters) {
    var dom = App.DOM,
        currentButtonID = ["#Page", "Button"].join(Parameters.pageID.substring(4, 6)),
        menuMgr = App.MenuManager;
    dom.Menu.children().removeClass("invert").addClass("normal");
    dom.Menu.children(currentButtonID).toggleClass("normal invert");
    menuMgr.hide();
  },

  show: function () {
    var dom = App.DOM;
    $("video").hide();
    dom.Menu.removeClass("invisible");
    setTimeout(function () {
      dom.Menu.children().addClass("show");
      setTimeout(function () {
        dom.Menu.children(".hide").removeClass("show");
      }, 1000);
    }, 50);
  },

  hide: function () {
    var dom = App.DOM;
    dom.Menu.children().removeClass("show");
    $("video").show();
    setTimeout(function () {
      dom.Menu.addClass("invisible");
    }, 500);
  },

  touch: function (event) {
    var menuMgr = App.MenuManager;
    menuMgr.gotoPage($("#" + $(event.currentTarget).data("page")));
    event.stopPropagation();
  },

  gotoPage: function (target) {
    var menuMgr = App.MenuManager,
        dom = App.DOM,
        loader = App.Loader;
    if (typeof target === "number") { target = dom.PagesScroller.children().eq(target); }
    else if (target.attr("id") === undefined) { return; }
    menuMgr.NeedGoBack = false;
    if (menuMgr.isSamePage(menuMgr.CurrentPage, target)) {
      dom.Buttons.add(dom.MenuButton).removeClass("invisible");
      return;
    }
    menuMgr.CurrentPage = target;
    loader({
      target: target,
      loadNext: true
    });
  },

  createPageScroller: function (page, options) {
    var menuMgr = App.MenuManager,
        btnsMgr = App.ButtonsManager,
        pgScroller = menuMgr.PageScroller[page.index()];
    if (pgScroller === undefined || pgScroller === null) {
      setTimeout(function () {
        var pgIndex = page.index();
        menuMgr.PageScroller[pgIndex] = new iScroll(page.children("#MainContent").get(0), options);
        btnsMgr.refreshScroll.call(menuMgr.PageScroller[pgIndex]);
      }, 50);
    } else if (pgScroller !== null) {
      pgScroller.refresh();
      pgScroller.scrollTo(0, 0, 0);
    }
  },

  getScroller: function (index) {
    var menuMgr = App.MenuManager;
    return (index === undefined || index === null) ? menuMgr.PageScroller[menuMgr.CurrentPage.index()] : menuMgr.PageScroller[index];
  },

  createScroller: function () {
    var menuMgr = App.MenuManager,
        btnsMgr = App.ButtonsManager,
        dom = App.DOM;
    menuMgr.MainScroller = new iScroll(dom.Pages.get(0), {
        snap: true,
        skipScrollRatio: 0.2,
        momentum: false,
        hThreshold: 200,
        hScroll: true,
        vScroll: false,
        hScrollbar: false,
        vScrollbar: false,
        lockDirection: true,
        handleClick: false,
        onScrollMove: function() {
            btnsMgr.SkipTouchOnScroll = true;
            dom.MenuButton.addClass("invisible");
            dom.Buttons.addClass("invisible");
        },
        onTouchEnd: function() {
            if (btnsMgr.SkipTouchOnScroll) {
                menuMgr.gotoPage(this.currPageX);
            }
        },
        onScrollEnd: function() {
            setTimeout(function () {
                btnsMgr.SkipTouchOnScroll = false;
            }, 50);
        }
    });
  },

  refreshPage: function () {
    var menuMgr = App.MenuManager;
    menuMgr.MainScroller.refresh();
    setTimeout(function () {
      menuMgr.MainScroller.scrollToPage(menuMgr.CurrentPage.index(), 0, 200);
    }, 50);
  },

  initPageAfterLoad: function (Parameters) {
    var menuMgr = App.MenuManager,
        btnsMgr = App.ButtonsManager,
        templesMgr = App.TemplesManager,
        dom = App.DOM,
        loader = App.Loader,
        that = this,
        pageID = that.attr("id"),
        scrollEnd = function () {
          btnsMgr.refreshScroll();
          setTimeout(function () { btnsMgr.SkipTouchOnScroll = false; }, 50);
        },
        scrollerOptions = {
          snap: true,
          momentum: true,
          hScroll: false,
          vScroll: true,
          hScrollbar: false,
          vScrollbar: false,
          lockDirection: true,
          momentumDeceleration: 0.006,
          onScrollMove: function () { btnsMgr.SkipTouchOnScroll = true; },
          onScrollEnd: scrollEnd
        },
        screens;

    menuMgr.refreshPage();

    switch (pageID) {
    case "Buttons":
    case "PanoramaContent":
      btnsMgr.register();
      break;
    case "Menu":
      menuMgr.register();
      break;
    case "Temples":
      templesMgr.register();
      break;
    default:
      if (Parameters.hasOwnProperty("loadNext") && Parameters.loadNext === true && that.hasClass("page")) {
        setTimeout(function () {
          loader({
             target: that.prev(),
             loadNext: false
          });
          loader({
             target: that.next(),
             loadNext: false
          });
        }, 400);
        $(".plan").addClass("invisible");
        switch (pageID) {
        case "Page01":
          dom.Page01.find("div#Info > div,div#GetInfo").unbind("touchstart").bind("touchstart", btnsMgr.infoTouch);
          break;
        case "Page02":
          var video = document.getElementById('video');
          video.addEventListener('click', function () {
            video.play();
          }, false);
          break;
        case "Page03":
          screens = that.find(".screen");
          screens.css("height", window.innerHeight);
          that.find(".scroller").css("height", window.innerHeight * screens.length);
          scrollerOptions.onScrollEnd = function () {
            btnsMgr.toggleEyeText();
            scrollEnd();
          };
          scrollerOptions.momentumDeceleration = 0.6;
          menuMgr.createPageScroller(that, scrollerOptions);
          setTimeout(function () {
            btnsMgr.toggleEyeText();
          }, 50);
          break;
        case "Page04":
          setTimeout(function () {
            var networkState = navigator.connection.type,
                $btn = dom.Buttons.children("#Route"),
                $target = that.children("div#Map");
            if (networkState == Connection.UNKNOWN || networkState == Connection.NONE) {
              if (menuMgr.ShowMapAlert === true || true) {
                navigator.notification.alert(
                    'Функции навигации недодступны', // message
                    function () {}, // callback
                    'Нет подключения к интернет' // title
                );
                menuMgr.ShowMapAlert = false;
                $btn.addClass("invisible");
              }
            } else {
              App.MapManager.register({target: $target});
              $target.css("background-image", "none");
              menuMgr.ShowMapAlert = true;
              $btn.removeClass("invisible");
            }
          }, 1000);
          break;
        case "Page05-1":
        case "Page05-2":
        case "Page05-3":
        case "Page05-4":
        case "Page05-5":
        case "Page05-6":
        case "Page09":
        case "Page11":
          scrollerOptions.snap = false;
          menuMgr.createPageScroller(that, scrollerOptions);
          break;
        case "Page07":
          screens = that.find(".screen");
          screens.css("height", window.innerHeight);
          that.find(".scroller").css("height", window.innerHeight * screens.length);
          menuMgr.createPageScroller(that, scrollerOptions);
          break;
        }
        setTimeout(function () {
          var setupObj = { pageID: pageID };
          menuMgr.setup(setupObj);
          templesMgr.setup(setupObj);
          btnsMgr.setup(setupObj);
        }, 100);
        clearTimeout(menuMgr.CleanupTimer);
        menuMgr.CleanupTimer = setTimeout(menuMgr.cleanup, menuMgr.CleanupDelay);
        menuMgr.CleanupDelay = menuMgr.CleanupDelay / 2;
      }
      break;
    }
  },

  isSamePage: function (Page1, Page2) {
    return Page1.attr("id") === Page2.attr("id");
  },

  cleanup: function () {
    var menuMgr = App.MenuManager,
        dom = App.DOM,
        btnsMgr = App.ButtonsManager,
        $pg = menuMgr.CurrentPage,
        pageIndex = $pg.index(),
        length = menuMgr.PageScroller.length,
        toClear = $pg.prevAll(":gt(0)").add($pg.nextAll(":gt(0)")).not(menuMgr.ShowMapAlert ? dom.Page04 : $()),
        ind,
        pgScroller;
    if (!menuMgr.isSamePage($pg, dom.Page06)) { btnsMgr.hideImages(); }
    for (ind = 0; ind < length; ind++) {
      if (ind === pageIndex) { continue; }
      pgScroller = menuMgr.getScroller(ind);
      if (pgScroller === undefined || pgScroller === null) { continue; }
      pgScroller.destroy();
      menuMgr.PageScroller[ind] = null;
    }
    toClear.children().remove();
    toClear.html("");
    menuMgr.CleanupDelay = menuMgr.DefaultCleanupDelay;
  }
};
