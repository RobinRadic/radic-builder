define([
    "./core",

    "./async/each",
    "./async/waterfall",


    "./selector"
], function (jQuery, each, waterfall) {


    var _isArray = Array.isArray || function (maybeArray) {
            return Object.prototype.toString.call(maybeArray) === '[object Array]';
        };


    jQuery.extend({
        async: {
            each: each,
            waterfall: waterfall
        }
    });

    return jQuery;
});