/**
 * Created by jdecano on 10/7/15.
 */
var socket                 = require('./socket.js');
var OrganizationCollection = require('./organization_collection.js')
var moment                 = require('moment');
var _                      = require('underscore');
var SessionManager         = require('./session_manager.js');

var generator = function(config) {
    this.config = config;
    this.socket = new socket(config.firebase);
}

generator.prototype = {
    run : function() {
        var organizations = new OrganizationCollection(this.socket);
        organizations.get().then(function(organizations) {
        	_.each(organizations, function(organization) {
    			this.manage_organization(organization);
        	}.bind(this));
        }.bind(this));
    },
    manage_organization : function(organizationId) {
    	var client = this.socket.getClient();
    	var range  = this.getRange();
		client.child(organizationId)
			.child('sessions')
			.orderByChild("created_at")
			.startAt(range.startAt)
			.endAt(range.endAt)
			.once("value", function(snapshot) {
				snapshot.forEach(function(session) {
			  		var sessionManager = new SessionManager(this.socket, session.key(), organizationId);
			  		sessionManager.perform(session.val());
				}.bind(this));
			}.bind(this)
		);
    },
    getRange : function() {
    	var today   = moment(moment().format("YYYY-MM-DD")).utc().unix();
    	var startAt = moment(today, "X").utc().subtract(1, 'days').unix();
    	var endAt   = (startAt + 86400) - 1;
    	return {
			startAt : startAt * 1000,
			endAt   : endAt * 1000
    	}
    }
}

module.exports = generator;