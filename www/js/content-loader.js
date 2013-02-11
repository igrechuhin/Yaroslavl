/*global $, alert, Menu, App */

App.Loader = {
    getContent: function(Parameters) {
        if (Parameters.target.data("url") !== undefined) {
           $.ajax({
               url: Parameters.target.data("url"),
               success: function(data) {
                   Parameters.data = data;
                   App.Loader.setContent(Parameters);
               },
               error: function(xhr) {
                   alert("Ajax error: " + xhr.statusText);
               }
           });
        }
    },

    setContent: function(Parameters) {
        var target = Parameters.target;
        if (target.length === 0) { return; }
        var targetData = target.html();
        //var needDataUpdate = ((targetData.length != Parameters.data.length) || (targetData != Parameters.data));
        var needDataUpdate = (targetData.length === 0);
        if (needDataUpdate) {
            target.html(Parameters.data);
        }
        App.MenuManager.initPageAfterLoad.call(target, Parameters);
    }
};
