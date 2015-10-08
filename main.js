/**
 * Created by jdecano on 10/7/15.
 */
var config       = require('./config.js');
var generator    = require('./app/generator.js');
var builder = new generator(config);
builder.run();