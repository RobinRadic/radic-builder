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
 https://github.com/Benvie/fat-grabby-hands
 ******************************************************************************/

(function (factory) {

        factory(jQuery);

}(function ($) {


    $.widget('radic.githubProfile', {
        version: '0.0.1',

        options: {
            username: '',
            sortBy: 'stars', // possible: 'stars', 'updateTime'
            reposHeaderText: 'Most starred',
            maxRepos: 5,
            templatePath: 'widgets/github-profile.tpl'
        },

        _create: function () {
            var self = this;
            self._getData(function (data) {
                console.log(data);
                var templateHTML = $(data.tpl).html();
                var template = jQuery.template(templateHTML);
                var $widget = $(template(data));
                self.element.append(template(data))
            });
        },

// _getData, _getDataTopLanguages, _getDataTopRepos, _combineData

        _fetchData: function (callback) {
            var self = this;
            var username = this.options.username;

            $.waterfall([
                function (done) {
                    $.github.user(username, function (userData) {
                        done(null, userData);
                    });
                },
                function (userData, done) {
                    $.github.users.repos(username, null, 1, 100, function (repoData) {
                        done(null, {user: userData, repos: repoData});
                    })
                },
                function (apiData, done) {
                    apiData.languages = {};
                    $.async.each(apiData.repos, function(repo, next){
                        $.github.repos.languages(username, repo.name, function(langData){
                            $.each(langData, function(i, lang){
                                if(typeof apiData.languages[i] === 'undefined'){
                                    apiData.languages[i] = lang;
                                } else {
                                    apiData.languages[i] += lang;
                                }
                            });
                            next();
                        });
                    }, function(){
                        done(null, apiData)
                    })
                },
                function (apiData, done) {
                    $.get(self.options.templatePath, function (templateData) {
                        console.log(templateData, apiData);
                        apiData.tpl = templateData;
                        done(null, apiData);

                    })
                }
            ], function (err, result) {
                if (typeof callback === 'function') callback(result);
            });
        },

        _sortLanguages: function (languages) {
            var topLangs = [];
            for (var k in languages) {
                topLangs.push([k, languages[k]]);
            }

            topLangs.sort(function (a, b) {
                return b[1] - a[1];
            });
            return topLangs;
        },

        _sortRepositories: function (reposData) {
            var self = this;
            reposData.sort(function (a, b) {
                // sorted by last commit
                if (self.options.sortBy == 'stars') {
                    return b.stargazers_count - a.stargazers_count;
                } else {
                    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                }
            });


            return reposData.slice(0, self.options.maxRepos);
        },

        _getData: function (callback) {
            var self = this;
            var combined = {};
            $.waterfall([
                function (done) {
                    self._fetchData(function(data){
                        // data.user data.tpl data.repos
                        done(null, data)
                    });
                },
                function (data, done) {
                    data.topRepos = self._sortRepositories(data.repos);
                    done(null, data)
                },
                function (data, done) {
                    data.topLanguages = self._sortLanguages(data.languages);
                    done(null, data)
                }
            ], function (err, result) {
                callback(result);
            })
        },


        /* The _init method is called after _create when the widget is first applied to its elements.
         The _init method is also called every time thereafter when the widget is invoked with no arguments or with options.
         This method is the recommended place for setting up more complex initialization and is a good way to support reset functionality for the widget if this is required.
         It's common for widgets to not implement an _init method. */
        _init: function (callback) {


        },



        _getCreateEventData: function () {

        },

        _destroy: function () {
            this.element.html('');
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
        },


    });

}));

/*,
 'id', 'full_name', 'created_at', 'updated_at',
 'pushed_at', 'git_url', 'size', 'watchers_count', 'stargazers_count',
 'has_issues', 'has_downloads', 'has_wiki', 'has_pages', 'forks_count',
 'forks', 'watchers', 'open_issues_count', 'language']);*/