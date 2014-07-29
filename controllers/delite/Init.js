/** @module dapp/controllers/delite/Init */
define(["require", "dcl/dcl", "dojo/Deferred",
		"../../utils/hash", "../../Controller", "dojo/_base/declare"
	],
	function (require, dcl, Deferred, hash, Controller, declare) {
		/**
		 * An Init controller for a dapp application using delite.
		 *
		 * @class module:dapp/controllers/delite/Init
		 * @augments module:dapp/Controller
		 */
		/**
		 * Get a property from a dot-separated string, such as "A.B.C".
		 */
		function getObject(name) {
			try {
				return name.split(".").reduce(function (context, part) {
					return context[part];
				}, this); // "this" is the global object (i.e. window on browsers)
			} catch (e) {
				// Return undefined to indicate that object doesn't exist.
			}
		}

		return dcl(Controller, {
			constructor: function () {
				this.events = {
					"dapp-init": this._initHandler.bind(this),
					"dapp-setup-view-stores": this._createDataStore.bind(this)
				};
			},
			_initHandler: function () {
				this._createDataStore(this.app);
				// we might want to parse first
				if (this.app.parseOnLoad) {
					var self = this;
					require(["delite/register"], function (register) {
						register.parse();
						self._initContainer();
					});
				} else {
					this._initContainer();
				}
			},

			_createDataStore: function (appOrView) {
				// summary:
				//		Create data store instance
				if (appOrView.stores) {
					//create stores in the configuration.
					for (var item in appOrView.stores) {
						if (item.charAt(0) !== "_") { //skip the private properties
							var type = appOrView.stores[item].type ? appOrView.stores[item].type : "dojo/store/Memory";
							var config = {};
							if (appOrView.stores[item].params) {
								dcl.mix(config, appOrView.stores[item].params);
							}
							// we assume the store is here through dependencies
							var StoreCtor;
							try {
								StoreCtor = require(type);
							} catch (e) {
								throw new Error(type + " must be listed in the dependencies");
							}
							if (config.data && typeof config.data === "string") {
								//get the object specified by string value of data property
								//cannot assign object literal or reference to data property
								//because json.ref will generate __parent to point to its parent
								//and will cause infinitive loop when creating StatefulModel.
								config.data = getObject(config.data);
							}
							if (appOrView.stores[item].observable) {
								var observableCtor;
								try {
									observableCtor = require("dstore/Observable");
								} catch (e) {
									throw new Error("dstore/Observable must be listed in the dependencies");
								}
								// TODO: I was not able to get dstore observable working with dcl
								//appOrView.stores[item].store = observableCtor(new StoreCtor(config));
								//var MyStore = dcl([StoreCtor, observableCtor], {
								//	get: dcl.superCall(function (sup) {
								//		return function () {
								//			sup.call(this);
								//		}
								//	})
								var MyStore = declare([StoreCtor, observableCtor], {
									get: function () {
										// need to make sure that this.inherited still works with Observable
										return this.inherited(arguments);
									}
								});
								appOrView.stores[item].store = new MyStore(config);
							} else {
								appOrView.stores[item].store = new StoreCtor(config);
							}
							appOrView.loadedStores[item] = appOrView.stores[item].store;
						}
					}
				}
			},

			_initContainer: function () {
				// create the delite main container or use it if already available in the HTML of the app
				if (this.app.containerSelector == null) {
					if (this.app.domNode.children[0] == null) {
						// the user has not notified us of a widget to use as the parent
						// build one
						var self = this;
						require(["deliteful/ViewStack"], function (ViewStack) {
							var containerNode = self.app.containerNode = new ViewStack();
							containerNode.style.width = "100%";
							containerNode.style.height = "100%";
							containerNode.style.display = "block";
							self.app.domNode.appendChild(containerNode);
							containerNode.startup();
							self._displayInit();
						});
					} else {
						this.app.containerNode = this.app.domNode.children[0];
						this._displayInit();
					}
				} else {
					this.app.containerNode = this.app.domNode.querySelector(this.app.containerSelector);
					this._displayInit();
				}
			},
			_displayInit: function () {
				// fire the event on the container to load the main view
				var displayDeferred = new Deferred();
				// let's display default view
				var initialView = this.app.alwaysUseDefaultView ? this.app.defaultView : this.app._startView;
				var initialParams = this.app.alwaysUseDefaultView ? this.app.defaultParams : this.app._startParams;
				this.app.emit("dapp-display", {
					// TODO is that really defaultView a good name? Shouldn't it be defaultTarget or defaultView_s_?
					dest: initialView,
					viewParams: initialParams,
					displayDeferred: displayDeferred,
					bubbles: true,
					cancelable: true
				});
				if (this.app) {
					displayDeferred.then(function () {
						this.app.setStatus(this.app.STARTED);
						this.app.appStartedDef.resolve(this.app); // resolve the deferred from new Application
					}.bind(this));
				}
			}
		});
	});
