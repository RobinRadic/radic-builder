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
            var self = this;
            self._fetchData(function(data){
                self._render(data);
            });
        },

        /* The _init method is called after _create when the widget is first applied to its elements.
        The _init method is also called every time thereafter when the widget is invoked with no arguments or with options.
        This method is the recommended place for setting up more complex initialization and is a good way to support reset functionality for the widget if this is required.
        It's common for widgets to not implement an _init method. */
        _init: function (callback) {


        },

        _render: function(apiData){
            var self = this;
            var options = this.options;
            var $root = this.element;



            var profile = function () {
                var $profile = document.createElement('div'),
                    $name = document.createElement('a'),
                    $avatar = document.createElement('img'),
                    $stats = document.createElement('div'),
                    $followContainer = document.createElement('div'),
                    $followButton = document.createElement('a'),
                    $followers = document.createElement('span');

                $name.href = apiData.user.html_url;
                $name.className = 'name';
                $name.appendChild(document.createTextNode(apiData.user.name));

                $avatar.src = apiData.user.avatar_url;
                $avatar.className = 'avatar';

                $followButton.href = $name.href;
                $followButton.className = 'follow-button';
                $followButton.innerHTML = 'Follow @' + this.user;

                $followers.href = apiData.user.followers_url;
                $followers.className = 'followers';
                $followers.innerHTML = apiData.user.followers;

                $followContainer.className = 'followMe';
                $followContainer.appendChild($followButton);
                $followContainer.appendChild($followers);

                $profile.appendChild($avatar);
                $profile.appendChild($name);
                $profile.appendChild($followContainer);
                $profile.appendChild($stats);
                $profile.classList.add('profile');

                return $($profile);
            };

            var base = function () {
                self._destroy();
                self.element.addClass('gh-profile-widget');

                var $root = self.element[0];

                // clear root template element to prepare space for widget
                while ($root.hasChildNodes()) {
                    $root.removeChild($root.firstChild);
                }

                //
                // API doesen't return errors, try to built widget
                var $profile = profile.bind(this)();

                /*
                 this.getTopLanguages((function () {
                 var $langs = this.render.langs.bind(this)();
                 $profile.appendChild($langs);
                 }).bind(this));
                 */
                $root.appendChild($profile[0]);

                if (options.maxRepos > 0) {
                    var $repos = this.repos.bind(this)(options.sortBy, options.maxRepos),
                        $reposHeader = document.createElement('span');
                    $reposHeader.className = 'header';
                    $reposHeader.appendChild(document.createTextNode(options.reposHeaderText + ' repositories'));

                    $repos.insertBefore($reposHeader, $repos.firstChild);
                    $root.appendChild($repos);
                }
            };


            var repos = function () {
                var reposData = apiData.repos;

                var $reposList = document.createElement('div');

                reposData.sort(function (a, b) {
                    // sorted by last commit
                    if (sortyBy == 'stars') {
                        return b.stargazers_count - a.stargazers_count;
                    } else {
                        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
                    }
                });

                for (var i = 0; i < options.maxRepos && reposData[i]; i++) {
                    var updated = new Date(reposData[i].updated_at);
                    var $repoLink = document.createElement('a');

                    $repoLink.href = reposData[i].html_url;
                    $repoLink.title = reposData[i].description;
                    $repoLink.innerHTML += '<span class="repo-name">' + reposData[i].name + '</span>';
                    $repoLink.innerHTML += '<span class="updated">Updated: ' + updated.toLocaleDateString() + '</span>';
                    $repoLink.innerHTML += '<span class="star">' + reposData[i].stargazers_count + '</span>';

                    $reposList.appendChild($repoLink);
                }

                $reposList.className = 'repos';
                return $reposList;
            };

            /*return {
                base: base,
                profile: profile,
                repos: repos
            };*/

            base();
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



        _fetchData: function(callback){
            var self = this;
            var username = this.options.username;

            $.waterfall([
                function(done){
                    $.github.users(username, function(userData){
                        done(null, userData);
                    });
                },
                function(userData, done){
                    $.github.users.repos(username, null, 1, 100, function(repoData){
                        done(null, { user: userData, repos: repoData });
                    })
                }
            ], function(err, result){
                if(typeof callback === 'function') callback(result);
            });
        }




    });

}));

/*,
 'id', 'full_name', 'created_at', 'updated_at',
 'pushed_at', 'git_url', 'size', 'watchers_count', 'stargazers_count',
 'has_issues', 'has_downloads', 'has_wiki', 'has_pages', 'forks_count',
 'forks', 'watchers', 'open_issues_count', 'language']);*/