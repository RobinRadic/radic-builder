define([
    "./core"
], function( jQuery ) {

    function wordwrap(str, width, spaceReplacer) {
        if (str.length>width) {
                      str = str.substr(0, width) + spaceReplacer;
        }
        return str;
    }

    jQuery.extend({ wordwrap: wordwrap })

    return jQuery;
});