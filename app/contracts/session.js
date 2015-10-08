var uuid = require('uuid');
var _    = require('underscore');
var session = function(client, data) {
    this.fillables = ["browser","city","country","created_at","handling_time","state","wait_time"];
    this.client    = client;
    this.data      = data;
    this.type      = 'sessions';
}

session.prototype = {
	persist : function(index) {
		this.client.insert({
			  index : index
			, type  : this.type
			, id    : this.data.session_id
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

module.export = session;