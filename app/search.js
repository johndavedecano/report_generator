/**
 * Created by jdecano on 10/7/15.
 */
var http = require('http');
var ElasticSearch = require('elasticsearch');

var search = function(config) {
    this.config = config;
    this.client = new ElasticSearch.Client({
        host: this.config.endpoint + ':' + this.config.port
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
    }, 
    http : function(params) {
        // ElasticSearch Expects JSON not Querystring!
        var data = JSON.stringify(params.body);
        var post_options = {
            host: this.config.endpoint,
            port: this.config.port,
            path: '/' + params.index + '/' + params.type + '/' + params.id,
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };
        var post_req = http.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                console.log('Response: ' + chunk);
            });
        });
        post_req.write(data);
        post_req.end();
    }
}
module.exports = search;