var Q = require('q');
var OrganizationCollection = function(socket) {
    this.socket = socket;
}

OrganizationCollection.prototype = {
    get : function() {
    	var deferred = Q.defer();
    	var socketClient = this.socket.getClient();
    	socketClient.once('value', function(snap) {
    		var data = new Array;
    		snap.forEach(function(o) {
    			if (o.key() != 'agents') {
    				data.push(o.key());
    			}
    		}.bind(this));
    		deferred.resolve(data);
    	}.bind(this));
    	return deferred.promise;
    }
}

module.exports = OrganizationCollection;
