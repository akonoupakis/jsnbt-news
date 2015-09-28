﻿;(function () {
    "use strict";
    
    jsnbt.NewsCategoriesController = function ($scope, $route, $rootScope, $location, $data, $jsnbt, $logger, ModalService) {
        jsnbt.TreeControllerBase.apply(this, $scope.getBaseArguments($scope));

        var logger = $logger.create('NewsCategoriesController');
        
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

        $scope.treeFn = {

            canOpen: function (node) {
                return true;
            },

            open: function (node) {
                var url = $jsnbt.entities[node.entity].getViewUrl(node, $scope.prefix);
                $location.next(url);
            },

            canCreate: function (node) {
                return true;
            },

            create: function (node) {
                var url = $jsnbt.entities['articleList'].getCreateUrl(node, $scope.prefix);
                $location.next(url);
            },

            canEdit: function (node) {
                return true;
            },

            edit: function (node) {
                var url = $jsnbt.entities[node.entity].getEditUrl(node, $scope.prefix);
                $location.next(url);
            },

            canDelete: function (node) {
                return true;
            },

            delete: function (node) {
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
            }

        };

        $scope.init().catch(function (ex) {
            logger.error(ex);
        });

    };
    jsnbt.NewsCategoriesController.prototype = Object.create(jsnbt.TreeControllerBase.prototype);

    angular.module("jsnbt-news")
        .controller('NewsCategoriesController', ['$scope', '$route', '$rootScope', '$location', '$data', '$jsnbt', '$logger', 'ModalService', jsnbt.NewsCategoriesController]);
})();