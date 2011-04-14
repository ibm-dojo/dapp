define(["dojo","dojox/application"],function(dojo,Application){
	app = new Application({
			"id": "multiSceneApp",
			"name": "Multi Scene App",
			"description": "A multiSceneApp",
			"splash": "splash",

			"dependencies": [
				"dojox/mobile/TabBar",
				"dojox/mobile/_base"

			],
			// Modules for the application.  The are basically used as the second
			// array of mixins in a dojo.declare().  Modify the top level behavior
			// of the application, how it processes the config or any other life cycle
			// by creating and including one or more of these
			"modules": [
				"dojox/application/module/env"
				//"dojox/application/module/phonegap",
				//"dojox/application/module/somePlugin"
			],

			//stores we are using 
			"stores": {},

			"template": "application.html",

			//models and instantiation parameters for the models. Including 'type' as a property allows
			//one to overide the class that will be used for the model.  By default it is dojox/mvc/model
			"models": {}, 

			//views for the classes.  Like the models, type can be specified to override the class. The params property defines the
			//default parameters that will be used to instantiate this view.  Parameters define in the view definitions below get mixed
			//into the parameter set when using that scene/view/model combination.  Parameters outside of the 'param's object
			//are used to advise the management of the view by the application controller and are not passed to the view.
			"views": { 
				//simple html view, no context data
				"main": {
					"params": {
						//path to the template
						"template": "views/main.html" 
					} 
				}
			},

			//the name of the scene to load when the app is initialized.
			"defaultScene": "simple",	

			//scenes are groups of views and models loaded at once	
			"scenes": {

				//simple scene which loads all views and shows the default first
				"simple": { 
					//all views in the main scene will be bound to the user model
					"params": {
						"models": [],
				
						"defaultScene": "main",
						//the views available to this scene
						"views": [
							{"id":"main", "view": {"$ref": "#views.main"}},
						],
					}
				},

				"tabScene": {
					"type": "dojox/application/TabScene",
					"params": {
						"models": [],
						"views": [
							{"id":"view1", "label": "View 1", "view": {"$ref": "#views.view1"}},
						]
					}
				}	
			}	
	});
});