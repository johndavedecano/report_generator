var uuid = require('uuid');
var _    = require('underscore');
var team = function(client, data) {
    this.fillables = ["browser","city","country","created_at","handling_time","session_id","state","team_id","team_name","wait_time"];
    this.client    = client;
    this.data      = data;
    this.type      = 'teams';
}

team.prototype = {
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

module.export = team;