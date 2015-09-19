;(function () {
    "use strict";
    
    jsnbt.NewsCategoriesController = function ($scope, $rootScope, $location, $data, ModalService) {
        jsnbt.TreeControllerBase.apply(this, $scope.getBaseArguments($scope));
        
        $scope.back = function () {
            $location.previous('/modules');
        };

        $scope.canViewSettings = function () {
            return true;
        };


        $scope.viewSettings = function () {
            $location.next('/modules/news/settings');
        };

        $scope.canCreate = function () {
            return true;
        };


        $scope.create = function (node) {
            $location.next('/modules/news/category/new');
        };

        $scope.treeFn.canOpen = function (node) {
            return true;
        };

        $scope.treeFn.open = function (node) {
            $location.next('/modules/news/' + node.id);
        };

        $scope.treeFn.canCreate = function (node) {
            return true;
        };

        $scope.treeFn.create = function (node) {
            $location.next('/modules/news/category/new-' + node.id);
        };

        $scope.treeFn.canEdit = function (node) {
            return true;
        };

        $scope.treeFn.edit = function (node) {
            var url = '';

            switch (node.entity) {
                case "articleList":
                    url = '/modules/news/category/' + node.id;
                    break;
                case "article":
                    url = '/modules/news/article/' + node.id;
                    break;
            }

            $location.next(url);
        };

        $scope.treeFn.canDelete = function (node) {
            return node.childCount === 0;
        };

        $scope.treeFn.delete = function (node) {
            ModalService.open({
                title: 'are you sure you want to permanently delete the node ' + node.name + '?',
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
        };

        $scope.init();

    };
    jsnbt.NewsCategoriesController.prototype = Object.create(jsnbt.TreeControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoriesController', ['$scope', '$rootScope', '$location', '$data', 'ModalService', jsnbt.NewsCategoriesController]);
})();