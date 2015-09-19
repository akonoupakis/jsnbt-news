; (function () {
    "use strict";

    for (var entityName in jsnbt.entities) {
        var articleListEntity = jsnbt.entities['articleList'];

        articleListEntity.editable = true;
        articleListEntity.viewable = true;
        articleListEntity.deletable = true;
        articleListEntity.parentable = true;

        articleListEntity.getCreateUrl = function (node) {
            return '/modules/news/category/new' + (node ? '-' + node.id : '');
        };
        articleListEntity.getEditUrl = function (node) {
            return '/modules/news/category/' + node.id;
        };
        articleListEntity.getViewUrl = function (node) {
            return '/modules/news/' + node.id;
        };

        var articleEntity = jsnbt.entities['article'];

        articleEntity.editable = true;
        articleEntity.viewable = false;
        articleEntity.deletable = true;
        articleEntity.parentable = true;

        articleEntity.getCreateUrl = function (node) {
            return '/modules/news/article/new-' + node.id;
        };
        articleEntity.getEditUrl = function (node) {
            return '/modules/news/article/' + node.id;
        };
        articleEntity.getViewUrl = function (node) {
            throw new Error('na');
        };
    }

    angular.module("jsnbt-news", ['ngRoute'])
    .config(['$routeProvider',
        function ($routeProvider) {

            var router = angular.getRouter($routeProvider);

            router
                .when('/modules/news', {
                    domain: 'news',
                    section: 'news',
                    controller: 'NewsCategoriesController',
                    baseTemplateUrl: 'tmpl/core/base/list.html',
                    templateUrl: 'tmpl/news/categories.html',
                    entities: ['articleList'],
                    cacheKey: 'content:news:nodes'
                })
                .when('/modules/news/settings', {
                    controller: 'NewsSettingsController',
                    baseTemplateUrl: 'tmpl/core/base/settings.html',
                    templateUrl: 'tmpl/news/settingsForm.html',
                    section: 'news',
                    domain: 'news'
                })
                .when('/modules/news/category', {
                    redirectTo: '/modules/news'
                })
                .when('/modules/news/category/:id', {
                    controller: 'NewsCategoryFormController',
                    baseTemplateUrl: 'tmpl/core/base/node.html',
                    templateUrl: 'tmpl/news/categoryForm.html',
                    section: 'news',
                    domain: 'news',
                    entity: 'articleList',
                    location: { offset: 2 }
                })
                .when('/modules/news/article', {
                    redirectTo: '/modules/news'
                })
                .when('/modules/news/article/:id', {
                    controller: 'NewsArticleFormController',
                    baseTemplateUrl: 'tmpl/core/base/node.html',
                    templateUrl: 'tmpl/news/articleForm.html',
                    section: 'news',
                    domain: 'news',
                    entity: 'article',
                    location: { offset: 2 }
                })
                .when('/modules/news/:id', {
                    baseTemplateUrl: 'tmpl/core/base/list.html',
                    templateUrl: 'tmpl/news/category.html',
                    controller: 'NewsCategoryController'
                });
        }]);
})();