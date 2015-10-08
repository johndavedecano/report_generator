var assert = require("assert");
var socket = require('./../app/socket.js');
var config = require('./../config.js');
var OrganizationCollection = require('./../app/organization_collection.js');

describe('organization_collection', function() {
	it('it should not make any errors', function () {
		var s = new socket(config.firebase);
		var x = new OrganizationCollection(s);
		x.get().then(function(y) {
			assert(Array.isArray(y), 'empty arrays are arrays');
		});
    });
});
