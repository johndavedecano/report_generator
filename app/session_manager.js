var config = require('./../config.js');
var search = require('./search.js');
var Q      = require('q');
var _ = require('underscore');
/**
 * @param object socket
 * @param string sessionKey
 * @param string organizationKey
 */
var SessionManager = function(socket, sessionKey, organizationKey) {
	this.client          = socket.getClient();
	this.sessionKey      = sessionKey;
	this.organizationKey = organizationKey;
	this.search          = new search(config.elasticsearch);
}

SessionManager.prototype = {
	perform : function(session) {
		this.constructAllData(session).then(function(data) {
			console.log(data);
		}.bind(this));
	},
	constructAllData : function(session) {
    	var deferred = Q.defer();
		this.getVisitorData(session.visitor).then(function(visitor) {
			deferred.resolve(this.createESContract(session, visitor));
		}.bind(this));
		return deferred.promise;
	},
	getVisitorData : function(visitor_id) {
    	var deferred = Q.defer();
    	this.client
    		.child(this.organizationKey)
    		.child('visitors')
    		.child(visitor_id)
    		.once('value', function(snap) {
    			deferred.resolve(_.extend(snap.val(), { visitor_id : visitor_id }));
    		});
    	return deferred.promise;
	},
	createESContract : function(session, visitor) {
		var name = visitor.meta.name || visitor.meta.assigned;
		var meta = visitor.meta || {};
		var last_message = session.last_message || {};
		var geoip = session.geoip || {};
		
		var ua = visitor.ua || {};
		ua.browser = ua.browser || {};
		ua.engine =  ua.engine || {};
		ua.os = ua.os || {};
		ua.device = ua.device || '';

		return {
			"visitor_id" : visitor.visitor_id,
			"visitor_name" : meta.name || meta.assigned,
			"initial" : name.charAt(0),
			"avatar" : meta.avatar || '',
			"phone" : meta.phone || '',
			"rating" : session.rating || 0,
			"last_message" : last_message.message || '',
			"last_message_at" : last_message.updated_at || '',
			"longitude" : geoip.longitude || '',
			"latitude" : geoip.latitude || '',
			"zipcode" : geoip.zipcode || '',
			"os" : ua.os.name || '',
			"device" : ua.device,
			"engine" : ua.engine.name || '',
			"browser" : ua.browser.name || '',
			"city" : geoip.city || '',
			"state" : geoip.state || '',
			"country" : geoip.country || '',
			"created_at" : session.created_at,
			"email" : meta.email || '',
			"name" : meta.name || meta.assigned,
			"session_id" : this.sessionKey,
			"visitor_state" : session.state,
		}
	}
};

module.exports = SessionManager;