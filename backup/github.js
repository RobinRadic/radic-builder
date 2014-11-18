define([
    "./core",
    "./selector",
    "./traversing",
    "./callbacks",
    "./deferred",
    "./core/ready",
    "./ajax",
    "./event",
    "./cookie",
    "./crypt",
    "./lodash"
], function (jQuery) {


    jQuery.extend({
        github: {
            options: {
                url: 'http://api.github.com',
                cache: true,
                resultFilter: null
            },
            get: function (uri, callback, config) {

                // Options
                if (typeof config === 'undefined') {
                    config = {};
                }

                var options = jQuery.cloneDeep(this.options);
                jQuery.extend(options, config);

                // Create name for cookie
                var cookieName = uri;

                // Ajax opts
                var ajaxOptions = jQuery.extend({
                    url: options.url + "/" + uri,
                    dataType: "jsonp",
                    error: function (data, err) {
                        console.error('jsonp error', data, err);
                    },
                    success: function (results, txtstatus, xhr) {

                        var result_data = typeof options.resultFilter === 'function' ? options.resultFilter(results.data) : results.data;

                        if (results.meta.status >= 400 && results.data.message) {

                            console.warn(results.data.message);

                        } else if (results.meta.status === 200) {

                            if (options.cache) {
                                $.cookie.set(cookieName, result_data, {
                                    json: true
                                });
                            }
                        }

                        if (typeof callback === 'function') {
                            return callback(result_data);
                        }
                    }
                }, config);


                // Process as needed
                if (options.cache) {
                    var cached = $.cookie.get(cookieName, { json: true });
                    if (typeof cached !== 'undefined' && cached && typeof callback === 'function') {
                        return callback(cached);
                    }
                    $.ajax(ajaxOptions);
                }

            },
            filters: {
                // removes [choices] from object and returns the result
                omitFromObject: function(obj, choices){
                    return $.omit(obj, choices);
                },

                // picks [choices] from object and returns the result
                pickFromObject: function(obj, choices){
                    return $.pick(obj, choices)
                },

                // loops trough an array with objects and [action=omit/pick] your [choices].
                objectArray: function(array, action, choices){
                    if( ! jQuery.isArray(array) ) return false;

                    for(var i = 0; i < array.length; i++){
                        array[i] = $[action](array[i], choices);
                    }

                    return array;
                }
            }
        }
    });

    return jQuery;
});