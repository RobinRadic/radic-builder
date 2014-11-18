define([
    "./core",
    "./core/init",
    "./cookie"
], function (jQuery) {

    /*!
     * async
     * https://github.com/caolan/async
     *
     * Copyright 2010-2014 Caolan McMahon
     * Released under the MIT license
     */

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(window, arguments);
        }
    }



    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    asyncEach = function (arr, iterator, callback) {
        callback = callback || function () {
        };
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done));
        });
        function done(err) {
            if (err) {
                callback(err);
                callback = function () {
                };
            }
            else {
                completed += 1;
                if (completed >= arr.length) {
                    callback();
                }
            }
        }
    };

    jQuery.extend({
        async: {
            each: asyncEach
        }
    });

    return jQuery;
});