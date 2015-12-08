;(function () {
    "use strict";

    var NewsCategoryController = function ($scope, $rootScope, $route, $location, $q, $data, $logger) {
        jsnbt.controllers.NodeFormControllerBase.apply(this, $rootScope.getBaseArguments($scope));

        var self = this;

        var logger = $logger.create('NewsCategoryController');

        $scope.values.articleTemplate = '';
        $scope.draftValues.articleTemplate = '';
         
        this.enqueue('set', '', function () {
            var deferred = $q.defer();

            if (!self.isNew()) {
                $scope.values.articleTemplate = $scope.model.content.articleTemplate ? ($scope.model.content.articleTemplate.value || '') : '';
                $scope.draftValues.articleTemplate = $scope.model.content.articleTemplate ? ($scope.model.content.articleTemplate.value || '') : '';
            }

            deferred.resolve();

            return deferred.promise;
        });

        this.enqueue('set', '', function () {
            var deferred = $q.defer();

            self.setSelectedArticleTemplate().then(function () {
                deferred.resolve();
            }).catch(function (ex) {
                deferred.reject(ex);
            });

            return deferred.promise;
        });

        this.enqueue('publishing', '', function (node) {
            var deferred = $q.defer();

            if (!node.content.articleTemplate)
                node.content.articleTemplate = {};

            node.content.articleTemplate.value = !node.content.articleTemplate.inherits ? $scope.values.articleTemplate : '';

            deferred.resolve();

            return deferred.promise;
        });
               
        this.enqueue('watch', '', function () {
            var deferred = $q.defer();

            $scope.$watch('node.content.articleTemplate.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    if (newValue === true) {
                        $scope.setHierarchyNodes().then(function () {
                            self.setSelectedArticleTemplate().catch(function (setEx) {
                                logger.error(setEx);
                            });
                        }, function (ex) {
                            logger.error(ex);
                        });
                    }
                    else {
                        self.setSelectedArticleTemplate().catch(function (setEx) {
                            logger.error(setEx);
                        });
                    }
                }
            });

            deferred.resolve();

            return deferred.promise;
        });

        this.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NewsCategoryController.prototype = Object.create(jsnbt.controllers.NodeFormControllerBase.prototype);

    NewsCategoryController.prototype.getBreadcrumb = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        jsnbt.controllers.NodeFormControllerBase.prototype.getBreadcrumb.apply(this, arguments).then(function (breadcrumb) {

            self.scope.getNodeBreadcrumb(self.isNew() ? { id: 'new', parent: self.scope.id.substring(4) } : self.scope.node, self.scope.prefix).then(function (bc) {

                var offset = self.scope.offset;
                var remaining = 1;
                if (self.scope.prefix === '/content/nodes/news' && self.scope.offset === 3) {
                    offset--;
                    remaining++;
                }

                breadcrumb.splice(offset);

                _.each(bc, function (c) {
                    breadcrumb.push(c);
                });

                deferred.resolve(breadcrumb);

            }, function (ex) {
                deferred.reject(ex);
            });

        }).catch(function (ex) {
            deferred.reject(ex);
        });

        return deferred.promise;
    };

    NewsCategoryController.prototype.setSelectedArticleTemplate = function () {
        var deferred = this.ctor.$q.defer();

        var self = this;

        if (!this.scope.model.content.articleTemplate) {
            this.scope.model.content.articleTemplate = {
                value: '',
                inherits: false
            }
        }

        if (this.scope.model.content.articleTemplate.inherits) {
            this.scope.draftValues.articleTemplate = this.scope.values.articleTemplate;

            var template = '';

            $(self.scope.model.hierarchy).each(function (i, item) {
                var matchedNode = _.first(_.filter(self.scope.nodes, function (x) { return x.id === item; }));
                if (matchedNode) {
                    if (matchedNode.content.articleTemplate && !matchedNode.content.articleTemplate.inherits) {
                        template = matchedNode.content.articleTemplate.value;
                    }
                }
                else {
                    return false;
                }
            });


            self.scope.values.articleTemplate = template;
            deferred.resolve(template);
        }
        else {
            self.scope.values.articleTemplate = self.scope.draftValues.articleTemplate;
            deferred.resolve(self.scope.values.articleTemplate);
        }

        return deferred.promise;
    };

    angular.module("jsnbt-news")
        .controller('NewsCategoryController', ['$scope', '$rootScope', '$route', '$location', '$q', '$data', '$logger', NewsCategoryController]);

})();