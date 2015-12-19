var parseUri = require('parseUri');
var _ = require('underscore');

module.exports = {
    
    domain: 'news',

    pointed: true,

    init: function (application) {

    },
    
    getName: function () {
        return require('../../package.json').name;
    },
    
    getVersion: function () {
        return require('../../package.json').version;
    },

    getConfig: function () {
        return require('../cfg/config.js');
    },

    routerPointer: function (server, ctx, next) {
        next();
    },

    url: {

        build: function (options, next) {
            if (options.node.entity === 'article') {
                for (var item in options.url) {
                    options.url[item] += '/article?aid=' + options.node.id;
                    next(options.url);
                }
            }
            else {
                next(options.url);
            }            
        },

        resolve: function (options, next) {

            if (options.page) {
                next(options);
            }
            else {
                var lastNode = _.last(options.nodes);
                var lastSeoName = _.last(options.seoNames);
                
                if ((lastSeoName || '').toLowerCase() === 'article') {

                    var uri = new parseUri(options.url);

                    var getArticle = function (parentId, articleId, cb) {
                        options.db.nodes.getCached({
                            "id": articleId,
                            entity: 'article',
                            parent: parentId
                        }, function (ex, article) {
                            if (ex) {
                                next();
                            }
                            else {
                                cb(article);
                            }
                        });
                    };

                    var patchTemplate = function (parent, options, cb) {
                        if (options.page.template && options.page.template !== '') {
                            options.template = options.page.template;
                            cb(options);
                        }
                        else {

                            var templ = undefined;

                            _.each(options.nodes, function (rnode) {
                                if (rnode.content.articleTemplate && !rnode.content.articleTemplate.inherits === true) {
                                    if (rnode.content.articleTemplate.value)
                                        templ = rnode.content.articleTemplate.value;
                                }
                            });

                            if (templ) {
                                options.template = templ;
                                cb(options);
                            }
                            else {
                                options.db.settings.getCached({
                                    domain: 'news'
                                }, function (ex, settings) {
                                    if (ex) {
                                        cb(options);
                                    }
                                    else {
                                        var set = _.first(settings);
                                        if (set && _.isObject(set.data) && set.data.articleTemplate) {
                                            options.template = set.data.articleTemplate;
                                        }

                                        cb(options);
                                    }
                                });
                            }
                        }
                    };

                    if (lastNode.domain === 'core' && lastNode.entity === 'pointer') {

                        options.db.nodes.getCached({
                            "id": lastNode.pointer.nodeId,
                            entity: 'articleList'
                        }, function (ex, articleList) {
                            if (ex) {
                                next();
                            }
                            else {
                                if (uri.queryKey.aid) {
                                    getArticle(articleList.id, uri.queryKey.aid, function (article) {
                                        options.page = article;
                                        options.nodes.push(articleList);
                                        options.nodes.push(article);
                                        patchTemplate(articleList, options, function (options) {
                                            next(options);
                                        });
                                    });
                                }
                                else {
                                    next();
                                }
                            }
                        });

                    }
                    else if (lastNode.entity === 'articleList') {
                        if (uri.queryKey.aid) {                            
                            getArticle(lastNode.id, uri.queryKey.aid, function (article) {
                                options.page = article;
                                options.nodes.push(article);
                                patchTemplate(lastNode, options, function (options) {
                                    next(options);
                                });
                            });
                        }
                        else {
                            next();
                        }
                    }
                }
                else {
                    next();
                }
            }
        }

    }

};