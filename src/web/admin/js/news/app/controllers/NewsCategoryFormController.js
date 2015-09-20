;(function () {
    "use strict";

    var NewsCategoryFormController = function ($scope, $rootScope, $location, $q, $data) {
        
        jsnbt.NodeFormControllerBase.apply(this, $scope.getBaseArguments($scope));

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

        $scope.setSelectedArticleTemplate = function () {
            var deferred = $q.defer();

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

        $scope.back = function () {
            if ($rootScope.location.previous) {
                $location.previous($rootScope.location.previous);
            }
            else {
                $location.previous('/modules/news');
            }
        };

        $scope.init();
    };
    NewsCategoryFormController.prototype = Object.create(jsnbt.NodeFormControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoryFormController', ['$scope', '$rootScope', '$location', '$q', '$data', NewsCategoryFormController]);

})();