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

    function a(a){
        console.log(a);
    }
    jQuery.extend({


        github: {
            get: function (url, callback, config) {

                if(typeof config === 'undefined'){
                    config = {};
                }


                var giturl = 'http://api.github.com';


                // Cookeh opts
                var cookieName =  'github-' + jQuery.crypt.md5(url);
                $.cookie.json = true;


                var cookieOptions = jQuery.extend({
                    path: '/',
                    expires: 1
                }, config);


                // Ajax opts
                var ajaxOptions = {
                    url: giturl + "/" + url,
                    dataType: "jsonp",
                    ifModified: true,
                    error: function (data, err) {
                        console.warn('jsonp error', data, err);
                    },
                    success: function (results, txtstatus, xhr) {
                        console.log('succcess', results);
                        if (results.meta.status >= 400 && results.data.message) {
                            console.warn(results.data.message);
                        }
                        else if (results.meta.status === 200) {
                            $.cookie(cookieName, results.data);
                        }

                        if (typeof callback === 'function') {
                            return callback(results.data);
                        }
                    }
                };



                // Process as needed





                var cached = $.cookie(cookieName);
                if (typeof cached !== 'undefined' && typeof callback === 'function') {
                    a('return callback');
                    return callback(cached);
                } else {
                   return $.ajax(ajaxOptions);
                }

            }
        }
    });

    return jQuery;
});