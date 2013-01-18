function Loader() {}

Loader.getContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("target"), "Loader.getContent -- target undefined");

	if (Parameters.target.data("url") !== undefined) {
		$.ajax({
			 url: Parameters.target.data("url")
			,success: function(data) {
					Parameters.data = data;
					Loader.setContent(Parameters);
				}
			,error: function(xhr, type) {
					alert("Ajax error: " + xhr.statusText);
				}
			});
	}
}

Loader.setContent = function(Parameters) {
	console.assert(Parameters.hasOwnProperty("target"), "Loader.setContent -- target undefined");
	var target = Parameters.target;
	if (target.length === 0) {
		return;
	}
	var targetData = target.html();
	//var needDataUpdate = ((targetData.length != Parameters.data.length) || (targetData != Parameters.data));
	var needDataUpdate = (targetData.length === 0);
	if (needDataUpdate) {
		target.html(Parameters.data);
	}
	Menu.initPageAfterLoad.call(target, Parameters);
}
