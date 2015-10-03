;(function () {
    "use strict";

    var NewsCategoryController = function ($scope, $route, $rootScope, $location, $q, $data, $logger) {
        jsnbt.controllers.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('NewsCategoryController');

        $scope.values.articleTemplate = '';
        $scope.draftValues.articleTemplate = '';
        
        var getBreadcrumbFn = $scope.getBreadcrumb;
        $scope.getBreadcrumb = function () {
            var deferred = $q.defer();

            getBreadcrumbFn().then(function (breadcrumb) {
                $scope.getNodeBreadcrumb($scope.isNew() ? { id: 'new', parent: $scope.id.substring(4) } : $scope.node, $scope.prefix).then(function (bc) {

                    var offset = $scope.offset;
                    var remaining = 1;
                    if ($scope.prefix === '/content/nodes/news' && $scope.offset === 3) {
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

        $scope.setSelectedArticleTemplate = function () {
            var deferred = $q.defer();

            if (!$scope.node.content.articleTemplate) {
                $scope.node.content.articleTemplate = {
                    value: '',
                    inherits: false
                }
            }

            if ($scope.node.content.articleTemplate.inherits) {
                $scope.draftValues.articleTemplate = $scope.values.articleTemplate;

                var template = '';

                $($scope.node.hierarchy).each(function (i, item) {
                    var matchedNode = _.first(_.filter($scope.nodes, function (x) { return x.id === item; }));
                    if (matchedNode) {
                        if (matchedNode.content.articleTemplate && !matchedNode.content.articleTemplate.inherits) {
                            template = matchedNode.content.articleTemplate.value;
                        }
                    }
                    else {
                        return false;
                    }
                });


                $scope.values.articleTemplate = template;
                deferred.resolve(template);
            }
            else {
                $scope.values.articleTemplate = $scope.draftValues.articleTemplate;
                deferred.resolve($scope.values.articleTemplate);
            }

            return deferred.promise;
        };
    
        $scope.enqueue('set', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.articleTemplate = $scope.node.content.articleTemplate ? ($scope.node.content.articleTemplate.value || '') : '';
                $scope.draftValues.articleTemplate = $scope.node.content.articleTemplate ? ($scope.node.content.articleTemplate.value || '') : '';
            }

            deferred.resolve();

            return deferred.promise;
        });

        $scope.enqueue('set', $scope.setSelectedArticleTemplate);

        $scope.enqueue('publishing', function (node) {
            var deferred = $q.defer();

            if (!node.content.articleTemplate)
                node.content.articleTemplate = {};

            node.content.articleTemplate.value = !node.content.articleTemplate.inherits ? $scope.values.articleTemplate : '';

            deferred.resolve();

            return deferred.promise;
        });
               
        $scope.enqueue('watch', function () {
            var deferred = $q.defer();

            $scope.$watch('node.content.articleTemplate.inherits', function (newValue, prevValue) {
                if (newValue !== undefined && prevValue !== undefined) {
                    if (newValue === true) {
                        $scope.setHierarchyNodes().then(function () {
                            $scope.setSelectedArticleTemplate().catch(function (setEx) {
                                logger.error(setEx);
                            });
                        }, function (ex) {
                            logger.error(ex);
                        });
                    }
                    else {
                        $scope.setSelectedArticleTemplate().catch(function (setEx) {
                            logger.error(setEx);
                        });
                    }
                }
            });

            deferred.resolve();

            return deferred.promise;
        });

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });
    };
    NewsCategoryController.prototype = Object.create(jsnbt.controllers.NodeFormControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoryController', ['$scope', '$route', '$rootScope', '$location', '$q', '$data', '$logger', NewsCategoryController]);

})();