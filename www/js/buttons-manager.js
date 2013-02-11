/*global $, window, App, setTimeout, Code */

App.ButtonsManager = {
  SkipTouchOnScroll: false,
  ScrollDuration: 200,
  PSInstance: null,

  register: function () {
    setTimeout(function () {
      var dom = App.DOM,
          btnsMgr = App.ButtonsManager;
      dom.Buttons.children()
        .add(dom.MenuButton)
        .add(dom.Hint.children("#UpDown").children())
        .add(dom.Menu.children("#Dim"))
        .unbind("touchstart").bind("touchstart", btnsMgr.touch);
    }, 0);
  },

  setup: function (Parameters) {
    var dom = App.DOM,
        btnsMgr = App.ButtonsManager,
        $btns = dom.Buttons,
        $hint = dom.Hint,
        $menuBtn = dom.MenuButton;
    $btns.children().removeClass().add($hint).addClass("invisible");
    $menuBtn.removeClass();
    switch (Parameters.pageID) {
    case "Page01":
      $menuBtn.addClass("brown");
      break;
    case "Page02":
    case "Page10":
    case "Page13":
      $btns.children("#Temple").removeClass("invisible");
      break;
    case "Page03":
      $btns.children("#Temple,#Eye,#Text").add($hint).removeClass("invisible");
      btnsMgr.toggleEyeText();
      break;
    case "Page04":
      $btns.children("#Temple,#Route").removeClass("invisible");
      break;
    case "Page05-1":
    case "Page05-2":
    case "Page05-3":
    case "Page05-4":
    case "Page05-5":
    case "Page05-6":
      $btns.children("#Temple,#Plan,#Audio,#Photo,#Panorama").add($hint).removeClass("invisible");
      $("#" + Parameters.pageID).children("#MainContent").find("#Plan,#Photo").unbind("touchstart").bind("touchstart", btnsMgr.touch);
      break;
    case "Page06":
      $btns.children("#Temple").removeClass("invisible");
      dom.Page06.find("div.images-button").unbind("touchend").bind("touchend", btnsMgr.touch);
      break;
    case "Page07":
      $btns.children("#Temple").add($hint).removeClass("invisible");
      dom.Page07.find("div.panorama-button").unbind("touchend").bind("touchend", btnsMgr.touch);
      break;
    case "Page08":
      $btns.children("#Temple").removeClass("invisible");
      dom.Page08.find("td.audio-button").unbind("touchend").bind("touchend", btnsMgr.touch);
      break;
    case "Page09":
    case "Page12":
      $btns.children("#Temple").add($hint).removeClass("invisible");
      break;
    case "Page11":
      $btns.children("#Temple").removeClass("invisible");
      dom.Page11.find("img.social-button").unbind("touchend").bind("touchend", btnsMgr.touch);
      break;
    }
    $btns.removeClass("invisible");
    $btns.children("#Audio").popover("destroy");
  },

  touch: function (event) {
    var dom = App.DOM,
        btnsMgr = App.ButtonsManager,
        menuMgr = App.MenuManager,
        target = event.currentTarget,
        targetObj = $(event.currentTarget),
        currentPage = menuMgr.CurrentPage,
        wnd = window,
        plan, currentPageID;
    if (btnsMgr.SkipTouchOnScroll) { return; }
    event.stopImmediatePropagation();
    if (targetObj.hasClass("images-button")) {
      menuMgr.BackPage = currentPage;
      btnsMgr.showImages($(event.target));
    } else if (targetObj.hasClass("panorama-button")) {
      targetObj = $(event.target);
      wnd.location.href = "panorama.html?backpage=Page07" + "&temple=" + targetObj.data("temple") + "&panorama=" + targetObj.data("panorama");
    } else if (targetObj.hasClass("audio-button")) {
      App.GuideManager.register(targetObj.children("ul"));
    } else if (targetObj.hasClass("social-button")) {
      wnd.open(targetObj.data("url"), "_blank");
    } else {
      switch (target.id) {
      case "Dim":
        targetObj = dom.MenuButton;
        targetObj.hasClass("invert") ? menuMgr.hide() : menuMgr.show();
        break;
      case "MenuButton":
        targetObj.hasClass("invert") ? menuMgr.hide() : menuMgr.show();
        break;
      case "Route":
        App.MapManager.watchLocation();
        break;
      case "Temple":
        targetObj.hasClass("invert") ? App.TemplesManager.hide() : App.TemplesManager.show();
        break;
      case "Eye":
        menuMgr.getScroller().scrollToPage(0, 0, btnsMgr.ScrollDuration);
        return;
      case "Text":
        menuMgr.getScroller().scrollToPage(0, 1, btnsMgr.ScrollDuration);
        return;
      case "Up":
      case "Down":
        btnsMgr.scrollY(menuMgr.getScroller(), target.id);
        break;
      case "Audio":
        if (targetObj.hasClass("invert")) {
          targetObj.popover("destroy");
          dom.Buttons.find("#External,#Internal").unbind("touchstart");
        }
        else {
          targetObj.popover("show");
          dom.Buttons.find("#External,#Internal").unbind("touchstart").bind("touchstart", btnsMgr.touch);
        }
        break;
      case "External":
      case "Internal":
        App.GuideManager.register(currentPage.children("ul#" + target.id));
        dom.Buttons.find("#External,#Internal").unbind("touchstart");
        targetObj = dom.Buttons.children("#Audio");
        targetObj.popover("destroy");
        break;
      case "Photo":
        targetObj = dom.Buttons.children("#" + target.id);
        menuMgr.BackPage = currentPage;
        menuMgr.gotoPage(dom.Page06);
        menuMgr.NeedGoBack = true;
        setTimeout(function () {
          btnsMgr.showImages(dom.Page06.find("div.images-button > div#Temple" + currentPage.attr("id").substr("Page05-".length)));
        }, 100);
        break;
      case "Plan":
        plan = currentPage.children("#PlanContent");
        if (targetObj.hasClass("invert")) {
          plan.addClass("invisible");
          dom.Hint.removeClass("invisible");
        } else {
          plan.removeClass("invisible");
          App.PlanManager.register(plan);
          dom.Hint.addClass("invisible");
        }
        targetObj = dom.Buttons.children("#" + target.id);
        break;
      case "Panorama":
        currentPageID = currentPage.attr("id");
        wnd.location.href = "panorama.html?backpage=" + currentPageID + "&temple=" + currentPageID;
        break;
      }
      targetObj.toggleClass("invert");
    }
  },

  scrollY: function (scroll, direction) {
    if (scroll === undefined || scroll === null) { return; }
    var dom = App.DOM,
        btnsMgr = App.ButtonsManager,
        menuMgr = App.MenuManager,
        currentPageIndex = menuMgr.CurrentPage.index(),
        dir = (direction === "Up") ? -1 : 1,
        scrollHeight = 0;
    if ((currentPageIndex >= dom.Page051.index() && currentPageIndex <= dom.Page056.index()) || 
        currentPageIndex === dom.Page09.index() || 
        currentPageIndex === dom.Page12.index()) {
      var linesCount = 3,
          lineHeight = menuMgr.CurrentPage.find("#MainContent > .scroller > .screen > article").css("line-height").replace(/[^\-\d\.]/g, ""),
          hintHeight = dom.Hint.css("height").replace(/[^\-\d\.]/g, ""),
          header = menuMgr.CurrentPage.children("h1"),
          headerHeight = header.height() + header.css("padding-top").replace(/[^\-\d\.]/g, "")*1 + header.css("padding-bottom").replace(/[^\-\d\.]/g, "")*1;
      scrollHeight = scroll.wrapperH - headerHeight - hintHeight - lineHeight * linesCount;
    }
    if (scrollHeight !== 0) {
      scroll.scrollTo(0, dir * scrollHeight, btnsMgr.ScrollDuration, true);
    } else if (scroll.pagesY.length !== 0) {
      scroll.scrollToPage(0, scroll.currPageY + dir, btnsMgr.ScrollDuration);
    }
  },

  toggleEyeText: function () {
    var dom = App.DOM,
        $btns = dom.Buttons,
        $pg = dom.Page03,
        $show = $btns.children("#Eye"),
        $hide = $btns.children("#Text"),
        menuMgr = App.MenuManager,
        $scroller = menuMgr.getScroller($pg.index()),
        $header = $pg.find("h1 > span");
    $header.addClass("invisible").filter("#" + $scroller.currPageY).removeClass("invisible");
    if ($scroller !== undefined && $scroller !== null && $scroller.currPageY !== 0) {
      var t = $show;
      $show = $hide;
      $hide = t;
    }
    $show.addClass("invert");
    $hide.removeClass("invert");
  },

  refreshScroll: function () {
    var dom = App.DOM,
        scrollHint = dom.Hint.children("#UpDown"),
        menuMgr = App.MenuManager,
        scroll = menuMgr.getScroller();
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
  },

  showImages: function (target) {
    var dom = App.DOM,
        btnsMgr = App.ButtonsManager,
        $pg = dom.Page06,
        $header = $pg.find("h1 > span"),
        $table = $pg.children("div.images-button"),
        $list = $pg.children("div#" + target.attr("id")),
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
            return !btnsMgr.SkipTouchOnScroll;
          }
        };

    $header.data("original", $header.data("original") || $header.text()).text($header.data("original") + " — " + templeName);
    $header.bind("touchstart", btnsMgr.hideImages);

    $table.addClass("invisible2");

    setTimeout(function () {
      btnsMgr.PSInstance = $img.photoSwipe(galleryOptions);
      setTimeout(function () {
        $list.removeClass("invisible2");
        $div.unbind("touchend").bind("touchend", function (event) {
          event.currentTarget = event.currentTarget.firstChild;
          window.Code.PhotoSwipe.onTriggerElementClick.call(btnsMgr.PSInstance, event);
          console.log(""); // hack to make it wakeup
        });
      }, 50);
    }, 0);
  },

  hideImages: function () {
    var btnsMgr = App.ButtonsManager,
        dom, $pg, $header, $table, $list, $div, menuMgr;

    if (btnsMgr.PSInstance !== null) {
      menuMgr = App.MenuManager;
      dom = App.DOM;
      $pg = dom.Page06;
      $header = $pg.find("h1 > span");
      $table = $pg.children("div.images-button");
      $list = $pg.children("div");
      $div = $list.children("div");

      $header.text($header.data("original"));
      $header.unbind("touchstart");

      $list.addClass("invisible2");

      setTimeout(function () {
        Code.PhotoSwipe.detatch(btnsMgr.PSInstance);
        btnsMgr.PSInstance = null;
        
        if (menuMgr.NeedGoBack && menuMgr.isSamePage(menuMgr.CurrentPage, $pg)) {
          menuMgr.gotoPage(menuMgr.BackPage);
        }
      }, 50);
      
      $div.unbind("touchend");
      $table.removeClass("invisible2");
    }
  },

  infoTouch: function (event) {
    var $pg = App.DOM.Page01;
    if (event.currentTarget.id === "GetInfo") {
      $pg.children("div#Info").addClass("active");
    } else if (event.currentTarget.id === "Close") {
      $pg.children("div#Info").removeClass("active");
    } else {
      $pg.find("p#Definition").html($(event.currentTarget).data("definition"));
      $pg.children("div#Info").children("div").removeClass("invert");
      $(event.currentTarget).addClass("invert");
    }
  }
};
