var uuid = require('uuid');
var _    = require('underscore');
var config = require('./../../config.js');
var search = require('./../search.js');

var SessionPersister = function(data) {
    this.fillables = ["browser","city","country","created_at","handling_time","state","wait_time"];
    this.data      = data;
    this.type      = 'sessions';
    this.client    = new search(config.elasticsearch);
}

SessionPersister.prototype = {
	persist : function(index) {
		var params = {
			  index : index
			, type  : this.type
			, id    : this.data.session_id
			, body  : this.getData()
		};
		this.client.insert(params);
	},
	getData : function()  {
		var data = {};
		_.each(this.fillables, function(key) {
			data[key] = this.data[key];
		}.bind(this));
		return data;
	}
};

module.exports = SessionPersister;