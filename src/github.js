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
    "./etag"
], function (jQuery) {


    jQuery.extend({
        github: {
            options: {
                url: 'http://api.github.com',
                cache: true
            },
            get: function (uri, callback, config) {

                // Options
                if (typeof config === 'undefined') {
                    config = {};
                }
                var options = {};
                jQuery.extend(options, this.options, config);

                // Create name for cookie
                var cookieName = 'github-' + jQuery.crypt.md5(uri);

                // Ajax opts
                var ajaxOptions = jQuery.extend({
                    url: options.url + "/" + uri,
                    dataType: "jsonp",
                    ifModified: true,
                    error: function (data, err) {
                        console.error('jsonp error', data, err);
                    },
                    success: function (results, txtstatus, xhr) {

                        console.log('github call success:', results, txtstatus, xhr);

                        if (results.meta.status >= 400 && results.data.message) {

                            console.warn(results.data.message);

                        } else if (results.meta.status === 200) {

                            if (options.cache) {
                                $.cookie.set(cookieName, results.data, {
                                    json: true
                                });
                            }
                        }

                        if (typeof callback === 'function') {
                            return callback(results.data);
                        }
                    }
                }, config);


                // Process as needed
                if (options.cache) {
                    var cached = $.cookie.get(cookieName);
                    if (typeof cached !== 'undefined' && cached && typeof callback === 'function') {
                        return callback(cached);
                    }
                    $.ajax(ajaxOptions);
                }

            },
            filters: {
                // removes [choices] from object and returns the result
                omitFromObject: function(obj, choices){

                },

                // picks [choices] from object and returns the result
                pickFromObject: function(obj, choices){

                },

                // loops trough an array with objects and [action=omit/pick] your [choices].
                objectArray: function(array, action, choices){
                    if( ! jQuery.isArray(repos) ) return false;


                }
            }
        }
    });

    return jQuery;
});