/**
 * Created by jdecano on 10/7/15.
 */
var ElasticSearch = require('elasticsearch');
var search = function(config) {
    this.config = config;
    this.client = new ElasticSearch.Client({
        host: config.endpoint
    });
    this.client.ping({}, function (error) {
        if (error) {
            console.trace('elasticsearch cluster is down!');
        } else {
            
        }
    });
}

search.prototype = {
    getClient : function() {
        return this.client;
    },
    insert   : function(params, callback) {
        if (typeof callback == 'function')
            this.client.create(params, callback)
        else
            this.client.create(params, callback)
    }
}
module.exports = search;