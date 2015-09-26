;(function () {
    "use strict";

    var NewsCategoryController = function ($scope, $route, $rootScope, $location, $q, $data) {
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

        $scope.prefix = $route.current.$$route.location ? $route.current.$$route.location.prefix : undefined;
        $scope.offset = _.str.trim($scope.prefix || '', '/').split('/').length;
        
        $scope.values.articleTemplate = '';
        $scope.draftValues.articleTemplate = '';

        $scope.enqueue('load', function () {
            var deferred = $q.defer();

            if (!$scope.isNew()) {
                $scope.values.articleTemplate = $scope.node.content.articleTemplate ? ($scope.node.content.articleTemplate.value || '') : '';
                $scope.draftValues.articleTemplate = $scope.node.content.articleTemplate ? ($scope.node.content.articleTemplate.value || '') : '';
            }

            deferred.resolve();

            return deferred.promise;
        });

        var setLocationFn = $scope.setLocation;
        $scope.setLocation = function () {
            var deferred = $q.defer();

            setLocationFn.apply(this, arguments).then(function (response) {
                $scope.getNodeBreadcrumb($scope.isNew() ? { id: 'new', parent: $scope.id.substring(4) } : $scope.node, $scope.prefix).then(function (bc) {

                    var offset = $scope.offset;
                    var remaining = 1;
                    if ($scope.prefix === '/content/nodes/news' && $scope.offset === 3) {
                        offset--;
                        remaining++;
                    }

                    response.splice(offset);

                    _.each(bc, function (c) {
                        response.push(c);
                    });

                    deferred.resolve(response);

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

        $scope.enqueue('patch', function (node) {
            var deferred = $q.defer();

            if (!node.content.articleTemplate)
                node.content.articleTemplate = {};

            node.content.articleTemplate.value = !node.content.articleTemplate.inherits ? $scope.values.articleTemplate : '';

            deferred.resolve();

            return deferred.promise;
        });
       
        $scope.enqueue('set', $scope.setSelectedArticleTemplate);
        
        $scope.init();
    };
    NewsCategoryController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoryController', ['$scope', '$route', '$rootScope', '$location', '$q', '$data', NewsCategoryController]);

})();