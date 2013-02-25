require(["dojo/_base/window","dojox/app/main", "dojox/json/ref", "dojo/sniff"],
	function(win, Application, json, has){
	win.global.modelApp = {};
	modelApp.list = { 
		identifier: "label",
		'items':[]
	};

	var isTablet = false;

	var configurationFile = "./config.json";
	if(window.innerWidth > 600){
		isTablet = true;
	}

	require(["dojo/text!"+configurationFile], function(configJson){
		var config = json.fromJson(configJson);
		has.add("tablet", isTablet);
		has.add("phone", !isTablet);
		has.add("ie9orLess", has("ie") && !has("ie") >= 10);
		has.add("notie9orLess", !has("ie") || has("ie") >= 10);
		Application(config);
	});
});