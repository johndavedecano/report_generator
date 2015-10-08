var uuid = require('uuid');
var _    = require('underscore');
var agent = function(client, data) {
    this.fillables = ["agent_id","agent_name","browser","city","country","created_at","handling_time","session_id","state","wait_time"];
    this.client    = client;
    this.data      = data;
    this.type      = 'agents';
}

agent.prototype = {
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

module.export = agent;