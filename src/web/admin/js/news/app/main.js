; (function () {
    "use strict";

    for (var entityName in jsnbt.entities) {
        var articleListEntity = jsnbt.entities['articleList'];

        var _prefix = '/modules/news';

        articleListEntity.editable = true;
        articleListEntity.viewable = true;
        articleListEntity.deletable = true;
        articleListEntity.parentable = true;

        articleListEntity.getCreateUrl = function (node, prefix) {
            var prfx = prefix || _prefix;

            if (prfx === '/content/nodes')
                prfx += '/news';

            return prfx + '/category/new' + (node ? '-' + node.id : '');
        };
        articleListEntity.getEditUrl = function (node, prefix) {
            var prfx = prefix || _prefix;

            if (prfx === '/content/nodes')
                prfx += '/news';

            return prfx + '/category/' + node.id;
        };
        articleListEntity.getViewUrl = function (node, prefix) {
            var prfx = prefix || _prefix;

            if (prfx === '/content/nodes')
                prfx += '/news';

            return prfx + '/articles/' + node.id;
        };

        var articleEntity = jsnbt.entities['article'];

        articleEntity.editable = true;
        articleEntity.viewable = false;
        articleEntity.deletable = true;
        articleEntity.parentable = true;

        articleEntity.getCreateUrl = function (node, prefix) {
            var prfx = prefix || _prefix;
            return prfx + '/article/new-' + node.id;
        };
        articleEntity.getEditUrl = function (node, prefix) {
            var prfx = prefix || _prefix;
            return prfx + '/article/' + node.id;
        };
        articleEntity.getViewUrl = function (node) {
            throw new Error('na');
        };
    }

    angular.module("jsnbt-news", ['ngRoute'])
    .config(['$routeProvider',
        function ($routeProvider) {

            var router = angular.getRouter($routeProvider);

            var getCategoriesOptions = function (definition) {

                var obj = {};
                $.extend(true, obj, {
                    domain: 'news',
                    section: 'news',
                    controller: 'NewsCategoriesController',
                    baseTemplateUrl: 'tmpl/core/base/list.html',
                    templateUrl: 'tmpl/news/categories.html',
                    entities: ['articleList'],
                    cacheKey: 'content:news:nodes',
                    location: {
                        prefix: '/modules/news'
                    }
                }, definition);

                return obj;
            };

            var getSettingsOptions = function (definition) {

                var obj = {};
                $.extend(true, obj, {
                    controller: 'NewsSettingsController',
                    baseTemplateUrl: 'tmpl/core/base/settings.html',
                    templateUrl: 'tmpl/news/settings.html',
                    section: 'news',
                    domain: 'news',
                    location: {
                        prefix: '/modules/news'
                    }
                }, definition);

                return obj;
            };

            var getArticlesOptions = function (definition) {

                var obj = {};
                $.extend(true, obj, {
                    baseTemplateUrl: 'tmpl/core/base/list.html',
                    templateUrl: 'tmpl/news/articles.html',
                    controller: 'NewsArticlesController',
                    location: {
                        prefix: '/modules/news'
                    }
                }, definition);

                return obj;
            };

            var getCategoryOptions = function (definition) {

                var obj = {};
                $.extend(true, obj, {
                    controller: 'NewsCategoryController',
                    baseTemplateUrl: 'tmpl/core/base/node.html',
                    templateUrl: 'tmpl/news/category.html',
                    section: 'news',
                    domain: 'news',
                    entity: 'articleList',
                    location: {
                        prefix: '/modules/news'
                    }
                }, definition);

                return obj;
            };

            var getArticleOptions = function (definition) {

                var obj = {};
                $.extend(true, obj, {
                    controller: 'NewsArticleController',
                    baseTemplateUrl: 'tmpl/core/base/node.html',
                    templateUrl: 'tmpl/news/article.html',
                    section: 'news',
                    domain: 'news',
                    entity: 'article',
                    location: {
                        prefix: '/modules/news'
                    }
                }, definition);

                return obj;
            };

            router
                .when('/modules/news', getCategoriesOptions())
                .when('/content/news', getCategoriesOptions({
                    location: {
                        prefix: '/content/news'
                    }
                }))

                .when('/modules/news/settings', getSettingsOptions())
                .when('/content/news/settings', getSettingsOptions({
                    location: {
                        prefix: '/content/news'
                    }
                }))

                .when('/modules/news/articles/:id', getArticlesOptions())
                .when('/content/news/articles/:id', getArticlesOptions({
                    location: {
                        prefix: '/content/news'
                    }
                }))
                .when('/content/nodes/news/articles/:id', getArticlesOptions({
                    location: {
                        prefix: '/content/nodes/news'
                    }
                }))

                .when('/modules/news/category/:id', getCategoryOptions())
                .when('/content/news/category/:id', getCategoryOptions({
                    location: {
                        prefix: '/content/news'
                    }
                }))
                .when('/content/nodes/news/category/:id', getCategoryOptions({
                    location: {
                        prefix: '/content/nodes/news'
                    }
                }))

                .when('/modules/news/article/:id', getArticleOptions())
                .when('/content/news/article/:id', getArticleOptions({
                    location: {
                        prefix: '/content/news'
                    }
                }))
                .when('/content/nodes/news/article/:id', getArticleOptions({
                    location: {
                        prefix: '/content/nodes/news'
                    }
                }));
        }]);
})();