var assert = require("assert");
var socket = require('./../app/socket.js');
var config = require('./../config.js');

describe('socket', function() {
	it('it should return instance of firebase', function () {
		var s = new socket(config.firebase);
		s.getClient();
    });
});