define([
    "./core",
    "./core/init",
    "./selector"
], function (jQuery) {

    // wtb omit, pick, values, keys, where

    jQuery.extend({
        /*
         var characters = [
             { 'name': 'barney', 'age': 36 },
             { 'name': 'fred',   'age': 40 }
         ];

         pluck(characters, 'name');
         → ['barney', 'fred']
         */

        pluck: function(arr, key) {
            return $.map(arr, function(e) { return e[key]; })
        },

    })
    return jQuery;
});