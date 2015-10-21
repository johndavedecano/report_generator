var config = require('./../config.js');
var Q      = require('q');
var _ = require('underscore');
var VisitorPersister = require('./contracts/VisitorPersister.js');
var SessionPersister = require('./contracts/SessionPersister.js');
var TeamPersister = require('./contracts/TeamPersister.js');
var AgentPersister = require('./contracts/AgentPersister.js');
/**
 * @param object socket
 * @param string sessionKey
 * @param string organizationKey
 */
var SessionManager = function(socket, sessionKey, organizationKey) {
	this.client          = socket.getClient();
	this.sessionKey      = sessionKey;
	this.organizationKey = organizationKey;
}

SessionManager.prototype = {
	perform : function(session) {
		this.constructAllData(session).then(function(data) {
			var teams = session.teams || {};
			var agents =  session.agents || {};
			this.make_session(data);
			this.make_visitor(data);
			this.make_agents(agents, data);
			this.make_teams(teams, data);
		}.bind(this));
	},
	make_session : function(data) {
		var Session = new SessionPersister(data);
		return Session.persist(this.organizationKey);
	},
	make_visitor : function(data) {
		var Visitor = new VisitorPersister(data);
		return  Visitor.persist(this.organizationKey);
	},
	make_teams : function(teams, data) {
		_.each(teams, function(id, key) {
			this.getTeamData(id).then(function(t) {
				data.team_name = t.name || '';
				data.team_id   = id;
				var Team = new TeamPersister(data);
				return Team.persist(this.organizationKey);
			}.bind(this));
		}.bind(this));
	},
	make_agents : function(agents, data) {
		_.each(agents, function(a, id) {
			data.agent_name = a.name || '';
			data.agent_id   = id;
			var Agent = new AgentPersister(data);
			return Agent.persist(this.organizationKey);
		}.bind(this));
	},
	constructAllData : function(session) {
    	var deferred = Q.defer();
		this.getVisitorData(session.visitor_id).then(function(visitor) {
			deferred.resolve(this.createESContract(session, visitor));
		}.bind(this));
		return deferred.promise;
	},
	getTeamData : function(team_id) {
    	var deferred = Q.defer();
    	this.client
    		.child(this.organizationKey)
    		.child('teams')
    		.child(team_id)
    		.once('value', function(snap) {
    			deferred.resolve(_.extend(snap.val(), { team_id : team_id }));
    		});
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
			"visitor_id"      : visitor.visitor_id,
			"visitor_name"    : meta.name || meta.assigned,
			"initial"         : name.charAt(0),
			"avatar"          : meta.avatar || '',
			"phone"           : meta.phone || '',
			"rating"          : session.rating || 0,
			"last_message"    : last_message.message || '',
			"last_message_at" : last_message.updated_at || '',
			"longitude"       : geoip.longitude || '',
			"latitude"        : geoip.latitude || '',
			"zipcode"         : geoip.zipcode || '',
			"os"              : ua.os.name || '',
			"device"          : ua.device,
			"engine"          : ua.engine.name || '',
			"browser"         : ua.browser.name || '',
			"city"            : geoip.city || '',
			"state"           : geoip.state || '',
			"country"         : geoip.country || '',
			"created_at"      : session.created_at,
			"email"           : meta.email || '',
			"name"            : meta.name || meta.assigned,
			"session_id"      : this.sessionKey,
			"visitor_state"   : session.state || 0,
			"handling_time"   : this.getHandlingTime(session),
			"wait_time"       : this.getWaitTime(session)
		}
	},
	getHandlingTime : function(session) {
		var served_at = parseInt(session.served_at);
		var ended_at  = parseInt(session.ended_at);
		if (ended_at > 0) {
			var total = Math.round((ended_at - served_at) / 1000);
		}
		return 0;
	},
	getWaitTime : function(session) {
		var queued_at  = parseInt(session.queued_at);
		var served_at  = parseInt(session.served_at);
		if (served_at > 0) {
			return Math.round((served_at - queued_at) / 1000);
		} 
		return 0;
	}
};

module.exports = SessionManager;