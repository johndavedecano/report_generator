/**
 * Created by jdecano on 10/7/15.
 */
var Firebase = require('firebase');
var socket = function(config) {
    this.config = config;
    this.fb = new Firebase(config.endpoint);
    this.fb.authWithCustomToken(config.secret, function(payload) {
        console.log(payload || "Successfully logged in to firebase server...");
    });
}

socket.prototype = {
    /**
     * Client builder
     * @returns {Firebase|*}
     */
    getClient : function() {
        return this.fb;
    }
}
module.exports = socket;