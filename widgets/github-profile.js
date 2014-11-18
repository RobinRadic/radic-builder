/******************************************************************************

 The MIT License (MIT)

 Copyright © 2014 Robin Radic, Radic Technologies <info@radic.nl>

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 http://radic.mit-license.org/
 http://robinradic.github.io
 http://radic.nl

 ******************************************************************************/

(function (factory) {
    if (typeof define === "function" && define.amd) {

        // AMD. Register as an anonymous module.
        define([
            "jquery",
            "./core",
            "./widget"
        ], factory);
    } else {

        // Browser globals
        factory(jQuery);
    }
}(function ($) {


    $.widget('radic.githubProfile', {
        version: '0.0.1',


        options: {
            username: '',
            sortBy: 'stars', // possible: 'stars', 'updateTime'
            reposHeaderText: 'Most starred',
            maxRepos: 5
        },


        _create: function () {
            if (typeof $.github === 'undefined') {
                return console.error('jQuery.github is not found. This widget wont work without it');
            }
            //this._init();
        },

        _init: function () {
            var self = this;
            var username = this.options.username;
            this.data = {};

            $.waterfall([
                function(done){
                    info('getting user');
                    $.github.get('users/' + username, function (userData) {
                        self.data.user = userData;
                        ok('got user, falling to next');
                        done(null);
                    });
                },
                function(done){
                    info('getting user repos');

                    var filter = function(data){
                        return  $.github.filters.objectArray(data, 'pick', ['html_url', 'description', 'name']) ;
                    };

                    $.github.get('users/' + username + '/repos?page=1&per_page=40', function (repoData) {
                        self.data.repos = repoData;

                        ok('got user, falling to next');
                        done(null);

                    }, { resultFilter: filter });
                }
            ], function(){
                ok('waterfall done, result:');
                showcode(self.data);
            });

        },

        _render: {
            base: function () {
                this.element.addClass('gh-profile-widget');


            },
            profile: function () {

            },
            repos: function () {

            }
        },


        _getCreateEventData: function () {

        },

        _destroy: function () {

        },


        _setOptions: function (options) {
            // Ensure "value" option is set after other values (like max)
            var value = options.value;
            delete options.value;

            this._super(options);

            this.options.value = this._constrainedValue(value);
            this._refreshValue();
        },

        _setOption: function (key, value) {
            if (key === "max") {
                // Don't allow a max less than min
                value = Math.max(this.min, value);
            }
            if (key === "disabled") {
                this.element
                    .toggleClass("ui-state-disabled", !!value)
                    .attr("aria-disabled", value);
            }
            this._super(key, value);
        }
    });

}));

/*,
 'id', 'full_name', 'created_at', 'updated_at',
 'pushed_at', 'git_url', 'size', 'watchers_count', 'stargazers_count',
 'has_issues', 'has_downloads', 'has_wiki', 'has_pages', 'forks_count',
 'forks', 'watchers', 'open_issues_count', 'language']);*/