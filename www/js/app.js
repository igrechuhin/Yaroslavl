/*global $, window, document, alert,  App */

App = {};

function sizePagesForOrientation () {
    var dom = App.DOM,
        pagesScroller = dom.PagesScroller,
        pages = dom.PagesScroller.children();
    pagesScroller.css("width", window.innerWidth * pages.length);
    pages.css({
        "width" : window.innerWidth,
        "min-height" : window.innerHeight
    });
    dom.Page01.css("min-height", Math.max(window.innerHeight, window.innerWidth));
}

$(document).ready(function () {
    var pages = $("div#Pages"),
        pagesScroller = pages.children("div#PagesScroller"),
        pageID = document.location.search.substring(1),
        pagesArray = pagesScroller.children();

    App.Orientation = (window.orientation == -90 || window.orientation == 90) ? "landscape" : "portrait";
    App.Loader = function(Parameters) {
        var target = Parameters.target;
        if (target.data("url") === undefined || target.length === 0) { return; }
        if (target.html().length === 0) {
            $.ajax({
                url: target.data("url"),
                success: function(data) {
                   Parameters.data = data;
                   target.html(Parameters.data);
                   App.MenuManager.initPageAfterLoad.call(target, Parameters);
                },
                error: function(xhr) { alert("Ajax error: " + xhr.statusText); }
            });
        } else { App.MenuManager.initPageAfterLoad.call(target, Parameters); }
    };

    App.DOM = {
        Menu: $("div#Menu"),
        Buttons: $("div#Buttons"),
        Temples: $("div#Temples"),
        Hint: $("div#Hint"),
        MenuButton: $("div#MenuButton"),
        Pages: pages,
        PagesScroller: pagesScroller,
        PlanImage: $("div#PlanImage"),

        Page01: pagesScroller.children("div#Page01"),
        Page02: pagesScroller.children("div#Page02"),
        Page03: pagesScroller.children("div#Page03"),
        Page04: pagesScroller.children("div#Page04"),
        Page051: pagesScroller.children("div#Page05-1"),
        Page052: pagesScroller.children("div#Page05-2"),
        Page053: pagesScroller.children("div#Page05-3"),
        Page054: pagesScroller.children("div#Page05-4"),
        Page055: pagesScroller.children("div#Page05-5"),
        Page056: pagesScroller.children("div#Page05-6"),
        Page06: pagesScroller.children("div#Page06"),
        Page07: pagesScroller.children("div#Page07"),
        Page08: pagesScroller.children("div#Page08"),
        Page09: pagesScroller.children("div#Page09"),
        Page10: pagesScroller.children("div#Page10"),
        Page11: pagesScroller.children("div#Page11"),
        Page12: pagesScroller.children("div#Page12"),
        Page13: pagesScroller.children("div#Page13")
    };

    App.Loader({target: App.DOM.Menu});
    App.Loader({target: App.DOM.Buttons});
    App.Loader({target: App.DOM.Temples});
    App.Loader({target: App.DOM.Hint});
    App.Loader({target: App.DOM.PlanImage});

    sizePagesForOrientation();
    App.MenuManager.createScroller();

    App.MenuManager.gotoPage((pageID.length > 0) ? pagesArray.filter("div#"+pageID) : pagesArray.first());
    //setInterval(function () {console.log(Buttons.skipTouchOnScroll);}, 100);
});

window.onorientationchange = function() {
    var menuMgr = App.MenuManager,
        dom = App.DOM,
        $pg = menuMgr.CurrentPage,
        $scroller = null;
    App.Orientation = (window.orientation == -90 || window.orientation == 90) ? "landscape" : "portrait";
    sizePagesForOrientation();
    menuMgr.refreshPage();
    if (menuMgr.isSamePage($pg, dom.Page03) || menuMgr.isSamePage($pg, dom.Page07)) {
        var screens = $pg.find(".screen"),
            currScroller = menuMgr.getScroller(),
            currScrollerPosition = currScroller.$pgY;
        screens.css("height", window.innerHeight);
        $pg.find(".scroller").css("height", window.innerHeight * screens.length);
        currScroller.refresh();
        currScroller.scrollToPage(0, currScrollerPosition, 300);
    } else if (menuMgr.isSamePage($pg, dom.Page11)) {
        $scroller = menuMgr.getScroller($pg.index());
        if (App.Orientation === "landscape") {
            dom.Hint.addClass("invisible");
            $scroller.disable();
        } else {
            dom.Hint.removeClass("invisible");
            $scroller.enable();
        }
    }
    App.PlanManager.refresh();
};
