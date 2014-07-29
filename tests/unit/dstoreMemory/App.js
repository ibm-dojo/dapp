// jshint quotmark:false
require(["dapp/Application", "dojo/json", "requirejs-text/text!./app.json", "dojo/sniff"],
	function (Application, json, config, has) {
		window.dstoreMemoryApp = {};
		window.dstoreMemoryApp.list1Data = {
			identifier: "id",
			'items': []
		};
		for (var i = 1; i < 6; i++) {
			window.dstoreMemoryApp.list1Data.items.push({
				label: "Selection " + i,
				id: i
			});
		}


		window.dstoreMemoryApp.list2Data = {
			identifier: "id",
			'items': []
		};
		for (i = 6; i < 11; i++) {
			window.dstoreMemoryApp.list2Data.items.push({
				label: "Selection " + i,
				id: i
			});
		}

		has.add("requirejs", window.requirejs);
		/* jshint nonew: false */
		var jsonData = config;
		jsonData = jsonData.replace(/\/\*.*?\*\//g, "");
		jsonData = jsonData.replace(/\/\/.*/g, "");
		//new Application(JSON.parse(jsonData));
		var appDeferred = new Application(JSON.parse(jsonData));
		appDeferred.then(function (app) {
			console.log("deferred resolved for new App [" + app.id + "] it should be started and default views shown");
		});
	});
