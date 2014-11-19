define([
    "./core",
    "./github",
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


    /**
     * Gitter is an extension to the github module. It provides several utilities, shortcuts, and stuff i dont know yet
     *
     * It requires more dependencies, especially from lodash.
     */


    var gitter2 = {
        user: 'RobinRadic',
        getRepositories: function (user) {
            user = user || this.user;
            $.github.user.repos(user, function (repos) {
                console.log(repos);
            });
        }
    };


    var sortMethods = ['size', 'stars', 'watchers', 'forks', 'issues', 'created', 'updated', 'pushed'];

    var gitter = {
        getSortMethods: function () {
            return sortMethods;
        },

        repoTopLanguages: function (languages) {
            var topLangs = [];
            for (var k in languages) {
                topLangs.push([k, languages[k]]);
            }

            topLangs.sort(function (a, b) {
                return b[1] - a[1];
            });
            return topLangs;
        },

        sortRepository: function (sortMethod, reposData) {
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
        }
    };

    jQuery.github.utils = gitter;

});