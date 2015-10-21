var uuid = require('uuid');
var _    = require('underscore');
var config = require('./../../config.js');
var search = require('./../search.js');

var TeamPersister = function(data) {
    this.fillables = ["browser","city","country","created_at","handling_time","session_id","state","team_id","team_name","wait_time"];
    this.client    = new search(config.elasticsearch);
    this.data      = data;
    this.type      = 'teams';
}

TeamPersister.prototype = {
	persist : function(index) {
		this.client.insert({
			  index : index
			, type  : this.type
			, id    : uuid.v1()
			, body  : this.getData()
		}, function(error, response) {
			console.log(error);
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

module.exports = TeamPersister;