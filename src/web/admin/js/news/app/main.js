; (function () {
    "use strict";
    
    var _prefix = '/modules/news';

    var articleListEntity = jsnbt.entities['articleList'];

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

    angular.module("jsnbt-news", ['ngRoute'])
    .config(['$routeProvider',
        function ($routeProvider) {

            var TEMPLATE_BASE = jsnbt.constants.TEMPLATE_BASE;

            var router = new jsnbt.router('news', $routeProvider);

            var routes = {
                categories: function (x) {
                    x.section('news');
                    x.baseTemplate(TEMPLATE_BASE.list);
                    x.template('tmpl/news/categories.html');
                    x.scope({
                        prefix: '/modules/news',
                        entities: ['articleList'],
                        cacheKey: 'content:news:nodes'
                    });
                    x.controller('NewsCategoriesController');
                },
                settings: function (x) {
                    x.section('news');
                    x.baseTemplate(TEMPLATE_BASE.settings);
                    x.template('tmpl/news/settings.html');
                    x.scope({
                        prefix: '/modules/news'
                    });
                    x.controller('NewsSettingsController');
                },
                articles: function (x) {
                    x.section('news');
                    x.baseTemplate(TEMPLATE_BASE.list);
                    x.template('tmpl/news/articles.html');
                    x.scope({
                        prefix: '/modules/news'
                    });
                    x.controller('NewsArticlesController');
                },
                category: function (x) {
                    x.section('news');
                    x.baseTemplate(TEMPLATE_BASE.nodeForm);
                    x.template('tmpl/news/category.html');
                    x.scope({
                        prefix: '/modules/news',
                        entity: 'articleList'
                    });
                    x.controller('NewsCategoryController');
                },
                article: function (x) {
                    x.section('news');
                    x.baseTemplate(TEMPLATE_BASE.nodeForm);
                    x.template('tmpl/news/article.html');
                    x.scope({
                        prefix: '/modules/news',
                        entity: 'article'
                    });
                    x.controller('NewsArticleController');
                }
            };
            
            router.when('/modules/news', routes.categories);
            router.when('/content/news', function(x){
                routes.categories(x);
                x.scope({
                    prefix: '/content/news'
                });
            });

            router.when('/modules/news/settings', routes.settings);

            router.when('/modules/news/articles/:id', routes.articles);
            router.when('/content/news/articles/:id', function(x){
                routes.articles(x);
                x.scope({
                    prefix: '/content/news'
                });
            });
            router.when('/content/nodes/news/articles/:id', function(x){
                routes.articles(x);
                x.scope({
                    prefix: '/content/nodes/news'
                });
            });

            router.when('/modules/news/category/:id', routes.category);
            router.when('/content/news/category/:id', function(x) {
                routes.category(x);
                x.scope({
                    prefix: '/content/news'
                });
            });

            router.when('/content/nodes/news/category/:id', function (x) {
                routes.category(x);
                x.scope({
                    prefix: '/content/nodes/news'
                });
            });

            router.when('/modules/news/article/:id', routes.article)
            router.when('/content/news/article/:id', function (x) {
                routes.article(x);
                x.scope({
                    prefix: '/content/news'
                });
            });
            router.when('/content/nodes/news/article/:id', function (x) {
                routes.article(x);
                x.scope({
                    prefix: '/content/nodes/news'
                });
            });

        }]);
})();