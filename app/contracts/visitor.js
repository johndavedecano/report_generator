var uuid = require('uuid');
var _    = require('underscore');
var visitor = function(client, data) {
    this.fillables = ["agent_id","agent_name","visitor_id","visitor_name","initial","avatar","phone","rating","last_message","last_message_at","longitude","latitude","zipcode","os","device","engine","browser","city","state","country","created_at","email","name","session_id","visitor_state"];
    this.client    = client;
    this.data      = data;
    this.type      = 'visitor';
}

visitor.prototype = {
	persist : function(index) {
		this.client.insert({
			  index : index
			, type  : this.type
			, id    : uuid.v1()
			, body  : this.getData()
		})
	},
	getData : function()  {
		var data = {};
		_.each(this.fillables, function(key) {
			data[key] = this.data[key];
		}.bind(this));
		return data;
	}
};

module.export = visitor;