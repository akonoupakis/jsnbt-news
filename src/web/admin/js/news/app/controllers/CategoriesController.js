;(function () {
    "use strict";
    
    jsnbt.NewsCategoriesController = function ($scope, $route, $rootScope, $location, $data, $jsnbt, ModalService) {
        jsnbt.TreeControllerBase.apply(this, $scope.getBaseArguments($scope));
        
        $scope.prefix = $route.current.$$route.location ? $route.current.$$route.location.prefix : undefined;

        $scope.canViewSettings = function () {
            return $scope.prefix === '/modules/news';
        };


        $scope.viewSettings = function () {
            $location.next('/modules/news/settings');
        };

        $scope.canCreate = function () {
            return true;
        };


        $scope.create = function () {
            var url = $jsnbt.entities['articleList'].getCreateUrl(undefined, $scope.prefix);
            $location.next(url);
        };

        $scope.treeFn.canOpen = function (node) {
            return true;
        };

        $scope.treeFn.open = function (node) {
            var url = $jsnbt.entities[node.entity].getViewUrl(node, $scope.prefix);
            $location.next(url);
        };

        $scope.treeFn.canCreate = function (node) {
            return true;
        };

        $scope.treeFn.create = function (node) {
            var url = $jsnbt.entities['articleList'].getCreateUrl(node, $scope.prefix);
            $location.next(url);
        };

        $scope.treeFn.canEdit = function (node) {
            return true;
        };

        $scope.treeFn.edit = function (node) {
            var url = $jsnbt.entities[node.entity].getViewUrl(node, $scope.prefix);
            $location.next(url);
        };

        $scope.treeFn.canDelete = function (node) {
            return true;
        };

        $scope.treeFn.delete = function (node) {
            $data.nodes.get({
                hierarchy: node.id,
                id: {
                    $ne: [node.id]
                },
                $limit: 1
            }).then(function (nodes) {

                if (nodes.length > 0) {

                    ModalService.open({
                        title: 'oops',
                        message: 'this category is not empty and cannot be deleted',
                        controller: 'ErrorPromptController',
                        template: 'tmpl/core/modals/errorPrompt.html',
                        btn: {
                            ok: 'ok',
                            cancel: false
                        }
                    }).then(function (result) {
                       
                    });

                }
                else {

                    ModalService.open({
                        title: 'are you sure you want to permanently delete the category ' + node.title[$scope.defaults.language] + '?',
                        controller: 'DeletePromptController',
                        template: 'tmpl/core/modals/deletePrompt.html'
                    }).then(function (result) {
                        if (result) {
                            $data.nodes.del(node.id).then(function (nodeDeleteResults) {
                                $scope.remove(node);
                            }, function (nodeDeleteError) {
                                deferred.reject(nodeDeleteError);
                            });
                        }
                    });
                }

            }).catch(function (ex) {
                deferred.reject(ex);
            });
        };

        $scope.init();

    };
    jsnbt.NewsCategoriesController.prototype = Object.create(jsnbt.TreeControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoriesController', ['$scope', '$route', '$rootScope', '$location', '$data', '$jsnbt', 'ModalService', jsnbt.NewsCategoriesController]);
})();