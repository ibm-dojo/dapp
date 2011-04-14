define(["dojo", "dijit", "dojox", "dijit/_WidgetBase", "dijit/_Container", "dijit/_Contained","dijit._TemplatedMixin"], function(dojo,dijit,dojox,Widget,Container,Contained,TemplatedMixin){
	return dojo.declare([Widget,TemplatedMixin,Container,Contained], {
		selected: false,
		keepScrollPosition: true,
		baseClass: "applicationView",
		config:null,
		templateString: '<div dojoAttachPoint="domNode,containerNode" class="appView"></div>',
		constructor: function(params,node){
			console.log("ctor: ", params)
			if (params.config && params.config.template){
				this.templateString=dojo.cache("",window.location.pathname + params.config.template);

			}
		},	

		startup: function(){
			console.log("view startup");
			this.inherited(arguments);
		}

	});
});