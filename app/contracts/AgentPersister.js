var uuid = require('uuid');
var _    = require('underscore');
var config = require('./../../config.js');
var search = require('./../search.js');

var AgentPersister = function(data) {
    this.fillables = ["agent_id","agent_name","browser","city","country","created_at","handling_time","session_id","state","wait_time"];
    this.data      = data;
    this.type      = 'agents';
    this.client    = new search(config.elasticsearch);
}

AgentPersister.prototype = {
	persist : function(index) {
		this.client.insert({
			  index : index
			, type  : this.type
			, id    : uuid.v1()
			, body  : this.getData()
		}, function(error, response) {

		});
	},
	getData : function()  {
		var data = {};
		_.each(this.fillables, function(key) {
			data[key] = this.data[key];
		}.bind(this));
		return data;
	}
};

module.exports = AgentPersister;