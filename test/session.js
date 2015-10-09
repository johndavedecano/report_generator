var assert = require("assert");
var SessionPersister = require('./../app/contracts/SessionPersister');
var config = require('./../config.js');
var search = require('./../app/search.js');

describe('session', function() {
	it('make sure session class works', function () {
		var engine = new search(config.elasticsearch);
		var client = engine.getClient();
		var x = new SessionPersister(client, {});
    });
});