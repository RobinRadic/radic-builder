define([
    "./core",
    "./core/init",
    "./cookie"
], function( jQuery ) {

    function defined(val){
        return typeof val !== 'undefined';
    }


    jQuery.extend({
        etag: function (name, url, val) {
            var key = 'github-' + jQuery.crypt.md5(url);
            var etags = jQuery.cookie(name);

            if (defined(etags)) {
                if (defined(val)) {
                    // set etag
                    etags[key] = val;
                    $.cookie(name, etags);
                } else if (defined(etags[key])) {
                    // get etag
                    return etags[key];
                } else {
                    // get etag, failed
                    return false;
                }
            } else {
                etags = {};
                etags[key] = val;
                $.cookie(name, etags);
            }
        }
    });


    return jQuery;

});