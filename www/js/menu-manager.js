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

Menu.gotoPage = function(target, delay) {
  delay = delay || 200;
  Loader.getContent({
    target: target,
    loadNext: true});
  setTimeout(function() {
    mainScroller.scrollToPage(target.index(), 0, delay);
  }, 0);
};