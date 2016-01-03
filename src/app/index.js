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

        build: function (server, options, next) {
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

        resolve: function (server, options, next) {

            if (options.page)
                return next(options);

            var lastNode = _.last(options.nodes);
            var lastSeoName = _.last(options.seoNames);

            if ((lastSeoName || '').toLowerCase() === 'article') {

                var uri = new parseUri(options.url);

                var getArticle = function (parentId, articleId, cb) {
                    var nodesStore = server.db.createStore('nodes');
                    nodesStore.get(function (x) {
                        x.query({
                            "id": articleId,
                            entity: 'article',
                            parent: parentId
                        });
                        x.single();
                        x.cached();
                    }, function (ex, article) {
                        if (ex) 
                            return cb(ex);
                        
                        cb(null, article);
                    });
                };

                var patchTemplate = function (parent, options, cb) {
                    if (options.page.template && options.page.template !== '') {
                        options.template = options.page.template;
                        cb(null, options);
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
                            cb(null, options);
                        }
                        else {
                            var settingsStore = server.db.createStore('settings');
                            settingsStore.get(function (x) {
                                x.query({
                                    domain: 'news'
                                });
                                x.cached();
                                x.single();
                            }, function (ex, settings) {
                                if (ex) 
                                    return cb(ex);
                                
                                if (settings && _.isObject(settings.data) && settings.data.articleTemplate) {
                                    options.template = settings.data.articleTemplate;
                                }

                                cb(options);
                            });
                        }
                    }
                };

                if (lastNode.domain === 'core' && lastNode.entity === 'pointer') {

                    var nodesStore = server.db.createStore('nodes');
                    nodesStore.get(function (x) {
                        x.query({
                            "id": lastNode.pointer.nodeId,
                            entity: 'articleList'
                        });
                        x.cached();
                    }, function (ex, articleList) {
                        if (ex) {
                            return next();
                        }
                        else {
                            if (uri.queryKey.aid) {
                                getArticle(articleList.id, uri.queryKey.aid, function (artErr, article) {
                                    if (artErr)
                                        return next();

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
                        getArticle(lastNode.id, uri.queryKey.aid, function (artErr, article) {
                            if (artErr)
                                return next();
                            
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

};