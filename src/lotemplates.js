define([
    "./core",
    "./selector",
    "./traversing",
    "./callbacks",
    "./deferred",
    "./core/ready",
    "./ajax",
    "./event"
], function( jQuery ) {

    /**
     * @license
     * Lo-Dash 2.4.1 (Custom Build) <http://lodash.com/>
     * Build: `lodash underscore include="template" exports="none" -o lodash/lo_template.js`
     * Copyright 2012-2013 The Dojo Foundation <http://dojofoundation.org/>
     * Based on Underscore.js 1.5.2 <http://underscorejs.org/LICENSE>
     * Copyright 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     * Available under MIT license <http://lodash.com/license>
     */
    (function() {

        
        var reInterpolate = /<%=([\s\S]+?)%>/g;

        
        var reNoMatch = /($^)/;

        
        var reUnescapedString = /['\n\r\t\u2028\u2029\\]/g;

        
        var objectTypes = {
            'boolean': false,
            'function': true,
            'object': true,
            'number': false,
            'string': false,
            'undefined': false
        };

        
        var stringEscapes = {
            '\\': '\\',
            "'": "'",
            '\n': 'n',
            '\r': 'r',
            '\t': 't',
            '\u2028': 'u2028',
            '\u2029': 'u2029'
        };

        /*--------------------------------------------------------------------------*/

        /**
         * Used by `template` to escape characters for inclusion in compiled
         * string literals.
         *
         * @private
         * @param {string} match The matched character to escape.
         * @returns {string} Returns the escaped character.
         */
        function escapeStringChar(match) {
            return '\\' + stringEscapes[match];
        }

        /*--------------------------------------------------------------------------*/

        
        var objectProto = Object.prototype;

        
        var toString = objectProto.toString;

        
        var reNative = RegExp('^' +
            String(toString)
                .replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                .replace(/toString| for [^\]]+/g, '.*?') + '$'
        );

        
        var hasOwnProperty = objectProto.hasOwnProperty;

        /* Native method shortcuts for methods with the same name as other `lodash` methods */
        var nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys;

        /*--------------------------------------------------------------------------*/

        /**
         * Creates a `lodash` object which wraps the given value to enable intuitive
         * method chaining.
         *
         * In addition to Lo-Dash methods, wrappers also have the following `Array` methods:
         * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`, `splice`,
         * and `unshift`
         *
         * Chaining is supported in custom builds as long as the `value` method is
         * implicitly or explicitly included in the build.
         *
         * The chainable wrapper functions are:
         * `after`, `assign`, `bind`, `bindAll`, `bindKey`, `chain`, `compact`,
         * `compose`, `concat`, `countBy`, `create`, `createCallback`, `curry`,
         * `debounce`, `defaults`, `defer`, `delay`, `difference`, `filter`, `flatten`,
         * `forEach`, `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`,
         * `functions`, `groupBy`, `indexBy`, `initial`, `intersection`, `invert`,
         * `invoke`, `keys`, `map`, `max`, `memoize`, `merge`, `min`, `object`, `omit`,
         * `once`, `pairs`, `partial`, `partialRight`, `pick`, `pluck`, `pull`, `push`,
         * `range`, `reject`, `remove`, `rest`, `reverse`, `shuffle`, `slice`, `sort`,
         * `sortBy`, `splice`, `tap`, `throttle`, `times`, `toArray`, `transform`,
         * `union`, `uniq`, `unshift`, `unzip`, `values`, `where`, `without`, `wrap`,
         * and `zip`
         *
         * The non-chainable wrapper functions are:
         * `clone`, `cloneDeep`, `contains`, `escape`, `every`, `find`, `findIndex`,
         * `findKey`, `findLast`, `findLastIndex`, `findLastKey`, `has`, `identity`,
         * `indexOf`, `isArguments`, `isArray`, `isBoolean`, `isDate`, `isElement`,
         * `isEmpty`, `isEqual`, `isFinite`, `isFunction`, `isNaN`, `isNull`, `isNumber`,
         * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`, `join`,
         * `lastIndexOf`, `mixin`, `noConflict`, `parseInt`, `pop`, `random`, `reduce`,
         * `reduceRight`, `result`, `shift`, `size`, `some`, `sortedIndex`, `runInContext`,
         * `template`, `unescape`, `uniqueId`, and `value`
         *
         * The wrapper functions `first` and `last` return wrapped values when `n` is
         * provided, otherwise they return unwrapped values.
         *
         * Explicit chaining can be enabled by using the `_.chain` method.
         *
         * @name _
         * @constructor
         * @category Chaining
         * @param {*} value The value to wrap in a `lodash` instance.
         * @returns {Object} Returns a `lodash` instance.
         * @example
         *
         * var wrapped = _([1, 2, 3]);
         *
         * // returns an unwrapped value
         * wrapped.reduce(function(sum, num) {
   *   return sum + num;
   * });
         * // => 6
         *
         * // returns a wrapped value
         * var squares = wrapped.map(function(num) {
   *   return num * num;
   * });
         *
         * _.isArray(squares);
         * // => false
         *
         * _.isArray(squares.value());
         * // => true
         */
        function lodash() {
            // no operation performed
        }

        /**
         * By default, the template delimiters used by Lo-Dash are similar to those in
         * embedded Ruby (ERB). Change the following template settings to use alternative
         * delimiters.
         *
         * @static
         * @memberOf _
         * @type Object
         */
        lodash.templateSettings = {

            /**
             * Used to detect `data` property values to be HTML-escaped.
             *
             * @memberOf _.templateSettings
             * @type RegExp
             */
            'escape': /<%-([\s\S]+?)%>/g,

            /**
             * Used to detect code to be evaluated.
             *
             * @memberOf _.templateSettings
             * @type RegExp
             */
            'evaluate': /<%([\s\S]+?)%>/g,

            /**
             * Used to detect `data` property values to inject.
             *
             * @memberOf _.templateSettings
             * @type RegExp
             */
            'interpolate': reInterpolate,

            /**
             * Used to reference the data object in the template text.
             *
             * @memberOf _.templateSettings
             * @type string
             */
            'variable': ''
        };

        /*--------------------------------------------------------------------------*/

        /**
         * Used by `escape` to convert characters to HTML entities.
         *
         * @private
         * @param {string} match The matched character to escape.
         * @returns {string} Returns the escaped character.
         */
        function escapeHtmlChar(match) {
            return htmlEscapes[match];
        }

        /**
         * Checks if `value` is a native function.
         *
         * @private
         * @param {*} value The value to check.
         * @returns {boolean} Returns `true` if the `value` is a native function, else `false`.
         */
        function isNative(value) {
            return typeof value == 'function' && reNative.test(value);
        }

        /*--------------------------------------------------------------------------*/

        /**
         * A fallback implementation of `Object.keys` which produces an array of the
         * given object's own enumerable property names.
         *
         * @private
         * @type Function
         * @param {Object} object The object to inspect.
         * @returns {Array} Returns an array of property names.
         */
        var shimKeys = function(object) {
            var index, iterable = object, result = [];
            if (!iterable) return result;
            if (!(objectTypes[typeof object])) return result;
            for (index in iterable) {
                if (hasOwnProperty.call(iterable, index)) {
                    result.push(index);
                }
            }
            return result
        };

        /**
         * Creates an array composed of the own enumerable property names of an object.
         *
         * @static
         * @memberOf _
         * @category Objects
         * @param {Object} object The object to inspect.
         * @returns {Array} Returns an array of property names.
         * @example
         *
         * _.keys({ 'one': 1, 'two': 2, 'three': 3 });
         * // => ['one', 'two', 'three'] (property order is not guaranteed across environments)
         */
        var keys = !nativeKeys ? shimKeys : function(object) {
            if (!isObject(object)) {
                return [];
            }
            return nativeKeys(object);
        };

        /**
         * Used to convert characters to HTML entities:
         *
         * Though the `>` character is escaped for symmetry, characters like `>` and `/`
         * don't require escaping in HTML and have no special meaning unless they're part
         * of a tag or an unquoted attribute value.
         * http://mathiasbynens.be/notes/ambiguous-ampersands (under "semi-related fun fact")
         */
        var htmlEscapes = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };

        
        var reUnescapedHtml = RegExp('[' + keys(htmlEscapes).join('') + ']', 'g');

        function defaults(object) {
            if (!object) {
                return object;
            }
            for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
                var iterable = arguments[argsIndex];
                if (iterable) {
                    for (var key in iterable) {
                        if (typeof object[key] == 'undefined') {
                            object[key] = iterable[key];
                        }
                    }
                }
            }
            return object;
        }

        
        function isObject(value) {
            // check if the value is the ECMAScript language type of Object
            // http://es5.github.io/#x8
            // and avoid a V8 bug
            // http://code.google.com/p/v8/issues/detail?id=2291
            return !!(value && objectTypes[typeof value]);
        }

        
        function escape(string) {
            return string == null ? '' : String(string).replace(reUnescapedHtml, escapeHtmlChar);
        }

        
        function template(text, data, options) {
            var _ = lodash,
                settings = _.templateSettings;

            text = String(text || '');
            options = defaults({}, options, settings);

            var index = 0,
                source = "__p += '",
                variable = options.variable;

            var reDelimiters = RegExp(
                (options.escape || reNoMatch).source + '|' +
                (options.interpolate || reNoMatch).source + '|' +
                (options.evaluate || reNoMatch).source + '|$'
                , 'g');

            text.replace(reDelimiters, function(match, escapeValue, interpolateValue, evaluateValue, offset) {
                source += text.slice(index, offset).replace(reUnescapedString, escapeStringChar);
                if (escapeValue) {
                    source += "' +\n_.escape(" + escapeValue + ") +\n'";
                }
                if (evaluateValue) {
                    source += "';\n" + evaluateValue + ";\n__p += '";
                }
                if (interpolateValue) {
                    source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
                }
                index = offset + match.length;
                return match;
            });

            source += "';\n";
            if (!variable) {
                variable = 'obj';
                source = 'with (' + variable + ' || {}) {\n' + source + '\n}\n';
            }
            source = 'function(' + variable + ') {\n' +
            "var __t, __p = '', __j = Array.prototype.join;\n" +
            "function print() { __p += __j.call(arguments, '') }\n" +
            source +
            'return __p\n}';

            try {
                var result = Function('_', 'return ' + source)(_);
            } catch(e) {
                e.source = source;
                throw e;
            }
            if (data) {
                return result(data);
            }
            result.source = source;
            return result;
        }

        /*--------------------------------------------------------------------------*/

        lodash.defaults = defaults;
        lodash.keys = keys;

        /*--------------------------------------------------------------------------*/

        lodash.escape = escape;
        lodash.isObject = isObject;
        lodash.template = template;

        /*--------------------------------------------------------------------------*/

        /**
         * The semantic version number.
         *
         * @static
         * @memberOf _
         * @type string
         */
        lodash.VERSION = '2.4.1';

        jQuery.extend({
            template: lodash.template
        })
    }.call(this));



    return jQuery;

});