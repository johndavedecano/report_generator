/**
 * Created by jdecano on 10/7/15.
 */
var Firebase = require('firebase');
var socket = function(config) {
    this.config = config;
    this.fb = new Firebase(config.endpoint);
    this.fb.authWithCustomToken(config.secret, function(payload) {
        console.log(payload || "Firebase is okay............");
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